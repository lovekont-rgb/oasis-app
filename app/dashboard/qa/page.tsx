import { createClient } from '@/lib/supabase/server'

export const instant = false

export default async function MyQaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: questions } = await supabase.from('community_questions')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="ui-title" style={{ fontSize: '2rem', marginBottom: '32px' }}>我的问答</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {questions?.map(item => (
          <div key={item.id} className="ui-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '12px' }}>{item.title}</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>{item.content}</p>
            {item.admin_reply ? (
              <div style={{ background: 'rgba(0,212,255,0.05)', padding: '16px', borderRadius: '8px', borderLeft: '3px solid var(--cyan)' }}>
                <span style={{ fontSize: '12px', color: 'var(--cyan)', display: 'block', marginBottom: '4px' }}>官方回复：</span>
                <p style={{ fontSize: '14px', margin: 0 }}>{item.admin_reply}</p>
              </div>
            ) : (
              <span style={{ fontSize: '12px', color: 'var(--warn)', border: '1px solid var(--warn)', padding: '4px 12px', borderRadius: '100px' }}>等待解答</span>
            )}
          </div>
        ))}
        {(!questions || questions.length === 0) && <p style={{ color: 'var(--text-dim)' }}>你还没有发起过提问。</p>}
      </div>
    </div>
  )
}