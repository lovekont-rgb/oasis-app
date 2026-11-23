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
    <main className="page-container">
      <div className="ui-badge">
        <span className="ui-badge-dot" />
        SETTINGS
      </div>
      <h1 className="ui-title">
        个人<span className="ui-title-gradient">设置</span>
      </h1>
      <p className="ui-subtitle">
        管理你的个人资料、账号安全与第三方绑定。
      </p>

      <SettingsClient initialUser={user} initialProfile={profile || {}} />
    </main>
  );
}