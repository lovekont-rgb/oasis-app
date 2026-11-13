import { createClient } from '@/lib/supabase/server'

export const instant = false

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div>
      <h1 className="ui-title" style={{ fontSize: '2rem', marginBottom: '8px' }}>
        欢迎回来，<span className="ui-title-gradient">{user?.email?.split('@')[0]}</span>
      </h1>
      <p className="ui-subtitle" style={{ marginBottom: '40px' }}>
        这里是你的专属创作大本营。
      </p>

      {/* 数据看板 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        <div className="ui-card" style={{ padding: '32px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎓</div>
          <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>已学完课时</h3>
          <p style={{ fontSize: '28px', fontWeight: '900', color: 'var(--cyan)', fontFamily: 'Orbitron' }}>0</p>
        </div>
        <div className="ui-card" style={{ padding: '32px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎨</div>
          <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>发布的作品</h3>
          <p style={{ fontSize: '28px', fontWeight: '900', color: 'var(--cyan)', fontFamily: 'Orbitron' }}>0</p>
        </div>
        <div className="ui-card" style={{ padding: '32px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>💬</div>
          <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>发起的问答</h3>
          <p style={{ fontSize: '28px', fontWeight: '900', color: 'var(--cyan)', fontFamily: 'Orbitron' }}>0</p>
        </div>
      </div>

      <div className="ui-card" style={{ marginTop: '32px', padding: '40px', textAlign: 'center', borderStyle: 'dashed' }}>
        <p style={{ color: 'var(--text-dim)' }}>更多数据统计和最近学习记录正在开发中...</p>
      </div>
    </div>
  )
}