import { createClient } from '@/lib/supabase/server'
import PortfolioAdminClient from './PortfolioAdminClient'

export const instant = false

export default async function AdminPortfolioPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('portfolios').select('*').order('created_at', { ascending: false })
  
  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>作品广场管理</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>管理前台的学员优秀作品与商业案例展示。</p>
      <PortfolioAdminClient initialData={data || []} />
    </div>
  )
}