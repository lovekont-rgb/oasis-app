import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/require-admin';
import NotificationsAdminClient from './NotificationsAdminClient';

export const instant = false;

export default async function AdminNotificationsPage() {
  const admin = await requireAdmin();
  if (!admin.ok) redirect('/login');

  return (
    <div>
      <h1
        style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: '2rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          marginBottom: 8,
        }}
      >
        消息推送
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
        向所有未封禁用户发送系统公告，用户会在铃铛与消息中心收到通知。
      </p>
      <NotificationsAdminClient />
    </div>
  );
}