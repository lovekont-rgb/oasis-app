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

  return (
    // Header 作为全宽的背景层
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'var(--nav-bg)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-subtle)', transition: 'all 0.3s'
    }}>
      {/* 新增 nav-container，强制内容与 page-container 对齐 */}
      <div className="nav-container">
        
        {/* 左侧 Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, var(--violet), var(--cyan))',
            display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 900, fontSize: 14,
            boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)'
          }}>O</div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, letterSpacing: '0.04em', color: 'var(--text-primary)' }}>OASIS</span>
          <span style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'Orbitron, monospace', letterSpacing: '0.1em', marginLeft: 4 }}>创意无线增长</span>
        </Link>

        {/* 中间导航 */}
        <nav style={{ display: 'flex', gap: '32px', fontSize: 14, fontWeight: 500 }}>
          {links.map(link => {
            const isActive = pathname === link.href
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                style={{ 
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', 
                  position: 'relative', transition: '0.2s' 
                }}
              >
                {link.name}
                {isActive && (
                  <div style={{ position: 'absolute', bottom: -6, left: 0, right: 0, height: 2, background: 'var(--cyan)', boxShadow: '0 0 8px var(--cyan)' }} />
                )}
              </Link>
            )
          })}
        </nav>

        {/* 右侧按钮组 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <ThemeToggle />
          <Link href="/projects" style={{
            padding: '8px 20px', borderRadius: 100, background: 'var(--cyan)', color: '#05070d',
            fontWeight: 700, fontSize: 13, boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)', transition: '0.3s'
          }}>看项目</Link>
        </div>

      </div>
    </header>
  )
}