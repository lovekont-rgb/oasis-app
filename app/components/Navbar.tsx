import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from './LogoutButton'

export default async function Navbar() {
  const supabase = await createClient() // 注意这里要有 await
  const { data: { user } } = await supabase.auth.getUser()

  // 导航链接保持不变
  const links = [
    { name: '学习路径', href: '/paths' },
    { name: '课程模块', href: '/modules' },
    { name: '工具矩阵', href: '/tools' },
    { name: '提示词工程', href: '/prompts' },
    { name: '项目实战', href: '/projects' },
    { name: '社区', href: '/community' },
  ]

  return (
    <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'var(--nav-bg)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="nav-container">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, var(--violet), var(--cyan))', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 900 }}>O</div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--text-primary)' }}>OASIS</span>
        </Link>

        <nav style={{ display: 'flex', gap: '32px', fontSize: 14 }}>
          {links.map(link => (
            <Link key={link.href} href={link.href} style={{ color: 'var(--text-secondary)', transition: '0.2s' }}>
              {link.name}
            </Link>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <ThemeToggle />
          {user ? (
            <>
              <Link href="/dashboard" style={{ padding: '8px 20px', borderRadius: 100, background: 'var(--cyan)', color: '#05070d', fontWeight: 700, fontSize: 14 }}>
                控制台
              </Link>
              <LogoutButton />
            </>
          ) : (
            <Link href="/login" style={{ padding: '8px 20px', borderRadius: 100, background: 'var(--cyan)', color: '#05070d', fontWeight: 700, fontSize: 14 }}>
              登录 / 注册
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}