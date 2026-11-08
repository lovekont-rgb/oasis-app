export const instant = false
import { createClient } from '@/lib/supabase/server' // 👈 路径已修正
import { addPrompt, deletePrompt, deletePromptAction } from './actions'

export default async function PromptsAdminPage() {
  const supabase = await createClient()
  // 获取所有提示词
  const { data: prompts } = await supabase.from('prompts').select('*').order('id', { ascending: false })

  return (
    <div>
      <div className="ui-badge"><span className="ui-badge-dot"></span>ADMIN PANEL</div>
      <h1 className="ui-title" style={{ fontSize: '2rem' }}>提示词管理</h1>
      <p className="ui-subtitle" style={{ marginBottom: '40px' }}>在这里添加、查看或删除系统内的提示词模板。</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
        
        {/* 左侧：新增表单 */}
        <div className="ui-card" style={{ height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--cyan)' }}>新增提示词</h3>
          <form action={addPrompt} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>标题</label>
              <input name="title" required placeholder="例如：结构化写作" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white' }} />
            </div>
            <div>
              <label style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>分类 (英文)</label>
              <input name="category" required placeholder="writing, image, agent..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white' }} />
            </div>
            <div>
              <label style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>适用模型</label>
              <input name="model" required placeholder="ChatGPT / Claude" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white' }} />
            </div>
            <div>
              <label style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>提示词内容</label>
              <textarea name="content" required rows={6} placeholder="输入具体的提示词..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white', resize: 'vertical' }}></textarea>
            </div>
            <button type="submit" style={{ padding: '12px', background: 'var(--cyan)', color: '#05070d', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', border: 'none', marginTop: '8px' }}>
              确认发布
            </button>
          </form>
        </div>

        {/* 右侧：数据列表 */}
        <div className="ui-card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>已发布列表 ({prompts?.length || 0})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {prompts?.map(prompt => (
              <div key={prompt.id} style={{ padding: '16px', background: 'var(--bg-void)', border: '1px solid var(--border-subtle)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontWeight: 'bold' }}>{prompt.title}</h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{prompt.model} · {prompt.category}</span>
                </div>
                {/* 删除按钮 */}
                <form action={deletePromptAction}>
                  <input type="hidden" name="id" value={prompt.id} />
                  <button type="submit" style={{ background: 'transparent', border: '1px solid #ff4444', color: '#ff4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                    删除
                  </button>
                </form>
              </div>
            ))}
            {prompts?.length === 0 && <p style={{ color: 'var(--text-dim)' }}>暂无数据，请在左侧发布。</p>}
          </div>
        </div>

      </div>
    </div>
  )
}