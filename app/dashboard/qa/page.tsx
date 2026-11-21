'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { deleteMyQuestion } from './actions'

export default function MyQaPage() {
  const supabase = createClient()
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchQuestions = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('community_questions').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    setQuestions(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchQuestions() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这条提问吗？')) return
    const res = await deleteMyQuestion(id)
    if (res.success) setQuestions(questions.filter(q => q.id !== id))
  }

  return (
    <div>
      <h1 className="ui-title" style={{ fontSize: '2rem', marginBottom: '32px' }}>我的问答</h1>
      {loading ? <p style={{ color: 'var(--text-dim)' }}>正在加载...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {questions.map(item => (
            <div key={item.id} className="ui-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>{item.title}</h3>
                  <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', border: '1px solid', flexShrink: 0, color: item.status === 'approved' ? 'var(--green)' : item.status === 'rejected' ? '#ff4444' : 'var(--warn)', borderColor: item.status === 'approved' ? 'var(--green)' : item.status === 'rejected' ? '#ff4444' : 'var(--warn)' }}>
                    {item.status === 'approved' ? '已发布' : item.status === 'rejected' ? '已驳回' : '审核中'}
                  </span>
                </div>
                <button onClick={() => handleDelete(item.id)} style={{ background: 'rgba(255,68,68,0.1)', color: '#ff4444', border: '1px solid rgba(255,68,68,0.3)', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', cursor: 'pointer' }}>删除</button>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>{item.content}</p>
              
              {item.status === 'rejected' && item.reject_reason && (
                <p style={{ fontSize: '13px', color: '#ff4444', marginBottom: '16px', padding: '12px', background: 'rgba(255,68,68,0.05)', borderRadius: '8px', borderLeft: '3px solid #ff4444' }}>
                  <strong>驳回理由：</strong>{item.reject_reason}
                </p>
              )}

              {item.admin_reply && (
                <div style={{ background: 'rgba(0,212,255,0.05)', padding: '16px', borderRadius: '8px', borderLeft: '3px solid var(--cyan)' }}>
                  <span style={{ fontSize: '12px', color: 'var(--cyan)', display: 'block', marginBottom: '4px' }}>官方回复：</span>
                  <p style={{ fontSize: '14px', margin: 0 }}>{item.admin_reply}</p>
                </div>
              )}
            </div>
          ))}
          {questions.length === 0 && <p style={{ color: 'var(--text-dim)' }}>暂无提问。</p>}
        </div>
      )}
    </div>
  )
}