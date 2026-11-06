import { createClient } from '@/lib/supabase/server'
import ToolsClient from './ToolsClient'
import styles from './tools.module.css'

export default async function ToolsPage() {
  const supabase = await createClient()
  const { data: tools, error } = await supabase.from('tools').select('*').order('name')

  if (error) {
    return <div style={{ padding: 40, color: 'red' }}>数据库连接失败：{error.message}</div>
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>工具矩阵</h1>
      <p className={styles.subtitle}>工具是货架，不是清单。按场景分类收录。</p>
      
      <ToolsClient initialTools={tools || []} />
    </main>
  )
}