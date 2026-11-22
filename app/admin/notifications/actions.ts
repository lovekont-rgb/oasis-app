'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function sendBroadcast(
  formData: FormData,
): Promise<{ success: boolean; error?: string; count?: number }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: '未登录' };

  const title = String(formData.get('title') ?? '').trim();
  const content = String(formData.get('content') ?? '').trim();
  const linkRaw = String(formData.get('link') ?? '').trim();
  const link = linkRaw.length > 0 ? linkRaw : null;

  if (!title || !content) {
    return { success: false, error: '标题和内容不能为空' };
  }
  if (title.length > 100) {
    return { success: false, error: '标题不能超过 100 字' };
  }
  if (content.length > 500) {
    return { success: false, error: '内容不能超过 500 字' };
  }
  if (link && !link.startsWith('/')) {
    return { success: false, error: '跳转链接必须以 / 开头（站内路径）' };
  }

  const { data, error } = await supabase.rpc('notify_broadcast', {
    p_title: title,
    p_content: content,
    p_link: link,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/notifications');
  revalidatePath('/notifications');
  return { success: true, count: (data as number) ?? 0 };
}