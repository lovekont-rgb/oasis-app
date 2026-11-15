import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import styles from './dashboard.module.css'
import BFCacheGuard from './BFCacheGuard'

export const instant = false

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')

  const avatarLetter = user.email ? user.email.charAt(0).toUpperCase() : 'U'

  return (
    <div className={styles.dashboardLayout}>
      {/* 👇 核心安检：防止浏览器缓存倒退 */}
      <BFCacheGuard />
      
      <aside className={styles.sidebar}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, var(--cyan), var(--violet))', display: 'grid', placeItems: 'center', fontSize: '14px', color: '#05070d', fontWeight: 900 }}>O</div>
          个人创作中心
        </div>

        <div className={styles.userProfile}>
          <div className={styles.avatar}>{avatarLetter}</div>
          <div className={styles.email}>{user.email}</div>
          <div className={styles.roleBadge}>学习者 / 创作者</div>
        </div>

        <nav className={styles.navMenu}>
          <Link href="/dashboard" className={styles.menuItem}>📊 概览</Link>
          <Link href="/dashboard/learning" className={styles.menuItem}>🎓 我的学习</Link>
          <Link href="/dashboard/portfolio" className={styles.menuItem}>🎨 我的作品</Link>
          <Link href="/dashboard/qa" className={styles.menuItem}>💬 我的问答</Link>
        </nav>

        <Link href="/" className={styles.backBtn}>← 返回网站首页</Link>
      </aside>

      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  )
}