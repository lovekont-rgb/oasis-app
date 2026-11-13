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

    const { data } = await supabase.from('community_questions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      
    setQuestions(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这条提问吗？')) return
    const res = await deleteMyQuestion(id)
    if (res.success) {
      setQuestions(questions.filter(q => q.id !== id)) // 前端即时剔除
    } else {
      alert('删除失败: ' + res.error)
    }
  }

  return (
    <div>
      <h1 className="ui-title" style={{ fontSize: '2rem', marginBottom: '32px' }}>我的问答</h1>
      
      {loading ? (
        <p style={{ color: 'var(--text-dim)' }}>正在加载...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {questions.map(item => (
            <div key={item.id} className="ui-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{item.title}</h3>
                
                {/* 👇 新增的删除按钮 */}
                <button onClick={() => handleDelete(item.id)} style={{ background: 'rgba(255,68,68,0.1)', color: '#ff4444', border: '1px solid rgba(255,68,68,0.3)', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', cursor: 'pointer', transition: '0.3s' }}>
                  删除
                </button>
              </div>
              
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
          {questions.length === 0 && <p style={{ color: 'var(--text-dim)' }}>你还没有发起过提问。</p>}
        </div>
      )}
    </div>
  )
}