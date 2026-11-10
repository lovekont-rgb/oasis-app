'use client'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPath, updatePath, deletePathAction } from './actions'

export default function PathsAdminClient({ initialPaths }: { initialPaths: any[] }) {
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<any>({})

  const handleEditClick = (path: any) => {
    setEditingId(path.id)
    setFormData({ ...path, tools: path.tools.join('\n'), pass_criteria: path.pass_criteria.join('\n') })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingId(null); setFormData({}); formRef.current?.reset()
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    try {
      const res = editingId ? (await updatePath(editingId, data), { success: true }) : await createPath(data)
      if (res.success) {
        alert(editingId ? '更新成功！' : '发布成功！')
        handleCancelEdit(); router.refresh()
      } else { alert('失败: ' + res.error) }
    } catch (err: any) { alert('异常: ' + err.message) }
  }

  const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white', marginBottom: '12px' }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
      <div className="ui-card" style={{ height: 'fit-content', maxHeight: '85vh', overflowY: 'auto' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--cyan)' }}>{editingId ? '编辑阶段信息' : '新建阶段路径'}</h3>
        <form ref={formRef} onSubmit={handleSubmit} key={editingId || 'new'}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input name="num" defaultValue={formData.num} placeholder="序号 (如: 07)" required style={{ ...inputStyle, flex: 1 }} />
            <input name="title" defaultValue={formData.title} placeholder="阶段名称" required style={{ ...inputStyle, flex: 2 }} />
          </div>
          <input name="subtitle" defaultValue={formData.subtitle} placeholder="副标题 (如: 42课时 · 剪辑)" required style={inputStyle} />
          <textarea name="description" defaultValue={formData.description} placeholder="阶段描述文案..." required rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          <input name="core" defaultValue={formData.core} placeholder="核心能力" required style={inputStyle} />
          <input name="practice" defaultValue={formData.practice} placeholder="关键练习" required style={inputStyle} />
          <input name="deliverable" defaultValue={formData.deliverable} placeholder="交付物标题" required style={inputStyle} />
          <input name="deliverable_desc" defaultValue={formData.deliverable_desc} placeholder="交付物说明" style={inputStyle} />
          <textarea name="tools" defaultValue={formData.tools} placeholder="工具栈 (每行一个)" required rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          <textarea name="pass_criteria" defaultValue={formData.pass_criteria} placeholder="通关标准 (每行一个)" required rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          <input name="sort_order" type="number" defaultValue={formData.sort_order || 0} placeholder="排序数字 (越小越靠前)" required style={inputStyle} />
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" style={{ flex: 1, padding: '12px', background: 'var(--cyan)', color: '#05070d', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>{editingId ? '保存修改' : '确认发布'}</button>
            {editingId && <button type="button" onClick={handleCancelEdit} style={{ padding: '12px', background: 'transparent', border: '1px solid var(--border-subtle)', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>取消</button>}
          </div>
        </form>
      </div>
      <div className="ui-card">
        <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>阶段列表 ({initialPaths.length})</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '600px', overflowY: 'auto' }}>
          {initialPaths.map(p => (
            <div key={p.id} style={{ padding: '16px', background: 'var(--bg-void)', border: '1px solid var(--border-subtle)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div><h4 style={{ fontWeight: 'bold' }}>{p.num} · {p.title} <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontWeight: 'normal' }}>(权重: {p.sort_order})</span></h4></div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleEditClick(p)} style={{ background: 'transparent', border: '1px solid var(--cyan)', color: 'var(--cyan)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>编辑</button>
                <form action={deletePathAction}><input type="hidden" name="id" value={p.id} /><button type="submit" style={{ border: '1px solid #ff4444', color: '#ff4444', padding: '6px 12px', borderRadius: '6px', background: 'transparent', cursor: 'pointer' }}>删除</button></form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}