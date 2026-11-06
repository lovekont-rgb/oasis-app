import { createClient } from '@/lib/supabase/server'
import ToolsClient from './ToolsClient'
import styles from './tools.module.css'

export const instant = false

export default async function ToolsPage() {
  const supabase = await createClient()
  const { data: tools } = await supabase.from('tools').select('*').order('name')

  return (
    <main className="page-container">
      <div className="ui-badge"><span className="ui-badge-dot"></span>TOOL MATRIX</div>
      <h1 className="ui-title">
        工具是 <span className="ui-title-gradient">货架</span>，<br className={styles.responsiveBr} />不是清单
      </h1>
      <p className="ui-subtitle">
        按场景分类收录，标注免费 / 付费 / 开源属性。不用全装——先固定一条基线，遇到具体问题时再引入对应工具。
      </p>
      
      <ToolsClient initialTools={tools || []} />
    </main>
  )
}