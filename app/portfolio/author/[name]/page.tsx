import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export const instant = false

export default async function AuthorPage({ params }: { params: Promise<{ name: string }> }) {
  const resolvedParams = await params
  const authorName = decodeURIComponent(resolvedParams.name)

  const supabase = await createClient()
  // 查询该作者发布的所有作品
  const { data: works } = await supabase
    .from('portfolios')
    .select('*')
    .eq('author_name', authorName)
    .order('created_at', { ascending: false })

  if (!works || works.length === 0) notFound()

  return (
    <main className="page-container">
      <div style={{ marginBottom: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
        <Link href="/portfolio" style={{ color: 'var(--cyan)' }}>作品广场</Link> / 创作者主页
      </div>

      {/* 作者信息卡片 */}
      <div className="ui-card" style={{ padding: '40px', display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '40px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--violet), var(--cyan))', display: 'grid', placeItems: 'center', color: 'white', fontWeight: '900', fontSize: '32px' }}>
          {authorName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="ui-title" style={{ fontSize: '2rem', marginBottom: '8px' }}>{authorName}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>已发布 {works.length} 个作品</p>
        </div>
      </div>

      {/* 作品网格 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {works.map(item => (
          <Link href={`/portfolio/${item.id}`} key={item.id} className="ui-card" style={{ padding: 0, overflow: 'hidden', textDecoration: 'none' }}>
            <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
              <img src={item.cover_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ padding: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>{item.title}</h3>
              <span style={{ fontSize: '12px', color: 'var(--cyan)' }}>{item.category}</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}