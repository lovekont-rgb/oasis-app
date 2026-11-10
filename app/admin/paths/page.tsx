import { createClient } from '@/lib/supabase/server'
import PathsAdminClient from './PathsAdminClient'

export const instant = false

export default async function AdminPathsPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('learning_paths').select('*').order('sort_order', { ascending: true })
  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>学习路径配置</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>管理前台阶段展示，支持动态增删改查与排序。</p>
      <PathsAdminClient initialPaths={data || []} />
    </div>
  )
}