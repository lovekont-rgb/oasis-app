import { createClient } from '@/lib/supabase/server'
import { addCategory, deleteCategory } from './actions'

export const instant = false

export default async function CategoriesPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('prompt_categories').select('*').order('sort_order')

  const roots = categories?.filter(c => !c.parent_id) || []

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>分类目录管理</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>在这里管理提示词库的树状分类结构。</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
        
        {/* 新增分类表单 */}
        <div className="ui-card" style={{ height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--cyan)' }}>添加新分类</h3>
          <form action={async (formData) => {
            'use server'
            await addCategory(formData)
          }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input name="name" required placeholder="分类名称 (如: 人像摄影)" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white' }} />
            
            <select name="parent_id" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white' }}>
              <option value="">作为一级目录 (顶级分类)</option>
              {roots.map(root => (
                <option key={root.id} value={root.id}>作为 [{root.name}] 的二级目录</option>
              ))}
            </select>
            
            <button type="submit" style={{ padding: '12px', background: 'var(--cyan)', color: '#05070d', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', border: 'none' }}>确认添加</button>
          </form>
        </div>

        {/* 分类列表展示 */}
        <div className="ui-card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>现有目录结构</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {roots.map(root => {
              const children = categories?.filter(c => c.parent_id === root.id) || []
              return (
                <div key={root.id} style={{ borderLeft: '3px solid var(--cyan)', paddingLeft: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h4 style={{ fontWeight: 'bold', fontSize: '16px' }}>{root.name}</h4>
                    <form action={async () => { 'use server'; await deleteCategory(root.id) }}>
                      <button type="submit" style={{ background: 'transparent', border: '1px solid #ff4444', color: '#ff4444', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>删除大类</button>
                    </form>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: '16px' }}>
                    {children.map(child => (
                      <div key={child.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '6px' }}>
                        <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{child.name}</span>
                        <form action={async () => { 'use server'; await deleteCategory(child.id) }}>
                          <button type="submit" style={{ background: 'transparent', border: '1px solid #ff4444', color: '#ff4444', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>删除</button>
                        </form>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}