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
            <Link href="#" style={{ transition: '0.2s' }}>提示词工程</Link>
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
      </body>
    </html>
  )
}