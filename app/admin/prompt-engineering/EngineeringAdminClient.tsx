'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createEngineeringItem, deleteEngineeringItemAction } from './actions'

export default function EngineeringAdminClient({ items }: { items: any[] }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'formula' | 'anatomy' | 'template' | 'principle'>('formula')
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.append('type', activeTab) // 自动附加当前 Tab 的类型
    const res = await createEngineeringItem(formData)
    if (res.success) {
      alert('发布成功！')
      formRef.current?.reset()
      router.refresh()
    } else {
      alert('失败: ' + res.error)
    }
  }

  const filteredItems = items.filter(i => i.type === activeTab)
  const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white', marginBottom: '12px' }

  const tabNames = { formula: '核心公式', anatomy: '五个解剖层', template: '模板库', principle: '迭代原则' }

  return (
    <div>
      {/* Tab 切换 */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        {(Object.keys(tabNames) as Array<keyof typeof tabNames>).map(key => (
          <button key={key} onClick={() => setActiveTab(key)} style={{ padding: '8px 20px', borderRadius: '100px', background: activeTab === key ? 'var(--cyan)' : 'transparent', color: activeTab === key ? '#05070d' : 'var(--text-secondary)', border: '1px solid var(--border-subtle)', cursor: 'pointer', fontWeight: 'bold' }}>
            {tabNames[key]}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
        {/* 左侧表单 */}
        <div className="ui-card" style={{ height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--cyan)' }}>新增 {tabNames[activeTab]}</h3>
          <form ref={formRef} onSubmit={handleSubmit} key={activeTab}>
            <input name="title" placeholder="标题" required style={inputStyle} />
            
            {/* 只有公式和模板需要副标题（例如代码片段或适用模型） */}
            {(activeTab === 'formula' || activeTab === 'template') && (
              <input name="subtitle" placeholder={activeTab === 'formula' ? '公式 (如: 角色+任务)' : '适用模型 (如: ChatGPT)'} style={inputStyle} />
            )}

            <textarea name="content" placeholder="详细描述/模板内容..." required rows={activeTab === 'template' ? 10 : 4} style={{ ...inputStyle, resize: 'vertical' }} />
            <input name="sort_order" type="number" placeholder="排序 (数字越小越靠前)" style={inputStyle} />
            <button type="submit" style={{ width: '100%', padding: '12px', background: 'var(--cyan)', color: '#05070d', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', border: 'none' }}>确认发布</button>
          </form>
        </div>

        {/* 右侧列表 */}
        <div className="ui-card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>已发布列表 ({filteredItems.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '600px', overflowY: 'auto' }}>
            {filteredItems.map(item => (
              <div key={item.id} style={{ padding: '16px', background: 'var(--bg-void)', border: '1px solid var(--border-subtle)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontWeight: 'bold' }}>{item.title}</h4>
                  {item.subtitle && <span style={{ fontSize: '12px', color: 'var(--cyan)' }}>{item.subtitle}</span>}
                </div>
                <form action={deleteEngineeringItemAction}><input type="hidden" name="id" value={item.id} /><button type="submit" style={{ border: '1px solid #ff4444', color: '#ff4444', padding: '6px 12px', borderRadius: '6px', background: 'transparent', cursor: 'pointer' }}>删除</button></form>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}