import Link from 'next/link'
import styles from './admin.module.css'
import { createClient } from '@/lib/supabase/server'

export const instant = false

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // 判断是否是唯一的超级管理员
  const isSuperAdmin = user?.email === 'sj2282@sina.com'

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.logoArea}>
          <div className={styles.logoMark}>O</div>
          OASIS Admin
        </div>

        <div className={styles.menuGroup}>
          
          <div className={styles.menuTitle}>网站管理</div>
          <Link href="/admin" className={`${styles.menuItem}`}>
            📊 数据概览
          </Link>
          <Link href="/admin/site/about" className={`${styles.menuItem}`}>
            🏢 关于我们
          </Link>
          <Link href="/admin/site/contact" className={`${styles.menuItem}`}>
            ✉️ 联系我们
          </Link>
          <Link href="/admin/site/privacy" className={`${styles.menuItem}`}>
            📜 隐私政策
          </Link>
          <Link href="/admin/messages" className={`${styles.menuItem}`}>
            💬 留言管理
          </Link>

          {/* 👇 只有超级管理员才能看到这个菜单 */}
          {isSuperAdmin && (
            <Link href="/admin/users" className={`${styles.menuItem}`}>
              👥 用户权限管理
            </Link>
          )}

          <div className={styles.menuTitle}>核心内容管理</div>
          <Link href="/admin/prompt-engineering" className={`${styles.menuItem}`}>
            📐 提示词工程配置
          </Link>
          <Link href="/admin/tools" className={`${styles.menuItem}`}>
            🛠️ 工具矩阵
          </Link>
          <Link href="/admin/courses" className={`${styles.menuItem}`}>
            🎓 课程与资源
          </Link>
          <Link href="/admin/projects" className={`${styles.menuItem}`}>
            💼 项目实战
          </Link>
          <Link href="/admin/community" className={`${styles.menuItem}`}>
            🌐 社区管理
          </Link>

          <div className={styles.menuTitle}>教学与互动管理</div>
          <Link href="/admin/paths" className={`${styles.menuItem}`}>
            🛣️ 学习路径配置
          </Link>
          <Link href="/admin/prompt-library" className={`${styles.menuItem}`}>
            🖼️ 瀑布流提示词库
          </Link>
          <Link href="/admin/project-details" className={`${styles.menuItem}`}>
            📋 项目详情配置
          </Link>
          <Link href="/admin/portfolio" className={`${styles.menuItem}`}>
            🎨 作品广场管理
          </Link>
          <Link href="/admin/weekly" className={`${styles.menuItem}`}>
            📰 AI 周刊管理
          </Link>
          <Link href="/admin/qa" className={`${styles.menuItem}`}>
            🙋 问答互助管理
          </Link>
          <Link href="/admin/progress" className={`${styles.menuItem}`}>
            📈 学习进度看板
          </Link>

        </div>

        <Link href="/" className={styles.backBtn}>
          ← 返回网站前台
        </Link>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.topbar}>
          <div className={styles.topbarTitle}>后台管理系统</div>
          <div className={styles.userInfo}>
            <span>👤 {isSuperAdmin ? '超级管理员' : '普通管理员'}</span>
          </div>
        </header>
        
        <div className={styles.contentBody}>
          {children}
        </div>
      </main>
    </div>
  )
}