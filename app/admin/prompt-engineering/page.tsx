import { createClient } from '@/lib/supabase/server'
import EngineeringAdminClient from './EngineeringAdminClient'

export const instant = false

export default async function AdminEngineeringPage() {
  const supabase = await createClient()
  const { data: items } = await supabase.from('prompt_engineering').select('*').order('sort_order')
  
  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>提示词工程配置</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>独立管理前台“提示词工程”页面的四大板块内容。</p>
      <EngineeringAdminClient items={items || []} />
    </div>
  )
}