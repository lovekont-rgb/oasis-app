import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export const instant = false

export default async function WeeklyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const id = Number(resolvedParams.id)

  const supabase = await createClient()
  
  // 1. 获取当前周刊
  const { data: weekly } = await supabase.from('community_weekly').select('*').eq('id', id).single()
  if (!weekly) notFound()

  // 2. 获取所有周刊用于上下期导航
  const { data: allWeekly } = await supabase.from('community_weekly').select('id, vol, title').order('sort_order', { ascending: false })
  const currentIndex = allWeekly?.findIndex(w => w.id === id) ?? -1
  const prevWeek = currentIndex > 0 ? allWeekly?.[currentIndex - 1] : null
  const nextWeek = currentIndex < (allWeekly?.length || 0) - 1 ? allWeekly?.[currentIndex + 1] : null

  return (
    <main className="page-container" style={{ maxWidth: '800px' }}>
      {/* 面包屑 */}
      <div style={{ marginBottom: '32px', fontSize: '14px', color: 'var(--text-secondary)' }}>
        <Link href="/community" style={{ color: 'var(--cyan)' }}>社区</Link> / AI 周刊
      </div>

      {/* 头部信息 */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div className="ui-badge" style={{ margin: '0 auto 24px' }}><span className="ui-badge-dot"></span>{weekly.vol}</div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.3, color: 'var(--text-primary)', marginBottom: '24px' }}>
          {weekly.title}
        </h1>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', fontSize: '14px', color: 'var(--text-dim)' }}>
          <span>✍️ {weekly.author}</span>
          <span>⏱️ 阅读约 {weekly.read_time}</span>
        </div>
      </div>

      {/* 封面图 */}
      {weekly.cover_url && (
        <div style={{ width: '100%', height: '400px', borderRadius: '16px', overflow: 'hidden', marginBottom: '48px', border: '1px solid var(--border-subtle)' }}>
          <img src={weekly.cover_url} alt={weekly.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      {/* 正文内容 (使用 pre-wrap 保留后台输入的换行) */}
      <div style={{ 
        fontSize: '16px', 
        lineHeight: 2, 
        color: 'var(--text-secondary)',
        whiteSpace: 'pre-wrap',
        background: 'var(--surface-card)',
        padding: '40px',
        borderRadius: '16px',
        border: '1px solid var(--border-subtle)'
      }}>
        {weekly.content || weekly.description}
      </div>

      {/* 底部上下期导航 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '80px', paddingTop: '32px', borderTop: '1px solid var(--border-subtle)' }}>
        {prevWeek ? (
          <Link href={`/community/weekly/${prevWeek.id}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '12px' }}>← 上一期</span>
            <span style={{ fontSize: '16px', color: 'var(--text-primary)', fontWeight: 'bold' }}>{prevWeek.vol} {prevWeek.title}</span>
          </Link>
        ) : <div></div>}

        {nextWeek ? (
          <Link href={`/community/weekly/${nextWeek.id}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
            <span style={{ fontSize: '12px' }}>下一期 →</span>
            <span style={{ fontSize: '16px', color: 'var(--cyan)', fontWeight: 'bold' }}>{nextWeek.vol} {nextWeek.title}</span>
          </Link>
        ) : <div></div>}
      </div>
    </main>
  )
}