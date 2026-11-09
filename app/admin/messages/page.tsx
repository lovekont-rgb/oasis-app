import { createClient } from '@/lib/supabase/server'
import MessagesClient from './MessagesClient'

export const instant = false

export default async function AdminMessagesPage() {
  const supabase = await createClient()
  const { data: messages } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>留言管理</h1>
        {/* ⚠️ 备忘录：未来做权限时，此页面必须限制为教师和管理员可见 (role === 'teacher' || 'admin') */}
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>查看并回复来自前台“联系我们”的留言。</p>
      
      <MessagesClient initialMessages={messages || []} />
    </div>
  )
}