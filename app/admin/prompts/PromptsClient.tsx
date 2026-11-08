'use client'

import { useRef } from 'react'
import { createPrompt, deletePromptAction } from './actions'

export default function PromptsClient({ initialPrompts }: { initialPrompts: any[] }) {
  const formRef = useRef<HTMLFormElement>(null)

  // 处理新增表单提交
  const handleSubmit = async (formData: FormData) => {
    await createPrompt(formData)
    formRef.current?.reset() // 提交成功后清空表单
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
      
      {/* 左侧：新增表单 */}
      <div className="ui-card" style={{ height: 'fit-content' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--cyan)' }}>发布新提示词</h3>
        <form ref={formRef} action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', display: 'block', marginBottom: '6px', color: 'var(--text-secondary)' }}>标题</label>
            <input name="title" required placeholder="例如：结构化写作模板" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white' }} />
          </div>
          <div>
            <label style={{ fontSize: '13px', display: 'block', marginBottom: '6px', color: 'var(--text-secondary)' }}>分类 (英文)</label>
            <input name="category" required placeholder="writing, image, agent..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white' }} />
          </div>
          <div>
            <label style={{ fontSize: '13px', display: 'block', marginBottom: '6px', color: 'var(--text-secondary)' }}>适用模型</label>
            <input name="model" required placeholder="ChatGPT / Claude" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white' }} />
          </div>
          <div>
            <label style={{ fontSize: '13px', display: 'block', marginBottom: '6px', color: 'var(--text-secondary)' }}>提示词内容</label>
            <textarea name="content" required rows={8} placeholder="在这里输入详细的提示词..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white', resize: 'vertical' }}></textarea>
          </div>
          <button type="submit" style={{ padding: '12px', background: 'var(--cyan)', color: '#05070d', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', border: 'none', marginTop: '8px' }}>
            确认发布
          </button>
        </form>
      </div>

      {/* 右侧：数据列表 */}
      <div className="ui-card">
        <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>已发布列表 ({initialPrompts.length})</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {initialPrompts.map((prompt) => (
            <div key={prompt.id} style={{ padding: '16px', background: 'var(--bg-void)', border: '1px solid var(--border-subtle)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '4px' }}>{prompt.title}</h4>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{prompt.model} · {prompt.category}</span>
              </div>
              
              {/* 删除按钮 */}
              <form action={deletePromptAction}>
                <input type="hidden" name="id" value={prompt.id} />
                <button type="submit" style={{ background: 'transparent', border: '1px solid #ff4444', color: '#ff4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', transition: '0.2s' }}>
                  删除
                </button>
              </form>
            </div>
          ))}
          {initialPrompts.length === 0 && <p style={{ color: 'var(--text-dim)' }}>暂无数据，请在左侧发布。</p>}
        </div>
      </div>

    </div>
  )
}