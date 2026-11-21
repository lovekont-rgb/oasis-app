import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const instant = false

export default async function CollectionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 查询用户收藏的作品
  const { data: interactions } = await supabase
    .from('portfolio_interactions')
    .select('portfolio_id, portfolios(*)')
    .eq('user_id', user.id)
    .eq('type', 'collect')
    .order('created_at', { ascending: false })

  const collectedWorks = interactions?.map(i => i.portfolios).filter(Boolean) || []

  return (
    <div>
      <h1 className="ui-title" style={{ fontSize: '2rem', marginBottom: '32px' }}>我的收藏</h1>
      
      {collectedWorks.length === 0 ? (
        <div className="ui-card" style={{ padding: '80px 20px', textAlign: 'center', borderStyle: 'dashed' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⭐</div>
          <p style={{ color: 'var(--text-secondary)' }}>你还没有收藏过任何作品。</p>
          <Link href="/portfolio" style={{ color: 'var(--cyan)', display: 'inline-block', marginTop: '16px' }}>去广场逛逛 →</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {collectedWorks.map((item: any) => (
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
      )}
    </div>
  )
}