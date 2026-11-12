'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  
  // 1. 导航栏新增“首页”
  const links = [
    { name: '首页', href: '/' },
    { name: '学习路径', href: '/paths' },
    { name: '课程模块', href: '/modules' },
    { name: '工具矩阵', href: '/tools' },
    { name: '提示词工程', href: '/prompts' },
    { name: '项目实战', href: '/projects' },
    { name: '社区', href: '/community' },
  ]

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'var(--nav-bg)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-subtle)', transition: 'all 0.3s'
    }}>
      <div className="nav-container" style={{ position: 'relative' }}>
        
        {/* 左侧 Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 2 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, var(--violet), var(--cyan))', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 900, fontSize: 14, boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)' }}>O</div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, letterSpacing: '0.04em', color: 'var(--text-primary)' }}>OASIS</span>
        </Link>

        {/* 中间导航：绝对居中锁死 */}
        <nav style={{ 
          position: 'absolute', left: '50%', transform: 'translateX(-50%)', 
          display: 'flex', gap: '24px', fontSize: 14, fontWeight: 500, zIndex: 1
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', zIndex: 2 }}>
          
          {/* 搜索文字按钮 */}
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            style={{ background: 'none', border: 'none', color: isSearchOpen ? 'var(--cyan)' : 'var(--text-secondary)', fontSize: '14px', cursor: 'pointer', fontWeight: 500, transition: '0.3s' }}
          >
            搜索
          </button>

          <ThemeToggle />
          
          {/* 注册与登录 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '8px' }}>
            <Link href="/register" style={{ color: 'var(--text-secondary)', fontSize: '14px', textDecoration: 'none', fontWeight: 500, transition: '0.3s' }}>
              注册
            </Link>
            <Link href="/login" style={{ 
              padding: '6px 16px', borderRadius: '100px', border: '1px solid var(--cyan)', 
              color: 'var(--cyan)', fontSize: '14px', textDecoration: 'none', fontWeight: 'bold',
              transition: '0.3s'
            }}>
              登录
            </Link>
          </div>
        </div>

        {/* 点击搜索后向下弹出的搜索框 */}
        {isSearchOpen && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            padding: '20px 24px', background: 'var(--nav-bg)', backdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)', animation: 'fadeInDown 0.3s ease'
          }}>
            <form action="/search" method="GET" style={{ width: '100%', maxWidth: '600px', position: 'relative' }}>
              <input 
                type="text" name="q" placeholder="搜索课程、工具、提示词..." autoFocus
                style={{
                  width: '100%', padding: '12px 20px 12px 40px', borderRadius: '100px',
                  background: 'var(--bg-void)', border: '1px solid var(--border-glow)',
                  color: 'var(--text-primary)', fontSize: '15px', outline: 'none',
                  boxShadow: '0 0 20px rgba(0,212,255,0.1)'
                }}
              />
              <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--cyan)' }}>🔍</span>
            </form>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </header>
  )
}