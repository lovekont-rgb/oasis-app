import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const instant = false

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 并行统计当前用户的真实数据
  const [
    { count: learningCount },
    { count: portfolioCount },
    { count: qaCount }
  ] = await Promise.all([
    supabase.from('learning_progress').select('*', { count: 'exact', head: true }).eq('user_id', user?.id),
    supabase.from('portfolios').select('*', { count: 'exact', head: true }).eq('user_id', user?.id),
    supabase.from('community_questions').select('*', { count: 'exact', head: true }).eq('user_id', user?.id)
  ])

  return (
    <div>
      <h1 className="ui-title" style={{ fontSize: '2rem', marginBottom: '8px' }}>
        欢迎回来，<span className="ui-title-gradient">{user?.email?.split('@')[0]}</span>
      </h1>
      <p className="ui-subtitle" style={{ marginBottom: '40px' }}>
        这里是你的专属创作大本营。
      </p>

      {/* 核心数据看板（可点击跳转） */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        
        {/* 1. 学习进度卡片 */}
        <Link href="/dashboard/learning" className="ui-card" style={{ padding: '32px', textAlign: 'center', textDecoration: 'none', cursor: 'pointer', transition: 'all 0.3s' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎓</div>
          <h3 style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '8px' }}>已学完课时</h3>
          <p style={{ fontSize: '32px', fontWeight: '900', color: 'var(--cyan)', fontFamily: 'Orbitron' }}>
            {learningCount || 0}
          </p>
          <span style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '8px', display: 'block' }}>查看详情 →</span>
        </Link>

        {/* 2. 作品卡片 */}
        <Link href="/dashboard/portfolio" className="ui-card" style={{ padding: '32px', textAlign: 'center', textDecoration: 'none', cursor: 'pointer', transition: 'all 0.3s' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎨</div>
          <h3 style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '8px' }}>发布的作品</h3>
          <p style={{ fontSize: '32px', fontWeight: '900', color: 'var(--cyan)', fontFamily: 'Orbitron' }}>
            {portfolioCount || 0}
          </p>
          <span style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '8px', display: 'block' }}>管理作品 →</span>
        </Link>

        {/* 3. 问答卡片 */}
        <Link href="/dashboard/qa" className="ui-card" style={{ padding: '32px', textAlign: 'center', textDecoration: 'none', cursor: 'pointer', transition: 'all 0.3s' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>💬</div>
          <h3 style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '8px' }}>发起的问答</h3>
          <p style={{ fontSize: '32px', fontWeight: '900', color: 'var(--cyan)', fontFamily: 'Orbitron' }}>
            {qaCount || 0}
          </p>
          <span style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '8px', display: 'block' }}>查看问答 →</span>
        </Link>

      </div>

      <div className="ui-card" style={{ marginTop: '32px', padding: '40px', textAlign: 'center', borderStyle: 'dashed' }}>
        <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '8px' }}>开始你的第一步</h3>
        <p style={{ color: 'var(--text-dim)', marginBottom: '24px' }}>去看看课程，或者去社区提问，你的数据会立刻出现在这里。</p>
        <Link href="/paths" style={{ padding: '10px 24px', background: 'var(--cyan)', color: '#05070d', borderRadius: '100px', fontWeight: 'bold', textDecoration: 'none' }}>
          探索学习路径 →
        </Link>
      </div>
    </div>
  )
}