import Link from 'next/link'

export default function AdminDashboard() {
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
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>注册用户</h3>
          <p style={{ fontSize: '32px', fontWeight: 800, color: 'var(--cyan)' }}>24,000</p>
        </div>
        <div className="ui-card" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>提示词总量</h3>
          <p style={{ fontSize: '32px', fontWeight: 800, color: 'var(--cyan)' }}>480</p>
        </div>
        <div className="ui-card" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>收录工具</h3>
          <p style={{ fontSize: '32px', fontWeight: 800, color: 'var(--cyan)' }}>86</p>
        </div>
      </div>

      <div className="ui-card" style={{ marginTop: '32px' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>快速操作</h3>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link href="/admin/prompts" style={{ padding: '12px 24px', background: 'var(--cyan)', color: '#05070d', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }}>
            去发布提示词
          </Link>
          <Link href="/admin/tools" style={{ padding: '12px 24px', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }}>
            去添加工具
          </Link>
        </div>
      </div>
    </div>
  )
}