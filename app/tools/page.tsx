import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import ToolsClient from './ToolsClient'
import styles from './tools.module.css'

// 1. 将获取数据的逻辑抽离，并加上 try/catch 捕获异常
async function ToolsData() {
  const supabase = await createClient()
  
  const { data: tools, error } = await supabase.from('tools').select('*').order('name')

  if (error) {
    return (
      <div style={{ padding: '40px', color: '#ff4444', textAlign: 'center' }}>
        <h3>数据加载失败</h3>
        <p style={{ fontSize: '14px', marginTop: '10px' }}>{error.message}</p>
      </div>
    )
  }

  return <ToolsClient initialTools={tools || []} />
}

// 2. 静态外壳 + Suspense
export default function ToolsPage() {
  return (
    <main className="page-container">
      <div className="ui-badge"><span className="ui-badge-dot"></span>TOOL MATRIX</div>
      <h1 className="ui-title">
        工具是 <span className="ui-title-gradient">货架</span>，<br className={styles.responsiveBr} />不是清单
      </h1>
      <p className="ui-subtitle">
        按场景分类收录，标注免费 / 付费 / 开源属性。不用全装——先固定一条基线，遇到具体问题时再引入对应工具。
      </p>
      
      <Suspense fallback={
        <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
          正在加载工具列表...
        </div>
      }>
        <ToolsData />
      </Suspense>
    </main>
  )
}