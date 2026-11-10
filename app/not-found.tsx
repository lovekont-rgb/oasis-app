import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="page-container" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      
      {/* 👇 核心修复：将 404 动画和终端框的 CSS 直接写死在当前页面，确保绝对生效 */}
      <style dangerouslySetInnerHTML={{__html: `
        .err-404 {
          font-family: 'Orbitron', monospace;
          font-size: clamp(8rem, 20vw, 15rem);
          font-weight: 900;
          line-height: 1;
          margin-bottom: 20px;
          color: transparent;
          -webkit-text-stroke: 2px var(--cyan);
          position: relative;
          letter-spacing: 10px;
          text-shadow: 0 0 20px rgba(0, 212, 255, 0.4), 0 0 40px rgba(0, 212, 255, 0.2);
          animation: glitch-pulse 3s infinite alternate;
        }
        @keyframes glitch-pulse {
          0% { text-shadow: 0 0 10px rgba(0,212,255,0.2); -webkit-text-stroke-color: rgba(0,212,255,0.5); }
          100% { text-shadow: 0 0 30px rgba(0,212,255,0.8), 0 0 60px rgba(123,97,255,0.4); -webkit-text-stroke-color: rgba(0,212,255,1); }
        }
        .err-terminal {
          background: rgba(10, 15, 28, 0.8);
          border: 1px solid rgba(0, 212, 255, 0.2);
          border-radius: 8px;
          padding: 20px;
          width: 100%;
          max-width: 600px;
          text-align: left;
          font-family: 'Orbitron', monospace;
          font-size: 13px;
          color: var(--text-secondary);
          box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
        }
        .err-terminal p { margin-bottom: 8px; line-height: 1.5; }
        .err-terminal p:last-child { margin-bottom: 0; }
        .err-cyan { color: var(--cyan); font-weight: bold; }
        .err-red { color: #ff4444; }
        .err-cursor {
          display: inline-block; width: 8px; height: 14px;
          background: var(--cyan); vertical-align: middle;
          animation: blink 1s step-end infinite;
        }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}} />

      {/* 顶部徽章 */}
      <div className="ui-badge" style={{ borderColor: '#ff4444', color: '#ff4444', background: 'rgba(255,68,68,0.1)', marginBottom: '24px' }}>
        <span className="ui-badge-dot" style={{ background: '#ff4444', boxShadow: '0 0 10px #ff4444' }}></span>
        SYSTEM ERROR: 404
      </div>

      {/* 巨大的 404 视觉 */}
      <h1 className="err-404">404</h1>

      <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>
        页面走丢了
      </h2>
      
      <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.8, maxWidth: '480px', margin: '0 auto 40px' }}>
        你访问的页面似乎被卷入了时空裂缝。请检查网址是否正确，或者返回安全区域。
      </p>

      {/* 科幻感的终端报错框 */}
      <div className="err-terminal">
        <p><span className="err-cyan">guest@oasis:~$</span> find /path/to/destination</p>
        <p className="err-red">Error: ENOENT: no such file or directory, open '/the-page-you-want'</p>
        <p><span className="err-cyan">guest@oasis:~$</span> <span className="err-cursor"></span></p>
      </div>

      {/* 操作按钮 */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
        <Link href="/" style={{ padding: '12px 32px', borderRadius: '100px', background: 'linear-gradient(120deg, var(--cyan), #4ae0ff)', color: '#05070d', fontWeight: 'bold', textDecoration: 'none', boxShadow: '0 0 20px rgba(0,212,255,0.3)' }}>
          返回首页
        </Link>
        <Link href="/contact" style={{ padding: '12px 32px', borderRadius: '100px', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontWeight: 'bold', textDecoration: 'none', background: 'transparent' }}>
          联系客服
        </Link>
      </div>

    </main>
  )
}