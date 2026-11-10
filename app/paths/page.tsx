import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const instant = false

export default async function PathsPage() {
  const supabase = await createClient()
  // 按排序获取所有阶段
  const { data: paths } = await supabase.from('learning_paths').select('*').order('sort_order', { ascending: true })

  return (
    <main className="page-container">
      {/* 头部区域 */}
      <div className="ui-badge"><span className="ui-badge-dot"></span>LEARNING PATHS</div>
      <h1 className="ui-title">
        <span style={{ fontFamily: 'Orbitron, monospace' }}>{paths?.length || 0}</span> 个阶段， <span className="ui-title-gradient">每一步都有交付物</span>
      </h1>
      <p className="ui-subtitle" style={{ marginBottom: '80px' }}>
        2026 年做 AIGC 学习，最大的误区是“学工具”。企业看的是交付能力：你能否独立完成一条商业短视频、一部 AI 漫剧、一套完整作品集。这条路径以交付为锚点，拆解每个阶段的具体任务。
      </p>

      {/* 垂直大阶段列表 */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {paths?.map((path, index) => (
          <Link 
            href={`/paths/${path.id}`} 
            key={path.id}
            style={{ 
              textDecoration: 'none', 
              display: 'flex', 
              gap: '40px', 
              padding: '60px 0', 
              borderBottom: index !== paths.length - 1 ? '1px dashed var(--border-subtle)' : 'none',
              transition: 'opacity 0.3s',
              cursor: 'pointer'
            }}
          >
            {/* 左侧：巨大暗色数字 */}
            <div style={{ 
              width: '120px', 
              flexShrink: 0,
              fontFamily: 'Orbitron, monospace', 
              fontSize: '4.5rem', 
              fontWeight: 900, 
              color: 'rgba(0, 212, 255, 0.1)', // 极暗的科技蓝
              lineHeight: 1,
              userSelect: 'none'
            }}>
              {path.num}
            </div>

            {/* 右侧：主要内容 */}
            <div style={{ flex: 1 }}>
              
              {/* 标题与副标题 */}
              <h2 style={{ 
                fontFamily: 'Syne, sans-serif', 
                fontSize: '2rem', 
                fontWeight: 800, 
                color: 'var(--text-primary)',
                marginBottom: '12px'
              }}>
                {path.title}
              </h2>
              <div style={{ 
                color: 'var(--cyan)', 
                fontFamily: 'Orbitron, monospace', 
                fontSize: '14px', 
                letterSpacing: '0.05em',
                marginBottom: '24px' 
              }}>
                {path.subtitle}
              </div>

              {/* 描述 */}
              <p style={{ 
                fontSize: '15px', 
                color: 'var(--text-secondary)', 
                lineHeight: 1.8, 
                marginBottom: '32px' 
              }}>
                {path.description}
              </p>

              {/* 三列信息卡片 (核心能力、工具栈、关键练习) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', padding: '20px', borderRadius: '12px' }}>
                  <h4 style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '12px', fontFamily: 'Orbitron', textTransform: 'uppercase' }}>核心能力</h4>
                  <p style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500, margin: 0, lineHeight: 1.6 }}>{path.core}</p>
                </div>
                
                <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', padding: '20px', borderRadius: '12px' }}>
                  <h4 style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '12px', fontFamily: 'Orbitron', textTransform: 'uppercase' }}>工具栈</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {path.tools?.map((tool: string, i: number) => (
                      <span key={i} style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '100px', background: 'rgba(0, 212, 255, 0.05)', border: '1px solid rgba(0, 212, 255, 0.2)', color: 'var(--cyan)' }}>
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', padding: '20px', borderRadius: '12px' }}>
                  <h4 style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '12px', fontFamily: 'Orbitron', textTransform: 'uppercase' }}>关键练习</h4>
                  <p style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500, margin: 0, lineHeight: 1.6 }}>{path.practice}</p>
                </div>
              </div>

              {/* 阶段交付物发光框 */}
              <div style={{ 
                background: 'rgba(0, 212, 255, 0.03)', 
                border: '1px solid var(--border-glow)', 
                padding: '20px 24px', 
                borderRadius: '12px', 
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '24px'
              }}>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>阶段交付物：</span>
                <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--cyan)' }}>{path.deliverable}</span>
                <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>{path.deliverable_desc}</span>
              </div>

              {/* 通关标签 */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {path.pass_criteria?.map((criteria: string, i: number) => (
                  <span key={i} style={{ 
                    fontSize: '13px', 
                    padding: '6px 16px', 
                    borderRadius: '100px', 
                    background: 'rgba(60, 220, 140, 0.05)', 
                    border: '1px solid rgba(60, 220, 140, 0.2)', 
                    color: 'var(--green)' 
                  }}>
                    通关：{criteria}
                  </span>
                ))}
              </div>

            </div>
          </Link>
        ))}
      </div>

      {/* 底部按钮 */}
      <div style={{ textAlign: 'center', marginTop: '80px' }}>
        <Link href="/modules" style={{ padding: '16px 40px', borderRadius: '100px', background: 'linear-gradient(120deg, var(--cyan), #4ae0ff)', color: '#05070d', fontWeight: 'bold', fontSize: '16px', textDecoration: 'none', display: 'inline-block', boxShadow: '0 0 30px rgba(0,212,255,0.3)' }}>
          下一步：查看课程模块 →
        </Link>
      </div>
    </main>
  )
}