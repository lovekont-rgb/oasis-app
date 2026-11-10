import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="page-container" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      
      {/* 顶部徽章 */}
      <div className="ui-badge" style={{ borderColor: '#ff4444', color: '#ff4444', background: 'rgba(255,68,68,0.1)', marginBottom: '24px' }}>
        <span className="ui-badge-dot" style={{ background: '#ff4444', boxShadow: '0 0 10px #ff4444' }}></span>
        SYSTEM ERROR: 404
      </div>

      {/* 巨大的 404 视觉 */}
      <h1 className="error-code">
        404
      </h1>

      <h2 className="ui-title" style={{ fontSize: '2rem', marginBottom: '16px' }}>
        页面走丢了
      </h2>
      
      <p className="ui-subtitle" style={{ maxWidth: '480px', margin: '0 auto 40px', textAlign: 'center' }}>
        你访问的页面似乎被卷入了时空裂缝。请检查网址是否正确，或者返回安全区域。
      </p>

      {/* 科幻感的终端报错框 */}
      <div className="terminal-box">
        <p><span className="terminal-cyan">guest@oasis:~$</span> find /path/to/destination</p>
        <p className="terminal-error">Error: ENOENT: no such file or directory, open '/the-page-you-want'</p>
        <p><span className="terminal-cyan">guest@oasis:~$</span> <span className="terminal-cursor">_</span></p>
      </div>

      {/* 操作按钮 */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
        <Link href="/" className="btn-primary" style={{ padding: '12px 32px', borderRadius: '100px', background: 'linear-gradient(120deg, var(--cyan), #4ae0ff)', color: '#05070d', fontWeight: 'bold', textDecoration: 'none', boxShadow: '0 0 20px rgba(0,212,255,0.3)' }}>
          返回首页
        </Link>
        <Link href="/contact" style={{ padding: '12px 32px', borderRadius: '100px', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontWeight: 'bold', textDecoration: 'none', background: 'transparent' }}>
          联系客服
        </Link>
      </div>

    </main>
  )
}