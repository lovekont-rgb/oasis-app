'use client'

export default function PromptForm({ initialData, action }: { initialData?: any, action: (formData: FormData) => void }) {
  return (
    <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={{ fontSize: '14px', display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>标题 (必填)</label>
          <input name="title" defaultValue={initialData?.title} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white' }} />
        </div>
        <div>
          <label style={{ fontSize: '14px', display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>适用模型 (必填)</label>
          <input name="model" defaultValue={initialData?.model} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={{ fontSize: '14px', display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>分类 (必填)</label>
          <select name="category" defaultValue={initialData?.category || 'image'} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white' }}>
            <option value="image">AI 画图</option>
            <option value="writing">文案生成</option>
            <option value="agent">代码开发</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '14px', display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>标签 (逗号隔开)</label>
          <input name="tags" defaultValue={initialData?.tags?.join(', ')} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white' }} />
        </div>
      </div>

      <div>
        <label style={{ fontSize: '14px', display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>效果图链接 (选填)</label>
        <input name="image_url" defaultValue={initialData?.image_url} placeholder="https://..." style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white' }} />
      </div>

      <div>
        <label style={{ fontSize: '14px', display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>提示词内容 (必填)</label>
        <textarea name="content" defaultValue={initialData?.content} required rows={10} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white', resize: 'vertical', lineHeight: 1.6 }}></textarea>
      </div>

      <button type="submit" style={{ padding: '14px', background: 'var(--cyan)', color: '#05070d', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', border: 'none', marginTop: '10px' }}>保存并发布</button>
    </form>
  )
}