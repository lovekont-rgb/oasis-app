import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Notification } from '@/lib/types/notification';
import NotificationsClient from './NotificationsClient';

export const instant = false;

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <main className="page-container">
      <div className="ui-badge">
        <span className="ui-badge-dot" />
        NOTIFICATIONS
      </div>
      <h1 className="ui-title">
        消息<span className="ui-title-gradient">中心</span>
      </h1>
      <p className="ui-subtitle">
        审核结果、官方回复、作品互动与系统公告，都会集中出现在这里。
      </p>

      <NotificationsClient initialItems={(data ?? []) as Notification[]} />
    </main>
  );
}