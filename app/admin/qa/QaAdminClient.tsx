'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { approveQuestion, rejectQuestion } from '../review/actions'
import { replyQuestion, deleteQuestionAction } from './actions'

export default function QaAdminClient({ questions }: { questions: any[] }) {
  const router = useRouter()
  const [replyingId, setReplyingId] = useState<number | null>(null)
  const [replyText, setReplyText] = useState('')
  const [rejectReason, setRejectReason] = useState('')

  const handleReply = async (id: number) => {
    if (!replyText.trim()) return alert('回复内容不能为空')
    const res = await replyQuestion(id, replyText)
    if (res.success) {
      alert('回复成功！')
      setReplyingId(null)
      setReplyText('')
      router.refresh()
    } else alert('失败: ' + res.error)
  }

  const handleApprove = async (id: number) => {
    const res = await approveQuestion(id)
    if (res.success) router.refresh()
    else alert(res.error)
  }

  const handleReject = async (id: number) => {
    if (!rejectReason.trim()) return alert('请填写驳回理由！')
    const res = await rejectQuestion(id, rejectReason)
    if (res.success) { setRejectReason(''); router.refresh() }
    else alert(res.error)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {questions.map((q) => (
        <div key={q.id} className="ui-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>{q.title}</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              {q.status === 'pending' && <span style={{ fontSize: '12px', color: 'var(--warn)', border: '1px solid var(--warn)', padding: '2px 8px', borderRadius: '100px' }}>待审核</span>}
              {q.status === 'approved' && <span style={{ fontSize: '12px', color: 'var(--green)', border: '1px solid var(--green)', padding: '2px 8px', borderRadius: '100px' }}>已发布</span>}
              {q.status === 'rejected' && <span style={{ fontSize: '12px', color: '#ff4444', border: '1px solid #ff4444', padding: '2px 8px', borderRadius: '100px' }}>已驳回</span>}
            </div>
          </div>
          
          <div style={{ fontSize: '13px', color: 'var(--text-dim)', marginBottom: '16px' }}>
            用户：{q.user_name} | 地市：{q.ip_location} | 时间：{new Date(q.created_at).toLocaleString()}
          </div>
          
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px', background: 'var(--bg-void)', padding: '16px', borderRadius: '8px' }}>{q.content}</p>
          
          {q.reject_reason && (
            <p style={{ fontSize: '13px', color: '#ff4444', marginBottom: '16px', padding: '12px', background: 'rgba(255,68,68,0.05)', borderRadius: '8px' }}>驳回理由：{q.reject_reason}</p>
          )}

          {q.admin_reply && (
            <div style={{ background: 'rgba(0,212,255,0.05)', padding: '16px', borderRadius: '8px', marginBottom: '16px', borderLeft: '2px solid var(--cyan)' }}>
              <span style={{ fontSize: '12px', color: 'var(--cyan)', display: 'block', marginBottom: '4px' }}>官方回复：</span>
              <p style={{ margin: 0, fontSize: '14px' }}>{q.admin_reply}</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            {q.status === 'pending' && (
              <>
                <button onClick={() => handleApprove(q.id)} style={{ padding: '6px 16px', background: 'var(--green)', color: '#05070d', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>通过发布</button>
                <div style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '200px' }}>
                  <input value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="驳回理由..." style={{ flex: 1, padding: '6px 12px', borderRadius: '6px', border: '1px solid #ff4444', background: 'rgba(255,68,68,0.05)', color: 'white' }} />
                  <button onClick={() => handleReject(q.id)} style={{ padding: '6px 16px', background: 'transparent', color: '#ff4444', border: '1px solid #ff4444', borderRadius: '6px', cursor: 'pointer' }}>驳回</button>
                </div>
              </>
            )}
            
            <button onClick={() => setReplyingId(replyingId === q.id ? null : q.id)} style={{ padding: '6px 16px', background: 'rgba(0,212,255,0.1)', color: 'var(--cyan)', border: '1px solid var(--cyan)', borderRadius: '6px', cursor: 'pointer' }}>
              {q.admin_reply ? '修改回复' : '官方回复'}
            </button>
            
            <form action={deleteQuestionAction}>
              <input type="hidden" name="id" value={q.id} />
              <button type="submit" style={{ padding: '6px 16px', background: 'transparent', color: '#ff4444', border: '1px solid #ff4444', borderRadius: '6px', cursor: 'pointer' }}>删除</button>
            </form>
          </div>

          {replyingId === q.id && (
            <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
              <input value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="输入回复内容..." style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white' }} />
              <button onClick={() => handleReply(q.id)} style={{ padding: '0 24px', background: 'var(--cyan)', color: '#05070d', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>发送</button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}