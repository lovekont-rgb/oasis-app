import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import SettingsClient from './SettingsClient';

export const instant = false;

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* 仿照“我的收藏”的极简标题 */}
      <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '32px' }}>
        个人设置
      </h1>
      <SettingsClient initialUser={user} initialProfile={profile || {}} />
    </div>
  );
}