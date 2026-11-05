import { createClient } from '@/lib/supabase/server'

export default async function ToolsPage() {
  const supabase = await createClient()
  
  // 👇 这里加上了 error 捕获
  const { data: tools, error } = await supabase.from('tools').select('*').order('name')

  // 👇 如果报错，直接在页面上显示出来，方便我们排查
  if (error) {
    return (
      <div style={{ padding: 40, color: 'red' }}>
        <h2>连接数据库失败</h2>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    )
  }

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: 40, fontFamily: 'sans-serif' }}>
      <h1>工具矩阵</h1>
      <p>共 {tools?.length ?? 0} 个工具</p>
      
      {/* 如果查出来是空数组，显示提示 */}
      {tools?.length === 0 && (
        <p style={{ color: 'orange' }}>
          数据库连接成功，但是表里没有数据，或者被权限（RLS）拦截了。
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {tools?.map((tool) => (
          <div key={tool.id} style={{ border: '1px solid #333', borderRadius: 12, padding: 16, background: '#0c1020', color: '#eef4ff' }}>
            <h3 style={{ margin: '0 0 6px' }}>{tool.name}</h3>
            <span style={{ fontSize: 12, color: '#00d4ff' }}>{tool.pricing}</span>
            <p style={{ fontSize: 13, color: '#8b9bb8' }}>{tool.description}</p>
          </div>
        ))}
      </div>
    </main>
  )
}