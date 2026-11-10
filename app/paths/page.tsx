import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const instant = false

export default async function PathsPage() {
  const supabase = await createClient()
  // 按 sort_order 获取全部阶段
  const { data: paths } = await supabase.from('learning_paths').select('*').order('sort_order', { ascending: true })

  return (
    <main className="page-container">
      <div className="ui-badge"><span className="ui-badge-dot"></span>LEARNING PATHS</div>
      <h1 className="ui-title">
        <span style={{ fontFamily: 'Orbitron, monospace' }}>{paths?.length || 0}</span> 个阶段， <span className="ui-title-gradient">每一步都有交付物</span>
      </h1>
      <p className="ui-subtitle">
        2026 年做 AIGC 学习，最大的误区是“学工具”。企业看的是交付能力。这条路径以交付为锚点，拆解每个阶段的具体任务。
      </p>

      <div className="ui-grid-3">
        {paths?.map((path) => (
          <Link href={`/paths/${path.id}`} key={path.id} className="ui-card" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'Orbitron', color: 'rgba(0,212,255,0.15)', marginBottom: '8px' }}>{path.num}</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>{path.title}</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>{path.subtitle}</p>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '24px' }}>
              {path.tools?.slice(0, 3).map((tool: string, i: number) => (
                <span key={i} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '100px', border: '1px solid var(--border-subtle)', color: 'var(--cyan)' }}>{tool}</span>
              ))}
            </div>
            <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px dashed var(--border-subtle)', fontSize: '13px', color: 'var(--text-dim)' }}>
              交付物：<span style={{ color: 'var(--cyan)' }}>{path.deliverable}</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}