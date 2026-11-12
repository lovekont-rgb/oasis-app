import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const instant = false

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolvedSearchParams = await searchParams
  const query = resolvedSearchParams.q?.trim() || ''

  // 如果没有输入关键词，展示引导
  if (!query) {
    return (
      <main className="page-container" style={{ minHeight: '60vh', textAlign: 'center', paddingTop: '100px' }}>
        <div className="ui-badge"><span className="ui-badge-dot"></span>GLOBAL SEARCH</div>
        <h1 className="ui-title">探索 <span className="ui-title-gradient">OASIS</span></h1>
        <p className="ui-subtitle" style={{ margin: '0 auto' }}>请在顶部导航栏输入关键词，搜索课程、工具、提示词或项目。</p>
      </main>
    )
  }

  const supabase = await createClient()
  const searchPattern = `%${query}%`

  // 并行查询各个数据表
  const [
    { data: courses },
    { data: projects },
    { data: tools },
    { data: prompts },
  ] = await Promise.all([
    supabase.from('courses').select('*').ilike('title', searchPattern).or(`description.ilike.${searchPattern}`),
    supabase.from('project_items').select('*').ilike('title', searchPattern).or(`description.ilike.${searchPattern}`),
    supabase.from('tools').select('*').ilike('name', searchPattern).or(`description.ilike.${searchPattern}`),
    supabase.from('prompts').select('*').ilike('title', searchPattern).or(`content.ilike.${searchPattern}`),
  ])

  // 计算总结果数
  const totalResults = (courses?.length || 0) + (projects?.length || 0) + (tools?.length || 0) + (prompts?.length || 0)

  return (
    <main className="page-container">
      <div style={{ marginBottom: '40px' }}>
        <div className="ui-badge"><span className="ui-badge-dot"></span>SEARCH RESULTS</div>
        <h1 className="ui-title">关于 “<span className="ui-title-gradient">{query}</span>” 的搜索结果</h1>
        <p className="ui-subtitle">共找到 {totalResults} 条相关结果</p>
      </div>

      {/* 无结果提示 */}
      {totalResults === 0 && (
        <div className="ui-card" style={{ textAlign: 'center', padding: '80px 20px', borderStyle: 'dashed' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛸</div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>没有找到相关结果</h2>
          <p style={{ color: 'var(--text-secondary)' }}>试试换个关键词，或者去首页看看我们为你准备的内容。</p>
          <Link href="/" style={{ display: 'inline-block', marginTop: '24px', color: 'var(--cyan)' }}>返回首页 →</Link>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        
        {/* 课程结果 */}
        {courses && courses.length > 0 && (
          <section>
            <h2 className="ui-section-title" style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.4rem' }}>🎓 课程模块 <span style={{ fontSize: '14px', color: 'var(--text-dim)', fontWeight: 'normal' }}>({courses.length})</span></h2>
            <div className="ui-grid-2">
              {courses.map(item => (
                <Link key={item.id} href={`/modules/${item.id}`} className="ui-card" style={{ textDecoration: 'none', display: 'block' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>{item.title}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 项目结果 */}
        {projects && projects.length > 0 && (
          <section>
            <h2 className="ui-section-title" style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.4rem' }}>💼 项目实战 <span style={{ fontSize: '14px', color: 'var(--text-dim)', fontWeight: 'normal' }}>({projects.length})</span></h2>
            <div className="ui-grid-2">
              {projects.map(item => (
                <Link key={item.id} href={`/projects/${item.id}`} className="ui-card" style={{ textDecoration: 'none', display: 'block' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>{item.title}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 工具结果 */}
        {tools && tools.length > 0 && (
          <section>
            <h2 className="ui-section-title" style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.4rem' }}>🛠️ 工具矩阵 <span style={{ fontSize: '14px', color: 'var(--text-dim)', fontWeight: 'normal' }}>({tools.length})</span></h2>
            <div className="ui-grid-3">
              {tools.map(item => (
                <div key={item.id} className="ui-card">
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '6px' }}>{item.name}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-dim)' }}>{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 提示词结果 */}
        {prompts && prompts.length > 0 && (
          <section>
            <h2 className="ui-section-title" style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.4rem' }}>📐 提示词工程 <span style={{ fontSize: '14px', color: 'var(--text-dim)', fontWeight: 'normal' }}>({prompts.length})</span></h2>
            <div className="ui-grid-2">
              {prompts.map(item => (
                <Link key={item.id} href="/prompts" className="ui-card" style={{ textDecoration: 'none', display: 'block' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>{item.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-dim)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.content}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  )
}