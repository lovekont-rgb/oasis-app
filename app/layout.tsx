import './globals.css'
import ThemeToggle from './components/ThemeToggle'
import Link from 'next/link'

export const metadata = { title: 'OASIS | 工具矩阵' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('oasis-theme')||'dark';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.setAttribute('data-theme',d?'dark':'light');document.documentElement.setAttribute('data-theme-pref',t);}catch(e){}})();` }} />
      </head>
      <body>
        <header style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 40px', background: 'var(--nav-bg)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border-subtle)', transition: 'all 0.3s'
        }}>
          {/* 左侧 Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, var(--violet), var(--cyan))',
              display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 900, fontSize: 14,
              boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)'
            }}>O</div>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, letterSpacing: '0.04em' }}>OASIS</span>
            <span style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'Orbitron, monospace', letterSpacing: '0.1em', marginLeft: 4 }}>创意无线增长</span>
          </Link>

          {/* 中间导航 */}
          <nav style={{ display: 'flex', gap: '32px', fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)' }}>
            <Link href="#" style={{ transition: '0.2s' }}>学习路径</Link>
            <Link href="#" style={{ transition: '0.2s' }}>课程模块</Link>
            {/* 当前激活状态 */}
            <Link href="/tools" style={{ color: 'var(--text-primary)', position: 'relative' }}>
              工具矩阵
              <div style={{ position: 'absolute', bottom: -6, left: 0, right: 0, height: 2, background: 'var(--cyan)', boxShadow: '0 0 8px var(--cyan)' }} />
            </Link>
            <Link href="/prompts" style={{ transition: '0.2s' }}>提示词工程</Link>
            <Link href="#" style={{ transition: '0.2s' }}>项目实战</Link>
            <Link href="#" style={{ transition: '0.2s' }}>社区</Link>
          </nav>

          {/* 右侧按钮组 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <ThemeToggle />
            <button style={{
              padding: '8px 20px', borderRadius: 100, background: 'var(--cyan)', color: '#05070d',
              fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer',
              boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)', transition: '0.3s'
            }}>看项目</button>
          </div>
        </header>
        <div style={{ paddingTop: '120px' }}>{children}</div>
                {/* 这里插入新的 Footer 代码 */}
        <footer style={{
          borderTop: '1px solid var(--border-subtle)', padding: '60px 40px 30px',
          background: 'var(--bg-void)', fontSize: '14px', marginTop: '60px'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px', marginBottom: '40px' }}>
            <div style={{ maxWidth: '300px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, var(--violet), var(--cyan))', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 900 }}>O</div>
                <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20 }}>OASIS</span>
                <span style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'Orbitron, monospace' }}>创意无线增长</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '13px' }}>
                OASIS — 创意无线增长。以交付能力为导向的 AIGC 学习平台。黑色是画布，科技蓝是信号。
              </p>
            </div>
            <div style={{ display: 'flex', gap: '80px', flexWrap: 'wrap' }}>
              <div>
                <h5 style={{ color: 'var(--cyan)', marginBottom: '16px', fontFamily: 'Orbitron, monospace', fontSize: '12px' }}>学习</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text-secondary)' }}>
                  <Link href="#">学习路径</Link><Link href="#">课程模块</Link><Link href="/prompts">提示词工程</Link>
                </div>
              </div>
              <div>
                <h5 style={{ color: 'var(--cyan)', marginBottom: '16px', fontFamily: 'Orbitron, monospace', fontSize: '12px' }}>资源</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text-secondary)' }}>
                  <Link href="/tools">工具矩阵</Link><Link href="#">项目实战</Link><Link href="#">社区资源</Link>
                </div>
              </div>
              <div>
                <h5 style={{ color: 'var(--cyan)', marginBottom: '16px', fontFamily: 'Orbitron, monospace', fontSize: '12px' }}>关于</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text-secondary)' }}>
                  <Link href="#">关于我们</Link><Link href="#">联系我们</Link><Link href="#">隐私政策</Link>
                </div>
              </div>
            </div>
          </div>
          <div style={{ maxWidth: '1200px', margin: '0 auto', borderTop: '1px solid var(--border-subtle)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', color: 'var(--text-dim)', fontSize: '12px' }}>
            <span>© 2026 OASIS · 创意无线增长. 学习，然后交付。</span>
            <span>Designed with 科技蓝 · 黑色酷炫</span>
          </div>
        </footer>
      </body>
    </html>
  )
}