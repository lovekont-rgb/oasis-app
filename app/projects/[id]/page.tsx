import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export const instant = false

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const projectId = resolvedParams.id

  const supabase = await createClient()
  const { data: project } = await supabase.from('project_items').select('*').eq('id', projectId).single()
  
  if (!project) notFound()

  // 获取详情扩展数据
  const { data: details } = await supabase.from('project_details').select('*').eq('project_id', projectId).single()

  return (
    <main className="page-container">
      {/* 面包屑 */}
      <div style={{ marginBottom: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
        <Link href="/projects" style={{ color: 'var(--cyan)' }}>项目实战</Link> / {project.title}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px', alignItems: 'start' }}>
        
        {/* 左侧内容 */}
        <div>
          <div className="ui-badge"><span className="ui-badge-dot"></span>{project.tag}</div>
          <h1 className="ui-title" style={{ fontSize: '3rem' }}>{project.title}</h1>
          <p className="ui-subtitle" style={{ maxWidth: '100%', marginBottom: '32px' }}>
            {project.description}
          </p>

          {/* 项目背景 */}
          <div className="ui-card" style={{ marginBottom: '32px', padding: '32px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>项目实战背景</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '15px' }}>
              {details?.background || '暂无背景介绍，请联系管理员补充。'}
            </p>
          </div>

          {/* 交付流程 */}
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '40px 0 24px', color: 'var(--text-primary)' }}>标准交付流程</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {details?.process_steps?.map((step: any, index: number) => (
              <div key={index} style={{ display: 'flex', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,212,255,0.1)', color: 'var(--cyan)', display: 'grid', placeItems: 'center', fontWeight: 'bold', border: '1px solid var(--cyan)', fontFamily: 'Orbitron' }}>
                    {index + 1}
                  </div>
                  {index !== details.process_steps.length - 1 && (
                    <div style={{ width: 2, flex: 1, background: 'var(--border-subtle)', marginTop: '8px' }}></div>
                  )}
                </div>
                <div className="ui-card" style={{ flex: 1, padding: '20px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>{step.title}</h4>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{step.desc}</p>
                </div>
              </div>
            ))}
            {!details?.process_steps && <p style={{ color: 'var(--text-dim)' }}>暂无流程说明。</p>}
          </div>
        </div>

        {/* 右侧侧边栏 */}
        <div style={{ position: 'sticky', top: '100px' }}>
          <div className="ui-card" style={{ marginBottom: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-dim)', display: 'block', marginBottom: '8px' }}>参考报价</span>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--cyan)', fontFamily: 'Orbitron' }}>
                {project.price} <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontFamily: 'Inter', fontWeight: 'normal' }}>{project.unit}</span>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-dim)', display: 'block', marginBottom: '12px' }}>阶段交付物</span>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {project.deliverables?.map((item: string, i: number) => (
                  <li key={i} style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'var(--green)' }}>✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span style={{ fontSize: '13px', color: 'var(--text-dim)', display: 'block', marginBottom: '12px' }}>项目准入要求</span>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {details?.requirements?.map((req: string, i: number) => (
                  <li key={i} style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'var(--warn)' }}>❗</span> {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button style={{ width: '100%', padding: '16px', borderRadius: '100px', background: 'linear-gradient(120deg, var(--cyan), #4ae0ff)', color: '#05070d', fontWeight: 800, fontSize: '16px', border: 'none', cursor: 'pointer', boxShadow: '0 0 30px rgba(0,212,255,0.3)' }}>
            申请承接该项目
          </button>
        </div>

      </div>
    </main>
  )
}