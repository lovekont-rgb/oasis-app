import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export const instant = false

export default async function AuthorPage({ params }: { params: Promise<{ name: string }> }) {
  const resolvedParams = await params
  const authorName = decodeURIComponent(resolvedParams.name)

  const supabase = await createClient()
  // 👇 核心：只查询该作者已通过审核的作品
  const { data: works } = await supabase
    .from('portfolios')
    .select('*')
    .eq('author_name', authorName)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (!works || works.length === 0) notFound()

  const { data: authorProfile } = await supabase
    .from('profiles')
    .select('avatar_url, username, bio')
    .eq('username', authorName)
    .single()

  const totalLikes = works.reduce((acc, curr) => acc + (curr.likes_count || 0), 0)

  return (
    <main className="page-container" style={{ maxWidth: '1000px' }}>
      <div style={{ marginBottom: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
        <Link href="/portfolio" style={{ color: 'var(--cyan)' }}>作品广场</Link> / {authorName} 的主页
      </div>

      {/* 创作者名片区 */}
      <div className="ui-card" style={{ 
        padding: '48px', display: 'flex', alignItems: 'center', gap: '32px', 
        background: 'radial-gradient(ellipse 80% 100% at 0% 0%, rgba(0,212,255,0.1), transparent 70%), var(--surface-card)',
        border: '1px solid var(--border-glow)', marginBottom: '40px', flexWrap: 'wrap'
      }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--violet), var(--cyan))', display: 'grid', placeItems: 'center', color: 'white', fontWeight: '900', fontSize: '40px', boxShadow: '0 0 30px rgba(0,212,255,0.4)', overflow: 'hidden' }}>
          {authorProfile?.avatar_url ? (
            <img src={authorProfile.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            authorName.charAt(0).toUpperCase()
          )}
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <h1 className="ui-title" style={{ fontSize: '2.5rem', margin: 0 }}>{authorName}</h1>
            <span className="ui-badge" style={{ margin: 0, padding: '4px 12px', fontSize: '12px' }}><span className="ui-badge-dot"></span>认证创作者</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '24px' }}>
            {authorProfile?.bio || '这个人很懒，还没有写个人简介...'}
          </p>
          
          <div style={{ display: 'flex', gap: '32px' }}>
            <div><span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{works.length}</span> <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>发布作品</span></div>
            <div><span style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff4444' }}>{totalLikes}</span> <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>收获点赞</span></div>
          </div>
        </div>
      </div>

      {/* 作品展示区 */}
      <h2 className="ui-section-title" style={{ marginTop: 0, marginBottom: '24px' }}>TA 的作品</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {works.map(item => (
          <Link href={`/portfolio/${item.id}`} key={item.id} className="ui-card" style={{ padding: 0, overflow: 'hidden', textDecoration: 'none' }}>
            <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
              <img src={item.cover_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ padding: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>{item.title}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--cyan)' }}>{item.category}</span>
                <span style={{ fontSize: '12px', color: '#ff4444' }}>❤️ {item.likes_count || 0}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}