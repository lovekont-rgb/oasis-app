'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const pathname = usePathname()
  
  const links = [
    { name: '学习路径', href: '/paths' },
    { name: '课程模块', href: '/modules' },
    { name: '工具矩阵', href: '/tools' },
    { name: '提示词工程', href: '/prompts' },
    { name: '项目实战', href: '/projects' },
    { name: '社区', href: '/community' },
  ]

  const getActionBtn = () => {
    switch (pathname) {
      case '/': return { text: '开始学习', href: '/paths' };
      case '/paths': return { text: '开始学习', href: '/paths' };
      case '/modules': return { text: '浏览工具', href: '/tools' };
      case '/tools': return { text: '看项目', href: '/projects' };
      case '/prompts': return { text: '提示词库', href: '/prompt-library' };
      case '/projects': return { text: '看作品', href: '/projects' };
      case '/community': return { text: '回首页', href: '/' };
      default: return { text: '开始学习', href: '/paths' };
    }
  }
  const actionBtn = getActionBtn()

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'var(--nav-bg)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-subtle)', transition: 'all 0.3s'
    }}>
      <div className="nav-container">
        {/* 左侧 Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 2 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, var(--violet), var(--cyan))', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 900, fontSize: 14, boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)' }}>O</div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, letterSpacing: '0.04em', color: 'var(--text-primary)' }}>OASIS</span>
        </Link>

        {/* 👇 中间导航：使用绝对定位锁死居中，再也不会跟着左右移动 */}
        <nav style={{ 
          position: 'absolute', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          display: 'flex', 
          gap: '32px', 
          fontSize: 14, 
          fontWeight: 500,
          zIndex: 1
        }}>
          {links.map(link => {
            const isActive = pathname === link.href
            return (
              <Link key={link.href} href={link.href} style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', position: 'relative', transition: '0.2s', whiteSpace: 'nowrap' }}>
                {link.name}
                {isActive && (
                  <div style={{ position: 'absolute', bottom: -6, left: 0, right: 0, height: 2, background: 'var(--cyan)', boxShadow: '0 0 8px var(--cyan)' }} />
                )}
              </Link>
            )
          })}
        </nav>

        {/* 右侧按钮组 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 2 }}>
          {/* 全局搜索框 */}
          <form action="/search" method="GET" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input 
              type="text" 
              name="q" 
              placeholder="全局搜索..." 
              style={{ 
                width: '160px', padding: '6px 12px 6px 30px', borderRadius: '100px', 
                background: 'var(--bg-void)', border: '1px solid var(--border-subtle)', 
                color: 'var(--text-primary)', fontSize: '13px', outline: 'none', transition: 'border-color 0.3s'
              }}
            />
            <span style={{ position: 'absolute', left: '10px', color: 'var(--text-dim)', fontSize: '14px' }}>🔍</span>
          </form>

          <ThemeToggle />
          
          <Link href={actionBtn.href} style={{ 
            padding: '8px 20px', borderRadius: 100, background: 'var(--cyan)', color: '#05070d', 
            fontWeight: 700, fontSize: 14, boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)', 
            transition: '0.3s', textDecoration: 'none', whiteSpace: 'nowrap'
          }}>
            {actionBtn.text}
          </Link>
        </div>
      </div>
    </header>
  )
}