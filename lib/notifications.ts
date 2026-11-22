import { createClient } from '@/lib/supabase/server';
import type { Notification } from '@/lib/types/notification';

export async function getRecentNotifications(limit = 5): Promise<Notification[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);
  return (data ?? []) as Notification[];
}