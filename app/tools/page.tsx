import { createClient } from '@/lib/supabase/server'
import ToolsClient from './ToolsClient'
import styles from './tools.module.css'

export const instant = false

export default async function ToolsPage() {
  const supabase = await createClient()
  const { data: tools } = await supabase.from('tools').select('*').order('name')

  return (
    <main className={styles.container}>
      {/* 标题区 */}
      <div className={styles.badge}><span className={styles.dot}></span>TOOL MATRIX</div>
      <h1 className={styles.title}>
        工具是<span className={styles.gradient}>货架</span>，<br className={styles.responsiveBr} />不是清单
      </h1>
      <p className={styles.subtitle}>
        按场景分类收录，标注免费 / 付费 / 开源属性。不用全装——先固定一条基线，遇到具体问题时再引入对应工具。
      </p>
      
      <ToolsClient initialTools={tools || []} />
    </main>
  )
}