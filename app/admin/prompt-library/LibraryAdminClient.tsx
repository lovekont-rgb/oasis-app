'use client'
import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createLibraryPrompt, deleteLibraryPromptAction } from './actions'

export default function LibraryAdminClient({ initialPrompts }: { initialPrompts: any[] }) {
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    const res = await createLibraryPrompt(formData)
    if (res.success) {
      alert('发布成功！')
      formRef.current?.reset()
      router.refresh()
    } else {
      alert('失败: ' + res.error)
    }
  }

  const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white', marginBottom: '12px' }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
      <div className="ui-card" style={{ height: 'fit-content' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--cyan)' }}>上架新提示词</h3>
        <form ref={formRef} action={handleSubmit}>
          <input name="title" placeholder="标题" required style={inputStyle} />
          <input name="category" placeholder="分类 (image / writing / agent)" required style={inputStyle} />
          <input name="model" placeholder="适用模型" required style={inputStyle} />
          <input name="image_url" placeholder="效果图链接 (选填)" style={inputStyle} />
          <input name="tags" placeholder="标签 (逗号隔开)" style={inputStyle} />
          <textarea name="content" placeholder="提示词具体内容..." required rows={6} style={{ ...inputStyle, resize: 'vertical' }}></textarea>
          <button type="submit" style={{ width: '100%', padding: '12px', background: 'var(--cyan)', color: '#05070d', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', border: 'none' }}>确认上架</button>
        </form>
      </div>
      <div className="ui-card">
        <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>已上架列表 ({initialPrompts.length})</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {initialPrompts.map(p => (
            <div key={p.id} style={{ padding: '12px', background: 'var(--bg-void)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
              {p.image_url && <img src={p.image_url} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px' }} />}
              <h4 style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>{p.title}</h4>
              <form action={deleteLibraryPromptAction}><input type="hidden" name="id" value={p.id} /><button type="submit" style={{ width: '100%', border: '1px solid #ff4444', color: '#ff4444', padding: '6px', borderRadius: '4px', background: 'transparent', cursor: 'pointer', fontSize: '12px' }}>下架</button></form>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}