import { createClient } from '@/lib/supabase/server'
import PromptsClient from './PromptsClient'

export const instant = false

export default async function AdminPromptsPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('prompts').select('*').order('id', { ascending: false })
  
  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>基础模板管理</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>用于管理“提示词工程”页面的基础公式与模板。</p>
      <PromptsClient initialPrompts={data || []} />
    </div>
  )
}