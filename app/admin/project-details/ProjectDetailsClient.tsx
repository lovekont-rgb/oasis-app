'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveProjectDetail } from './actions'

export default function ProjectDetailsClient({ projects, details }: { projects: any[], details: any[] }) {
  const router = useRouter()
  const [selectedId, setSelectedId] = useState<number>(projects[0]?.id || 0)
  
  const currentDetail = details.find(d => d.project_id === selectedId)
  
  // 格式化展示的字符串
  const initialReq = currentDetail?.requirements?.join('\n') || ''
  const initialSteps = currentDetail?.process_steps?.map((s: any) => `${s.title} | ${s.desc}`).join('\n') || ''

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const res = await saveProjectDetail(formData)
    if (res.success) {
      alert('保存成功！')
      router.refresh()
    } else {
      alert('保存失败')
    }
  }

  const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white', marginBottom: '16px' }

  return (
    <div className="ui-card" style={{ padding: '32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>选择要编辑的项目：</label>
        <select 
          value={selectedId} 
          onChange={(e) => setSelectedId(Number(e.target.value))}
          style={{ ...inputStyle, maxWidth: '400px' }}
        >
          {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>
      </div>

      <form onSubmit={handleSave} key={selectedId}>
        <input type="hidden" name="project_id" value={selectedId} />
        
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>项目背景 (长篇介绍)</label>
        <textarea name="background" defaultValue={currentDetail?.background} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />

        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>项目准入要求 (每行一条)</label>
        <textarea name="requirements" defaultValue={initialReq} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />

        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>交付流程步骤 (每行一条，格式：标题 | 描述)</label>
        <textarea name="process_steps" defaultValue={initialSteps} rows={4} style={{ ...inputStyle, resize: 'vertical' }} placeholder="需求沟通 | 明确品牌调性...&#10;初步生成 | 搭建工作流..." />

        <button type="submit" style={{ padding: '12px 32px', background: 'var(--cyan)', color: '#05070d', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', border: 'none', marginTop: '16px' }}>保存详情</button>
      </form>
    </div>
  )
}