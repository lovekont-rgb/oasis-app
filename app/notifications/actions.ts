'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { Notification, NotificationFilter } from '@/lib/types/notification';

export async function getBellData(): Promise<{ count: number; items: Notification[] }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { count: 0, items: [] };
  const [countRes, itemsRes] = await Promise.all([
    supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false),
    supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
  ]);
  return {
    count: countRes.count ?? 0,
    items: (itemsRes.data ?? []) as Notification[],
  };
}

export async function markRead(id: number): Promise<{ success: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false };
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)
    .eq('user_id', user.id);
  if (error) return { success: false };
  revalidatePath('/notifications');
  return { success: true };
}

export async function markAllRead(): Promise<{ success: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false };
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', user.id)
    .eq('is_read', false);
  if (error) return { success: false };
  revalidatePath('/notifications');
  return { success: true };
}

export async function deleteNotification(id: number): Promise<{ success: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false };
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);
  if (error) return { success: false };
  revalidatePath('/notifications');
  return { success: true };
}

export async function loadMore(
  before: string,
  filter: NotificationFilter,
): Promise<{ items: Notification[] }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { items: [] };

  let q = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .lt('created_at', before)
    .order('created_at', { ascending: false })
    .limit(20);

  if (filter === 'unread') q = q.eq('is_read', false);
  else if (filter !== 'all') q = q.eq('type', filter);

  const { data } = await q;
  return { items: (data ?? []) as Notification[] };
}