'use client'
import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createPrompt, deletePromptAction } from './actions'

export default function PromptsClient({ initialPrompts }: { initialPrompts: any[] }) {
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    const result = await createPrompt(formData)
    if (result.success) {
      alert('发布成功！')
      formRef.current?.reset()
      router.refresh()
    } else {
      alert('失败: ' + result.error)
    }
  }

  const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white', marginBottom: '12px' }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
      <div className="ui-card" style={{ height: 'fit-content' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--cyan)' }}>发布新基础模板</h3>
        <form ref={formRef} action={handleSubmit}>
          <input name="title" placeholder="模板标题" required style={inputStyle} />
          <input name="category" placeholder="分类 (如 writing, image)" required style={inputStyle} />
          <input name="model" placeholder="适用模型 (如 ChatGPT)" required style={inputStyle} />
          <textarea name="content" placeholder="提示词具体内容..." required rows={8} style={{ ...inputStyle, resize: 'vertical' }}></textarea>
          <button type="submit" style={{ width: '100%', padding: '12px', background: 'var(--cyan)', color: '#05070d', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', border: 'none' }}>确认发布</button>
        </form>
      </div>
      <div className="ui-card">
        <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>基础模板列表 ({initialPrompts.length})</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {initialPrompts.map(p => (
            <div key={p.id} style={{ padding: '16px', background: 'var(--bg-void)', border: '1px solid var(--border-subtle)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontWeight: 'bold' }}>{p.title}</h4>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{p.model} · {p.category}</span>
              </div>
              <form action={deletePromptAction}><input type="hidden" name="id" value={p.id} /><button type="submit" style={{ border: '1px solid #ff4444', color: '#ff4444', padding: '6px 12px', borderRadius: '6px', background: 'transparent', cursor: 'pointer' }}>删除</button></form>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}