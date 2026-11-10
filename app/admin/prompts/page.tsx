import { createClient } from '@/lib/supabase/server'
import { deletePromptAction } from './actions'
import Link from 'next/link'

export const instant = false

export default async function AdminPromptsPage() {
  const supabase = await createClient()
  const { data: prompts } = await supabase.from('prompts').select('*').order('id', { ascending: false })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>提示词管理</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>共 {prompts?.length || 0} 条提示词。</p>
        </div>
        <Link href="/admin/prompts/new" style={{ padding: '10px 24px', background: 'var(--cyan)', color: '#05070d', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }}>+ 发布新提示词</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {prompts?.map(prompt => (
          <div key={prompt.id} className="ui-card" style={{ display: 'flex', flexDirection: 'column' }}>
            {prompt.image_url && (
              <div style={{ height: '120px', overflow: 'hidden', borderRadius: '8px', marginBottom: '16px' }}>
                <img src={prompt.image_url} alt={prompt.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>{prompt.title}</h3>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', background: 'rgba(0,212,255,0.1)', color: 'var(--cyan)', padding: '2px 8px', borderRadius: '4px' }}>{prompt.category}</span>
              <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', padding: '2px 8px', borderRadius: '4px' }}>{prompt.model}</span>
            </div>
            <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
              <Link href={`/admin/prompts/${prompt.id}`} style={{ flex: 1, textAlign: 'center', padding: '8px', background: 'transparent', border: '1px solid var(--cyan)', color: 'var(--cyan)', borderRadius: '6px', textDecoration: 'none', fontSize: '13px' }}>编辑</Link>
              <form action={deletePromptAction} style={{ flex: 1 }}>
                <input type="hidden" name="id" value={prompt.id} />
                <button type="submit" style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px solid #ff4444', color: '#ff4444', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>删除</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}