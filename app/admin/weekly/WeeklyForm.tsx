'use client'

export default function WeeklyForm({ initialData, action }: { initialData?: any, action: (formData: FormData) => void }) {
  const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white', marginBottom: '16px' }

  return (
    <form action={action} className="ui-card" style={{ padding: '32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>期数 (如: Vol.05)</label>
          <input name="vol" defaultValue={initialData?.vol} required style={inputStyle} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>排序权重 (越小越靠前)</label>
          <input name="sort_order" type="number" defaultValue={initialData?.sort_order || 0} required style={inputStyle} />
        </div>
      </div>

      <label style={{ display: 'block', marginBottom: '8px' }}>标题</label>
      <input name="title" defaultValue={initialData?.title} required style={inputStyle} />

      <label style={{ display: 'block', marginBottom: '8px' }}>简短介绍 (用于前台卡片)</label>
      <textarea name="description" defaultValue={initialData?.description} required rows={2} style={{ ...inputStyle, resize: 'vertical' }} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>作者</label>
          <input name="author" defaultValue={initialData?.author || 'OASIS 编辑部'} style={inputStyle} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>阅读时长</label>
          <input name="read_time" defaultValue={initialData?.read_time || '5 分钟'} style={inputStyle} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>封面图链接 (选填)</label>
          <input name="cover_url" defaultValue={initialData?.cover_url} style={inputStyle} />
        </div>
      </div>

      <label style={{ display: 'block', marginBottom: '8px' }}>正文内容 (支持多段落换行)</label>
      <textarea name="content" defaultValue={initialData?.content} required rows={15} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />

      <button type="submit" style={{ padding: '14px 40px', background: 'var(--cyan)', color: '#05070d', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '16px' }}>
        保存并发布
      </button>
    </form>
  )
}