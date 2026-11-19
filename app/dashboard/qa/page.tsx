'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { deleteMyQuestion } from './actions'

/** 作者视角的状态：待审核 / 已发布 / 已驳回 */
function statusMeta(status: string | null | undefined) {
  if (status === 'approved') return { label: '已发布', color: 'var(--green)' }
  if (status === 'rejected') return { label: '已驳回', color: '#ff4444' }
  if (status === 'replied') return { label: '审核通过中', color: 'var(--warn)' }
  return { label: '审核中', color: 'var(--warn)' }
}

/** 我的提问的数据结构（只列页面用到的字段） */
type MyQuestion = {
  id: number
  title: string
  content: string
  status?: string | null
  admin_reply?: string | null
  reject_reason?: string | null
  created_at?: string | null
}

export default function MyQaPage() {
  const supabase = createClient()
  const [questions, setQuestions] = useState<MyQuestion[]>([])
  const [loading, setLoading] = useState(true)

  const fetchQuestions = async () => {
    setLoading(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      return
    }

    const { data } = await supabase
      .from('community_questions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    setQuestions((data || []) as MyQuestion[])
    setLoading(false)
  }

  useEffect(() => {
    fetchQuestions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这条提问吗？')) return
    const res = await deleteMyQuestion(id)
    if (res.success) {
      setQuestions(questions.filter((q) => q.id !== id)) // 前端即时剔除
    } else {
      alert('删除失败: ' + res.error)
    }
  }

  return (
    <div>
      <h1 className="ui-title" style={{ fontSize: '2rem', marginBottom: '8px' }}>
        我的问答
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '32px' }}>
        提问提交后需要管理员审核，通过后才会出现在问答广场。
      </p>

      {loading ? (
        <p style={{ color: 'var(--text-dim)' }}>正在加载...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {questions.map((item) => {
            const meta = statusMeta(item.status)

            return (
              <div key={item.id} className="ui-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>
                      {item.title}
                    </h3>
                    {/* 状态胶囊：让作者知道现在处于哪一步 */}
                    <span
                      style={{
                        fontSize: '11px',
                        color: meta.color,
                        border: `1px solid ${meta.color}`,
                        padding: '2px 8px',
                        borderRadius: '100px',
                        flexShrink: 0,
                      }}
                    >
                      {meta.label}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{ background: 'rgba(255,68,68,0.1)', color: '#ff4444', border: '1px solid rgba(255,68,68,0.3)', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', cursor: 'pointer', transition: '0.3s', flexShrink: 0 }}
                  >
                    删除
                  </button>
                </div>

                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px', whiteSpace: 'pre-wrap' }}>
                  {item.content}
                </p>

                {/* 被驳回：把理由明确告诉作者 */}
                {item.status === 'rejected' && (
                  <div
                    style={{
                      background: 'rgba(255,68,68,0.08)',
                      padding: '14px 16px',
                      borderRadius: '8px',
                      borderLeft: '3px solid #ff4444',
                      marginBottom: '16px',
                    }}
                  >
                    <span style={{ fontSize: '12px', color: '#ff4444', display: 'block', marginBottom: '4px' }}>
                      驳回理由：
                    </span>
                    <p style={{ fontSize: '14px', margin: 0, color: 'var(--text-secondary)' }}>
                      {item.reject_reason || '未填写理由，可联系管理员了解详情。'}
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--text-dim)', margin: '8px 0 0 0' }}>
                      修改后可重新提交，会再次进入审核队列。
                    </p>
                  </div>
                )}

                {/* 审核中提示 */}
                {(item.status === 'pending' || item.status === 'replied') && (
                  <p style={{ fontSize: '12px', color: 'var(--warn)', marginBottom: '12px' }}>
                    内容正在审核，通过后会自动发布。
                  </p>
                )}

                {item.admin_reply ? (
                  <div style={{ background: 'rgba(0,212,255,0.05)', padding: '16px', borderRadius: '8px', borderLeft: '3px solid var(--cyan)' }}>
                    <span style={{ fontSize: '12px', color: 'var(--cyan)', display: 'block', marginBottom: '4px' }}>
                      官方回复：
                    </span>
                    <p style={{ fontSize: '14px', margin: 0, whiteSpace: 'pre-wrap' }}>{item.admin_reply}</p>
                  </div>
                ) : (
                  item.status !== 'rejected' && (
                    <span style={{ fontSize: '12px', color: 'var(--warn)', border: '1px solid var(--warn)', padding: '4px 12px', borderRadius: '100px' }}>
                      等待解答
                    </span>
                  )
                )}
              </div>
            )
          })}
          {questions.length === 0 && <p style={{ color: 'var(--text-dim)' }}>你还没有发起过提问。</p>}
        </div>
      )}
    </div>
  )
}
