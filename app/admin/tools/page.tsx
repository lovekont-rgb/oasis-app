import { createClient } from '@/lib/supabase/server'
import ToolsClient from './ToolsClient'

// 防止预渲染崩溃
export const instant = false

export default async function AdminToolsPage() {
  const supabase = await createClient()
  
  // 按名称字母顺序拉取所有工具
  const { data: tools } = await supabase.from('tools').select('*').order('name')

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>工具矩阵管理</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>在这里上架新工具，或下架已失效的旧工具。</p>
      
      <ToolsClient initialTools={tools || []} />
    </div>
  )
}