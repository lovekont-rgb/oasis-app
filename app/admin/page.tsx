import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const instant = false

export default async function AdminDashboard() {
  const supabase = await createClient()

  // 并行获取各项数据的真实数量
  const [ { count: courseCount }, { count: toolCount }, { count: promptCount } ] = await Promise.all([
    supabase.from('courses').select('*', { count: 'exact', head: true }),
    supabase.from('tools').select('*', { count: 'exact', head: true }),
    supabase.from('prompts').select('*', { count: 'exact', head: true })
  ])

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '24px', color: 'var(--text-primary)' }}>
        欢迎回来，管理员
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>
        这里是 OASIS 的核心控制台。你可以在这里管理网站的所有动态内容。
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        <div className="ui-card" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>已上架课程</h3>
          <p style={{ fontSize: '32px', fontWeight: 800, color: 'var(--cyan)' }}>{courseCount || 0}</p>
        </div>
        <div className="ui-card" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>提示词模板</h3>
          <p style={{ fontSize: '32px', fontWeight: 800, color: 'var(--cyan)' }}>{promptCount || 0}</p>
        </div>
        <div className="ui-card" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>收录 AI 工具</h3>
          <p style={{ fontSize: '32px', fontWeight: 800, color: 'var(--cyan)' }}>{toolCount || 0}</p>
        </div>
      </div>
    </div>
  )
}