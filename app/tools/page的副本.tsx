import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'

// 1. 把获取数据的逻辑单独放在这个组件里
async function ToolsList() {
  const supabase = await createClient()
  const { data: tools, error } = await supabase.from('tools').select('*').order('name')

  if (error) {
    return (
      <div style={{ padding: 40, color: 'red' }}>
        <h2>连接数据库失败</h2>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    )
  }

  if (!tools || tools.length === 0) {
    return <p style={{ color: 'orange' }}>数据库连接成功，但是表里没有数据，或者被权限拦截了。</p>
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
      {tools.map((tool) => (
        <div key={tool.id} style={{ border: '1px solid #333', borderRadius: 12, padding: 16, background: '#0c1020', color: '#eef4ff' }}>
          <h3 style={{ margin: '0 0 6px' }}>{tool.name}</h3>
          <span style={{ fontSize: 12, color: '#00d4ff' }}>{tool.pricing}</span>
          <p style={{ fontSize: 13, color: '#8b9bb8' }}>{tool.description}</p>
        </div>
      ))}
    </div>
  )
}

// 2. 主页面保持静态，只用 Suspense 包裹数据部分
export default function ToolsPage() {
  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: 40, fontFamily: 'sans-serif' }}>
      <h1>工具矩阵</h1>
      <p>下面是来自 Supabase 的动态数据：</p>
      
      {/* 当数据还在加载时，先显示这里的文字 */}
      <Suspense fallback={<p>正在加载工具列表...</p>}>
        <ToolsList />
      </Suspense>
    </main>
  )
}