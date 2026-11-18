import { createClient } from '@/lib/supabase/server'
import SettingsClient from './SettingsClient'

export const instant = false

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  return (
    <div>
      <h1 className="ui-title" style={{ fontSize: '2rem', marginBottom: '8px' }}>个人设置</h1>
      <p className="ui-subtitle" style={{ marginBottom: '40px' }}>管理你的创作者身份与安全设置。</p>
      
      <SettingsClient user={user} initialProfile={profile} />
    </div>
  )
}