import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import CopyButton from './CopyButton' // 我们等一下建这个组件

export const instant = false

export default async function PromptsPage() {
  const supabase = await createClient()
  // 获取所有数据
  const { data: items } = await supabase.from('prompt_engineering').select('*').order('sort_order')
  
  // 按类型分组
  const formulas = items?.filter(i => i.type === 'formula') || []
  const anatomy = items?.filter(i => i.type === 'anatomy') || []
  const templates = items?.filter(i => i.type === 'template') || []
  const principles = items?.filter(i => i.type === 'principle') || []

  return (
    <main className="page-container">
      {/* 头部 */}
      <div className="ui-badge"><span className="ui-badge-dot"></span>PROMPT ENGINEERING</div>
      <h1 className="ui-title">从 <span className="ui-title-gradient">堆词</span> 到 <span className="ui-title-gradient">结构化控制</span></h1>
      <p className="ui-subtitle">
        2026 年最有价值的共识之一：Prompt 正在从“描述画面”走向“控制画面”。同样的模型，有人一直在抽卡，有人已经开始稳定出片——差别不在模型，而在有没有把自己的方法攒下来。
      </p>

      {/* 1. 三套核心公式 */}
      <h2 className="ui-section-title">三套核心公式</h2>
      <div className="ui-grid-3">
        {formulas.map(item => (
          <div key={item.id} className="ui-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--cyan)', marginBottom: '16px' }}>{item.title}</h3>
            <div style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', marginBottom: '16px', border: '1px solid var(--border-subtle)' }}>
              {item.subtitle}
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-dim)', lineHeight: 1.6 }}>{item.content}</p>
          </div>
        ))}
      </div>

      {/* 2. 图像提示词的五个解剖层 */}
      <h2 className="ui-section-title">图像提示词的五个解剖层</h2>
      <div className="ui-grid-2">
        {anatomy.map(item => (
          <div key={item.id} className="ui-card" style={{ padding: '20px' }}>
            <h4 style={{ color: 'var(--cyan)', fontSize: '14px', marginBottom: '8px', fontFamily: 'Orbitron' }}>{item.title}</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>{item.content}</p>
          </div>
        ))}
      </div>

      {/* 3. 可复制模板库 */}
      <h2 className="ui-section-title">可复制模板库</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {templates.map(item => (
          <div key={item.id} className="ui-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '4px' }}>{item.title}</h4>
                <span style={{ fontSize: '11px', color: 'var(--violet)', border: '1px solid var(--violet)', padding: '2px 8px', borderRadius: '100px' }}>{item.subtitle}</span>
              </div>
              <CopyButton content={item.content || ''} />
            </div>
            <pre style={{ background: 'rgba(0,0,0,0.4)', padding: '20px', borderRadius: '10px', color: 'var(--text-secondary)', fontSize: '13px', whiteSpace: 'pre-wrap', fontFamily: 'monospace', border: '1px solid var(--border-subtle)', margin: 0 }}>
              {item.content}
            </pre>
          </div>
        ))}
      </div>

      {/* 4. 四条迭代原则 */}
      <h2 className="ui-section-title">四条迭代原则</h2>
      <div className="ui-grid-2">
        {principles.map(item => (
          <div key={item.id} className="ui-card" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '16px', marginBottom: '8px', color: 'var(--text-primary)' }}>{item.title}</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>{item.content}</p>
          </div>
        ))}
      </div>

      {/* 底部按钮 */}
      <div style={{ textAlign: 'center', marginTop: '80px' }}>
        <Link href="/prompt-library" style={{ display: 'inline-block', background: 'linear-gradient(120deg, var(--cyan), #4ae0ff)', color: '#05070d', fontWeight: 'bold', fontSize: '15px', padding: '16px 40px', borderRadius: '100px', textDecoration: 'none', boxShadow: '0 0 30px rgba(0, 212, 255, 0.3)' }}>
          去提示词库复制更多 →
        </Link>
      </div>
    </main>
  )
}