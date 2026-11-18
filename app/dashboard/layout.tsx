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

  // 👇 顺便查出头像和用户名
  const { data: profile } = await supabase.from('profiles').select('avatar_url, username').eq('id', user.id).single()
  const displayName = profile?.username || user.email?.split('@')[0] || '用户'
  const avatarLetter = displayName.charAt(0).toUpperCase()

  return (
    <div className={styles.dashboardLayout}>
      <BFCacheGuard />
      
      <aside className={styles.sidebar}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, var(--cyan), var(--violet))', display: 'grid', placeItems: 'center', fontSize: '14px', color: '#05070d', fontWeight: 900 }}>O</div>
          个人创作中心
        </div>

        <div className={styles.userProfile}>
          <div className={styles.avatar} style={{ overflow: 'hidden' }}>
            {/* 👇 有图显示图，无图显示首字母 */}
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              avatarLetter
            )}
          </div>
          <div className={styles.email}>{displayName}</div>
          <div className={styles.roleBadge}>学习者 / 创作者</div>
        </div>

        <nav className={styles.navMenu}>
          <Link href="/dashboard" className={styles.menuItem}>📊 概览</Link>
          <Link href="/dashboard/learning" className={styles.menuItem}>🎓 我的学习</Link>
          <Link href="/dashboard/portfolio" className={styles.menuItem}>🎨 我的作品</Link>
          <Link href="/dashboard/qa" className={styles.menuItem}>💬 我的问答</Link>
          <Link href="/dashboard/settings" className={styles.menuItem}>⚙️ 个人设置</Link>
        </nav>

        <Link href="/" className={styles.backBtn}>← 返回网站首页</Link>
      </aside>

      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  )
}