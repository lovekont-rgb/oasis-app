import { createClient } from '@/lib/supabase/server'
import SiteEditor from '../SiteEditor'

export const instant = false

export default async function AdminPrivacyPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('site_settings').select('content').eq('key', 'privacy_policy').single()
  
  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>隐私政策设置</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>修改前台“隐私政策”页面的展示内容。</p>
      <SiteEditor settingKey="privacy_policy" initialContent={data?.content || ''} title="隐私政策文案" />
    </div>
  )
}