import { createClient } from '@/lib/supabase/server'
import ProjectsAdminClient from './ProjectsAdminClient'

export const instant = false

export default async function AdminProjectsPage() {
  const supabase = await createClient()
  
  const [ { data: projects }, { data: signals } ] = await Promise.all([
    supabase.from('project_items').select('*').order('sort_order', { ascending: true }),
    supabase.from('market_signals').select('*').order('sort_order', { ascending: true })
  ])
  
  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>项目实战管理</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>在这里管理前台展示的项目卡片和真实市场信号。</p>
      
      <ProjectsAdminClient projects={projects || []} signals={signals || []} />
    </div>
  )
}