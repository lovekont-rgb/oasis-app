import { createClient } from '@/lib/supabase/server'

export const instant = false

export default async function MyPortfolioPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: works } = await supabase.from('portfolios')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="ui-title" style={{ fontSize: '2rem', marginBottom: '32px' }}>我的作品</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
        {works?.map(item => (
          <div key={item.id} className="ui-card" style={{ padding: 0, overflow: 'hidden' }}>
            <img src={item.cover_url} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
            <div style={{ padding: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>{item.title}</h3>
              <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{item.category}</span>
            </div>
          </div>
        ))}
        {(!works || works.length === 0) && <p style={{ color: 'var(--text-dim)' }}>你还没有发布过作品。</p>}
      </div>
    </div>
  )
}