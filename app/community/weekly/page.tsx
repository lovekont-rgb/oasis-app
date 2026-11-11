import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const instant = false

export default async function WeeklyListPage() {
  const supabase = await createClient()
  const { data: weekly } = await supabase.from('community_weekly').select('*').order('sort_order', { ascending: false })

  return (
    <main className="page-container" style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
        <Link href="/community" style={{ color: 'var(--cyan)' }}>社区</Link> / AI 周刊
      </div>

      <div className="ui-badge"><span className="ui-badge-dot"></span>AI WEEKLY</div>
      <h1 className="ui-title">沉淀判断，<span className="ui-title-gradient">不搬运新闻</span></h1>
      <p className="ui-subtitle">每周精选模型更新、工具迭代与值得回看的落地案例。</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '40px' }}>
        {weekly?.map(item => (
          <Link 
            href={`/community/weekly/${item.id}`} 
            key={item.id}
            className="ui-card"
            style={{ 
              display: 'flex', gap: '32px', textDecoration: 'none', 
              padding: '32px', transition: '0.3s', alignItems: 'center' 
            }}
          >
            {item.cover_url && (
              <div style={{ width: '200px', height: '120px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                <img src={item.cover_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontFamily: 'Orbitron', color: 'var(--cyan)', fontSize: '14px', fontWeight: 'bold' }}>{item.vol}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>⏱️ {item.read_time}</span>
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>{item.title}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}