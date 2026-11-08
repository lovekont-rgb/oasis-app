import Link from 'next/link'
import styles from './admin.module.css'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.adminLayout}>
      {/* 左侧边栏 */}
      <aside className={styles.sidebar}>
        <div className={styles.logoArea}>
          <div className={styles.logoMark}>O</div>
          OASIS Admin
        </div>

        <div className={styles.menuGroup}>
          <div className={styles.menuTitle}>核心管理</div>
          <Link href="/admin" className={`${styles.menuItem}`}>
            📊 数据概览
          </Link>
          <Link href="/admin/prompts" className={`${styles.menuItem}`}>
            📝 提示词管理
          </Link>
          <Link href="/admin/tools" className={`${styles.menuItem}`}>
            🛠️ 工具矩阵管理
          </Link>
          
          <div className={styles.menuTitle}>教务系统</div>
          <Link href="/admin/courses" className={`${styles.menuItem}`}>
            🎓 课程与资源
          </Link>
          <Link href="/admin/users" className={`${styles.menuItem}`}>
            👥 用户与权限
          </Link>
        </div>

        <Link href="/" className={styles.backBtn}>
          ← 返回网站前台
        </Link>
      </aside>

      {/* 右侧内容区 */}
      <main className={styles.mainContent}>
        <header className={styles.topbar}>
          <div className={styles.topbarTitle}>后台管理系统</div>
          <div className={styles.userInfo}>
            <span>👤 管理员 (Admin)</span>
          </div>
        </header>
        
        <div className={styles.contentBody}>
          {children}
        </div>
      </main>
    </div>
  )
}