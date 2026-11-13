import { createClient } from '@/lib/supabase/server'

export const instant = false

export default async function MyLearningPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: progress } = await supabase.from('learning_progress')
    .select('*, courses(title)')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="ui-title" style={{ fontSize: '2rem', marginBottom: '32px' }}>我的学习</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {progress?.map(item => (
          <div key={item.id} className="ui-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>{item.courses?.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>已学完：{item.lesson_title}</p>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--green)', border: '1px solid var(--green)', padding: '4px 12px', borderRadius: '100px' }}>✓ 已完成</span>
          </div>
        ))}
        {(!progress || progress.length === 0) && <p style={{ color: 'var(--text-dim)' }}>你还没有学习记录，去课程模块开始学习吧！</p>}
      </div>
    </div>
  )
}