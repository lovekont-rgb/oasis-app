import { createClient } from '@/lib/supabase/server'
import ProjectDetailsClient from './ProjectDetailsClient'

export const instant = false

export default async function AdminProjectDetailsPage() {
  const supabase = await createClient()
  
  const [ { data: projects }, { data: details } ] = await Promise.all([
    supabase.from('project_items').select('*').order('sort_order'),
    supabase.from('project_details').select('*')
  ])

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>项目详情配置</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>这里独立管理各个项目详情页的背景、要求和流程。</p>
      
      <ProjectDetailsClient projects={projects || []} details={details || []} />
    </div>
  )
}