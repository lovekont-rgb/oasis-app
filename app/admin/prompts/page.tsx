import { createClient } from '@/lib/supabase/server'
import PromptsClient from './PromptsClient'

// 防止 Next.js 16 预渲染崩溃
export const instant = false

export default async function AdminPromptsPage() {
  const supabase = await createClient()
  
  // 按 ID 倒序拉取所有数据（最新的在最上面）
  const { data: prompts } = await supabase.from('prompts').select('*').order('id', { ascending: false })

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>提示词管理</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>在这里添加、查看或删除系统内的提示词模板。</p>
      
      <PromptsClient initialPrompts={prompts || []} />
    </div>
  )
}