'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function updateProfile(data: {
  username: string;
  bio: string;
  skills: string;
  github: string;
  avatar_url?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: '未登录' };

  // 保留原有的其他 social_links 字段，只更新 github
  const { data: oldProfile } = await supabase.from('profiles').select('social_links').eq('id', user.id).single();
  const currentLinks = oldProfile?.social_links || {};
  const newLinks = { ...currentLinks, github: data.github.trim() };

  const updateData: any = {
    username: data.username.trim(),
    bio: data.bio.trim(),
    skills: data.skills.split(/[,，]/).map(s => s.trim()).filter(Boolean),
    social_links: newLinks,
  };
  
  if (data.avatar_url) {
    updateData.avatar_url = data.avatar_url;
  }

  const { error } = await supabase.from('profiles').update(updateData).eq('id', user.id);
  
  if (error) return { success: false, error: error.message };
  revalidatePath('/dashboard/settings');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function updatePassword(newPassword: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: '未登录' };
  if (newPassword.length < 6) return { success: false, error: '密码至少 6 位' };

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteAccount() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: '未登录' };

  const { error } = await supabase.rpc('delete_own_account');
  
  if (error) return { success: false, error: error.message };
  return { success: true };
}