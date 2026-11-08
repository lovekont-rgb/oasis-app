import { createClient } from '@/lib/supabase/server'
import ToolsClient from './ToolsClient'
import styles from './tools.module.css'

export default async function ToolsPage() {
  // 1. 检查环境变量到底有没有读到
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return (
      <main className="page-container">
        <div className="ui-badge"><span className="ui-badge-dot"></span>系统错误</div>
        <h1 className="ui-title">环境变量缺失</h1>
        <p style={{ color: 'red', marginTop: '20px' }}>Vercel 中没有配置 NEXT_PUBLIC_SUPABASE_URL 或 NEXT_PUBLIC_SUPABASE_ANON_KEY，请去 Vercel 后台重新配置并 Redeploy。</p>
      </main>
    )
  }

  // 2. 直接获取数据并捕获错误
  const supabase = await createClient()
  const { data: tools, error } = await supabase.from('tools').select('*').order('name')

  if (error) {
    return (
      <main className="page-container">
        <div className="ui-badge"><span className="ui-badge-dot"></span>数据加载失败</div>
        <h1 className="ui-title">无法连接数据库</h1>
        <p style={{ color: 'red', marginTop: '20px' }}>{error.message}</p>
      </main>
    )
  }

  // 3. 正常渲染
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