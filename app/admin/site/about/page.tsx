import { createClient } from '@/lib/supabase/server'
import SiteEditor from '../SiteEditor'

export const instant = false

export default async function AdminAboutPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('site_settings').select('content').eq('key', 'about_us').single()
  
  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>关于我们设置</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>修改前台“关于我们”页面的展示内容。</p>
      <SiteEditor settingKey="about_us" initialContent={data?.content || ''} title="关于我们文案" />
    </div>
  )
}