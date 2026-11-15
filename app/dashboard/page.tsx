import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Suspense } from 'react'

export const instant = false

async function DashboardStats() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const [
      { count: learningCount },
      { data: userPortfolios },
      { count: qaCount }
    ] = await Promise.all([
      supabase.from('learning_progress').select('*', { count: 'exact', head: true }).eq('user_id', user?.id),
      supabase.from('portfolios').select('likes_count').eq('user_id', user?.id),
      supabase.from('community_questions').select('*', { count: 'exact', head: true }).eq('user_id', user?.id)
    ])

    const totalLikes = userPortfolios?.reduce((acc, curr) => acc + (curr.likes_count || 0), 0) || 0
    const portfolioCount = userPortfolios?.length || 0

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        <Link href="/dashboard/learning" className="ui-card" style={{ padding: '24px', textAlign: 'center', textDecoration: 'none' }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>🎓</div>
          <h3 style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>已学完课时</h3>
          <p style={{ fontSize: '28px', fontWeight: '900', color: 'var(--cyan)', fontFamily: 'Orbitron' }}>{learningCount || 0}</p>
        </Link>

        <Link href="/dashboard/portfolio" className="ui-card" style={{ padding: '24px', textAlign: 'center', textDecoration: 'none' }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>🎨</div>
          <h3 style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>发布的作品</h3>
          <p style={{ fontSize: '28px', fontWeight: '900', color: 'var(--cyan)', fontFamily: 'Orbitron' }}>{portfolioCount}</p>
        </Link>

        <div className="ui-card" style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>❤️</div>
          <h3 style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>收到的赞</h3>
          <p style={{ fontSize: '28px', fontWeight: '900', color: '#ff4444', fontFamily: 'Orbitron' }}>{totalLikes}</p>
        </div>

        <Link href="/dashboard/qa" className="ui-card" style={{ padding: '24px', textAlign: 'center', textDecoration: 'none' }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>💬</div>
          <h3 style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>发起的问答</h3>
          <p style={{ fontSize: '28px', fontWeight: '900', color: 'var(--cyan)', fontFamily: 'Orbitron' }}>{qaCount || 0}</p>
        </Link>
      </div>
    )
  } catch (err) {
    // 👇 安全气囊：网络不好时不会崩溃，而是展示这个卡片
    return (
      <div className="ui-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>
        <div style={{ fontSize: '32px', marginBottom: '16px' }}>📡</div>
        <h3>无法获取你的最新数据</h3>
        <p>请检查网络连接。</p>
      </div>
    )
  }
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div>
      <h1 className="ui-title" style={{ fontSize: '2rem', marginBottom: '8px' }}>
        欢迎回来，<span className="ui-title-gradient">{user?.email?.split('@')[0]}</span>
      </h1>
      <p className="ui-subtitle" style={{ marginBottom: '40px' }}>这里是你的专属创作大本营。</p>

      <Suspense fallback={
        <div style={{ height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
          数据加载中...
        </div>
      }>
        <DashboardStats />
      </Suspense>

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