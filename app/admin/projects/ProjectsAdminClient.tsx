'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createProject, deleteProjectAction, createSignal, deleteSignalAction } from './actions'

export default function ProjectsAdminClient({ projects, signals }: { projects: any[], signals: any[] }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'projects' | 'signals'>('projects')
  
  const projectFormRef = useRef<HTMLFormElement>(null)
  const signalFormRef = useRef<HTMLFormElement>(null)

  const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white', marginBottom: '12px' }

  const handleCreateProject = async (e: any) => {
    e.preventDefault()
    const res = await createProject(new FormData(e.currentTarget))
    if (res.success) { alert('项目发布成功！'); projectFormRef.current?.reset(); router.refresh() } 
    else alert(res.error)
  }

  const handleCreateSignal = async (e: any) => {
    e.preventDefault()
    const res = await createSignal(new FormData(e.currentTarget))
    if (res.success) { alert('信号发布成功！'); signalFormRef.current?.reset(); router.refresh() } 
    else alert(res.error)
  }

  return (
    <div>
      {/* Tab 切换栏 */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button onClick={() => setActiveTab('projects')} style={{ padding: '8px 20px', borderRadius: '100px', background: activeTab === 'projects' ? 'var(--cyan)' : 'transparent', color: activeTab === 'projects' ? '#05070d' : 'var(--text-secondary)', border: '1px solid var(--border-subtle)', cursor: 'pointer', fontWeight: 'bold' }}>项目实战卡片</button>
        <button onClick={() => setActiveTab('signals')} style={{ padding: '8px 20px', borderRadius: '100px', background: activeTab === 'signals' ? 'var(--cyan)' : 'transparent', color: activeTab === 'signals' ? '#05070d' : 'var(--text-secondary)', border: '1px solid var(--border-subtle)', cursor: 'pointer', fontWeight: 'bold' }}>真实市场信号</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
        
        {/* 项目实战 Tab */}
        {activeTab === 'projects' && (
          <>
            <div className="ui-card" style={{ height: 'fit-content' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--cyan)' }}>发布新项目卡片</h3>
              <form ref={projectFormRef} onSubmit={handleCreateProject}>
                <input name="tag" placeholder="标签 (如: PROJECT 05 · 新方向)" required style={inputStyle} />
                <input name="title" placeholder="项目标题" required style={inputStyle} />
                <textarea name="description" placeholder="项目描述..." required rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
                <label style={{ fontSize: '12px', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>交付物列表 (每行一条)</label>
                <textarea name="deliverables" required rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input name="price" placeholder="价格区间" required style={{ ...inputStyle, flex: 2 }} />
                  <input name="unit" placeholder="单位 (如 / 套)" required style={{ ...inputStyle, flex: 1 }} />
                </div>
                <label style={{ fontSize: '12px', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>工具标签 (每行一个)</label>
                <textarea name="chips" required rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
                <input name="sort_order" type="number" placeholder="排序 (数字越小越靠前)" style={inputStyle} />
                <button type="submit" style={{ width: '100%', padding: '12px', background: 'var(--cyan)', color: '#05070d', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', border: 'none' }}>发布项目</button>
              </form>
            </div>
            <div className="ui-card">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>已发布项目 ({projects.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '600px', overflowY: 'auto' }}>
                {projects.map(p => (
                  <div key={p.id} style={{ padding: '16px', background: 'var(--bg-void)', border: '1px solid var(--border-subtle)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontWeight: 'bold' }}>{p.title}</h4>
                      <span style={{ fontSize: '12px', color: 'var(--cyan)' }}>{p.tag}</span>
                    </div>
                    <form action={deleteProjectAction}><input type="hidden" name="id" value={p.id} /><button type="submit" style={{ border: '1px solid #ff4444', color: '#ff4444', padding: '6px 12px', borderRadius: '6px', background: 'transparent', cursor: 'pointer' }}>删除</button></form>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* 市场信号 Tab */}
        {activeTab === 'signals' && (
          <>
            <div className="ui-card" style={{ height: 'fit-content' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--cyan)' }}>发布新市场信号</h3>
              <form ref={signalFormRef} onSubmit={handleCreateSignal}>
                <input name="title" placeholder="信号标题" required style={inputStyle} />
                <textarea name="description" placeholder="信号详细描述..." required rows={5} style={{ ...inputStyle, resize: 'vertical' }} />
                <input name="sort_order" type="number" placeholder="排序 (数字越小越靠前)" style={inputStyle} />
                <button type="submit" style={{ width: '100%', padding: '12px', background: 'var(--cyan)', color: '#05070d', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', border: 'none' }}>发布信号</button>
              </form>
            </div>
            <div className="ui-card">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>已发布信号 ({signals.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '600px', overflowY: 'auto' }}>
                {signals.map(s => (
                  <div key={s.id} style={{ padding: '16px', background: 'var(--bg-void)', border: '1px solid var(--border-subtle)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontWeight: 'bold' }}>{s.title}</h4>
                    </div>
                    <form action={deleteSignalAction}><input type="hidden" name="id" value={s.id} /><button type="submit" style={{ border: '1px solid #ff4444', color: '#ff4444', padding: '6px 12px', borderRadius: '6px', background: 'transparent', cursor: 'pointer' }}>删除</button></form>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  )
}