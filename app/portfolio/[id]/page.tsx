import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import DetailInteraction from './DetailInteraction'

export const instant = false

export default async function PortfolioDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const id = Number(resolvedParams.id)

  const supabase = await createClient()
  const { data: item } = await supabase.from('portfolios').select('*').eq('id', id).single()
  const { data: { user } } = await supabase.auth.getUser()

  if (!item) notFound()

  return (
    <main className="page-container">
      <div style={{ marginBottom: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
        <Link href="/portfolio" style={{ color: 'var(--cyan)' }}>作品广场</Link> / {item.title}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px', alignItems: 'start' }}>
        
        {/* 左侧：主展示区 */}
        <div>
          <div className="ui-card" style={{ padding: '8px', background: '#000', overflow: 'hidden', border: '1px solid var(--border-glow)' }}>
            {item.file_type === 'video' && item.file_url ? (
              <video src={item.file_url} controls style={{ width: '100%', maxHeight: '70vh', display: 'block', borderRadius: '8px' }} />
            ) : item.file_type === 'pdf' && item.file_url ? (
              <iframe src={`${item.file_url}#toolbar=0`} style={{ width: '100%', height: '70vh', border: 'none', borderRadius: '8px' }} />
            ) : (
              <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-dim)' }}>暂未上传源文件</div>
            )}
          </div>
          
          <div style={{ marginTop: '32px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>创作说明</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{item.content || '作者暂无补充说明。'}</p>
          </div>

          {/* 👇 核心：点赞与评论组件 */}
          <DetailInteraction portfolioId={item.id} initialLikes={item.likes_count || 0} user={user} />
        </div>

        {/* 右侧：侧边栏 */}
        <div style={{ position: 'sticky', top: '100px' }}>
          <div className="ui-card" style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px', color: 'var(--text-primary)' }}>{item.title}</h1>
            
            {/* 👇 点击作者头像跳转主页 */}
            <Link 
              href={`/portfolio/author/${encodeURIComponent(item.author_name)}`} 
              style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px dashed var(--border-subtle)', textDecoration: 'none', cursor: 'pointer' }}
            >
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--violet), var(--cyan))', display: 'grid', placeItems: 'center', color: 'white', fontWeight: 'bold' }}>
                {item.author_name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{item.author_name}</div>
                <div style={{ fontSize: '12px', color: 'var(--cyan)' }}>点击进入主页 →</div>
              </div>
            </Link>
            
            <h4 style={{ fontSize: '13px', color: 'var(--text-dim)', marginBottom: '12px' }}>使用工具栈</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {item.tools?.map((tool: string, i: number) => (
                <span key={i} style={{ fontSize: '12px', padding: '4px 12px', background: 'rgba(0,212,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: '100px', color: 'var(--text-secondary)' }}>{tool}</span>
              ))}
              {(!item.tools || item.tools.length === 0) && <span style={{ color: 'var(--text-dim)', fontSize: '12px' }}>未填写</span>}
            </div>
          </div>

          {item.category === '兼职接单' && (
            <button style={{ width: '100%', padding: '16px', borderRadius: '100px', background: 'linear-gradient(120deg, var(--cyan), #4ae0ff)', color: '#05070d', fontWeight: 800, fontSize: '16px', border: 'none', cursor: 'pointer', boxShadow: '0 0 20px rgba(0,212,255,0.3)' }}>
              联系作者接单
            </button>
          )}
        </div>
      </div>
    </main>
  )
}