// 接收分类数据
export default function LibraryAdminClient({ initialPrompts, categories }: { initialPrompts: any[], categories: any[] }) {
  // ... 前面的代码不变 ...

  const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white', marginBottom: '12px' }
  
  // 只展示二级目录供选择
  const childCategories = categories.filter(c => c.parent_id !== null)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
      <div className="ui-card" style={{ height: 'fit-content' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--cyan)' }}>上架新提示词</h3>
        <form ref={formRef} action={handleSubmit}>
          <input name="title" placeholder="标题" required style={inputStyle} />
          
          {/* 👇 修改这里：改为下拉选择分类 */}
          <select name="category_id" required style={inputStyle}>
            <option value="">请选择所属分类目录</option>
            {childCategories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

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
              <h4 style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>{p.title}</h4>
              <span style={{ fontSize: '12px', color: 'var(--cyan)' }}>{p.prompt_categories?.name || '未分类'}</span>
              <form action={deleteLibraryPromptAction} style={{ marginTop: '8px' }}><input type="hidden" name="id" value={p.id} /><button type="submit" style={{ width: '100%', border: '1px solid #ff4444', color: '#ff4444', padding: '4px', borderRadius: '4px', background: 'transparent', cursor: 'pointer', fontSize: '12px' }}>下架</button></form>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}