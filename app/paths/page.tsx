import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const instant = false

export default async function PathsPage() {
  const supabase = await createClient()
  // 按排序获取所有阶段
  const { data: paths } = await supabase.from('learning_paths').select('*').order('sort_order', { ascending: true })

  return (
    <main className="page-container">
      <div className="ui-badge"><span className="ui-badge-dot"></span>LEARNING PATHS</div>
      <h1 className="ui-title">
        <span style={{ fontFamily: 'Orbitron, monospace' }}>{paths?.length || 0}</span> 个阶段， <span className="ui-title-gradient">每一步都有交付物</span>
      </h1>
      <p className="ui-subtitle">
        2026 年做 AIGC 学习，最大的误区是“学工具”。企业看的是交付能力：你能否独立完成一条商业短视频、一部 AI 漫剧、一套完整作品集。这条路径以交付为锚点，拆解每个阶段的具体任务。
      </p>

      {/* 恢复最初的三列网格布局 */}
      <div className="ui-grid-3" style={{ marginTop: '40px' }}>
        {paths?.map((path) => (
          <Link 
            href={`/paths/${path.id}`} 
            key={path.id} 
            className="ui-card" 
            style={{ 
              textDecoration: 'none', 
              display: 'flex', 
              flexDirection: 'column',
              padding: '28px 24px' // 恢复最初的宽裕内边距
            }}
          >
            {/* 恢复超大暗色数字 */}
            <div style={{ 
              fontFamily: 'Orbitron, monospace', 
              fontSize: '2.5rem', 
              fontWeight: 900, 
              color: 'rgba(0, 212, 255, 0.12)', 
              lineHeight: 1, 
              marginBottom: '14px' 
            }}>
              {path.num}
            </div>

            {/* 标题 */}
            <h3 style={{ 
              fontFamily: 'Syne, sans-serif', 
              fontSize: '1.2rem', 
              fontWeight: 700, 
              marginBottom: '8px',
              color: 'var(--text-primary)'
            }}>
              {path.title}
            </h3>

            {/* 副标题/关注点 */}
            <p style={{ 
              fontSize: '13px', 
              color: 'var(--text-secondary)', 
              marginBottom: '16px' 
            }}>
              {path.subtitle}
            </p>

            {/* 工具栈标签 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
              {path.tools?.slice(0, 3).map((tool: string, i: number) => (
                <span 
                  key={i} 
                  style={{ 
                    fontFamily: 'Orbitron, monospace', 
                    fontSize: '11px', 
                    padding: '4px 10px', 
                    borderRadius: '100px', 
                    background: 'rgba(0, 212, 255, 0.05)', 
                    border: '1px solid rgba(0, 212, 255, 0.2)', 
                    color: 'var(--cyan)' 
                  }}
                >
                  {tool}
                </span>
              ))}
            </div>

            {/* 底部交付物 */}
            <div style={{ 
              marginTop: 'auto', 
              paddingTop: '16px', 
              borderTop: '1px dashed var(--border-subtle)', 
              fontSize: '13px', 
              color: 'var(--text-dim)' 
            }}>
              交付物：<span style={{ color: 'var(--cyan)', fontWeight: 'bold' }}>{path.deliverable}</span>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '60px' }}>
        <Link href="/modules" className="btn-primary" style={{ padding: '16px 40px', borderRadius: '100px', background: 'linear-gradient(120deg, var(--cyan), #4ae0ff)', color: '#05070d', fontWeight: 'bold', textDecoration: 'none', boxShadow: '0 0 30px rgba(0,212,255,0.3)' }}>
          下一步：查看课程模块 →
        </Link>
      </div>
    </main>
  )
}