import { createClient } from '@/lib/supabase/server'
import QaAdminClient from './QaAdminClient'

export const instant = false

export default async function AdminQaPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('community_questions').select('*').order('created_at', { ascending: false })
  
  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>问答与互助管理</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>查看用户的提问及 IP 归属地，并进行回复。</p>
      <QaAdminClient questions={data || []} />
    </div>
  )
}