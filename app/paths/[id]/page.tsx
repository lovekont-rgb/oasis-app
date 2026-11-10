import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export const instant = false

export default async function PathDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const pathId = Number(resolvedParams.id)

  const supabase = await createClient()
  
  // 1. 获取当前详情
  const { data: path } = await supabase.from('learning_paths').select('*').eq('id', pathId).single()
  if (!path) notFound()

  // 2. 获取全部列表（为了计算上一页下一页）
  const { data: allPaths } = await supabase.from('learning_paths').select('id, num, title').order('sort_order', { ascending: true })
  const currentIndex = allPaths?.findIndex(p => p.id === pathId) ?? -1
  const prevPath = currentIndex > 0 ? allPaths?.[currentIndex - 1] : null
  const nextPath = currentIndex < (allPaths?.length || 0) - 1 ? allPaths?.[currentIndex + 1] : null

  return (
    <main className="page-container">
      <div style={{ marginBottom: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
        <Link href="/paths" style={{ color: 'var(--cyan)' }}>学习路径</Link> / {path.num} {path.title}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px', alignItems: 'start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', marginBottom: '20px' }}>
            <span style={{ fontSize: '6rem', fontWeight: 900, fontFamily: 'Orbitron', color: 'transparent', WebkitTextStroke: '2px rgba(0,212,255,0.3)', lineHeight: 0.8 }}>{path.num}</span>
            <div>
              <div className="ui-badge" style={{ marginBottom: '12px' }}><span className="ui-badge-dot"></span>LEARNING STAGE</div>
              <h1 className="ui-title" style={{ fontSize: '3rem', marginBottom: '8px' }}>{path.title}</h1>
              <p style={{ color: 'var(--cyan)', fontFamily: 'Orbitron', fontSize: '14px' }}>{path.subtitle}</p>
            </div>
          </div>

          <p className="ui-subtitle" style={{ maxWidth: '100%', marginBottom: '40px' }}>{path.description}</p>

          <div className="ui-card" style={{ border: '1px solid var(--cyan)', background: 'rgba(0, 212, 255, 0.05)', padding: '32px', marginBottom: '40px' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>🎯 阶段通关交付物</h3>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--cyan)' }}>{path.deliverable}</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '8px' }}>{path.deliverable_desc}</p>
          </div>

          <h3 className="ui-section-title" style={{ marginTop: '0', marginBottom: '24px' }}>阶段核心任务</h3>
          <div style={{ borderLeft: '2px solid var(--border-subtle)', marginLeft: '12px', paddingLeft: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-41px', top: '0', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--bg-void)', border: '2px solid var(--cyan)' }}></div>
              <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>核心能力训练</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>{path.core}</p>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-41px', top: '0', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--bg-void)', border: '2px solid var(--cyan)' }}></div>
              <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>关键实战练习</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>{path.practice}</p>
            </div>
          </div>
        </div>

        <div style={{ position: 'sticky', top: '100px' }}>
          <div className="ui-card" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>通关标准</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {path.pass_criteria?.map((criteria: string, i: number) => (
                <li key={i} style={{ fontSize: '14px', color: 'var(--green)', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(60, 220, 140, 0.05)', padding: '10px 16px', borderRadius: '8px', border: '1px solid rgba(60, 220, 140, 0.2)' }}>
                  <span>✅</span> {criteria}
                </li>
              ))}
            </ul>
          </div>
          <div className="ui-card" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>涉及工具栈</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {path.tools?.map((tool: string, i: number) => (
                <span key={i} style={{ fontSize: '12px', padding: '6px 14px', borderRadius: '100px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>{tool}</span>
              ))}
            </div>
          </div>
          <Link href="/modules" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', width: '100%', padding: '16px', borderRadius: '100px', background: 'linear-gradient(120deg, var(--cyan), #4ae0ff)', color: '#05070d', fontWeight: 800, fontSize: '16px', boxShadow: '0 0 30px rgba(0,212,255,0.3)' }}>查看本阶段课程 →</Link>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '80px', paddingTop: '32px', borderTop: '1px solid var(--border-subtle)' }}>
        {prevPath ? (
          <Link href={`/paths/${prevPath.id}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '12px' }}>← 上一阶段</span>
            <span style={{ fontSize: '16px', color: 'var(--text-primary)', fontWeight: 'bold' }}>{prevPath.num} {prevPath.title}</span>
          </Link>
        ) : <div></div>}
        {nextPath ? (
          <Link href={`/paths/${nextPath.id}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
            <span style={{ fontSize: '12px' }}>下一阶段 →</span>
            <span style={{ fontSize: '16px', color: 'var(--cyan)', fontWeight: 'bold' }}>{nextPath.num} {nextPath.title}</span>
          </Link>
        ) : <div></div>}
      </div>
    </main>
  )
}