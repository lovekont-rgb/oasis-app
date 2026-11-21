'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { replyQuestion, deleteQuestionAction } from './actions'
import { approveQuestion, rejectQuestion } from '../review/actions'

/** 状态 → 中文 + 颜色（兼容历史数据里的 replied） */
function statusMeta(status: string | null | undefined) {
  if (status === 'approved') return { label: '已发布', color: 'var(--green)' }
  if (status === 'rejected') return { label: '已驳回', color: '#ff4444' }
  if (status === 'replied') return { label: '已回复·待发布', color: 'var(--warn)' }
  return { label: '待审核', color: 'var(--warn)' }
}

const QUICK_REASONS = ['问题描述不清晰', '与本站主题无关', '内容涉嫌违规', '重复提问']

/** 提问的数据结构（只列页面用到的字段） */
type AdminQuestion = {
  id: number
  title: string
  content: string
  user_name?: string | null
  ip_location?: string | null
  status?: string | null
  admin_reply?: string | null
  reject_reason?: string | null
  created_at?: string | null
}

export default function QaAdminClient({ questions }: { questions: AdminQuestion[] }) {
  const router = useRouter()

  const [replyingId, setReplyingId] = useState<number | null>(null)
  const [replyDrafts, setReplyDrafts] = useState<Record<number, string>>({})
  const [rejectingId, setRejectingId] = useState<number | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [busyId, setBusyId] = useState<number | null>(null)
  const [errors, setErrors] = useState<Record<number, string>>({})

  const setError = (id: number, message: string) => setErrors((prev) => ({ ...prev, [id]: message }))
  const clearError = (id: number) =>
    setErrors((prev) => {
      if (!prev[id]) return prev
      const next = { ...prev }
      delete next[id]
      return next
    })

  /* ---------- 只保存回复（不改变审核状态） ---------- */
  const handleSaveReply = async (id: number) => {
    const text = (replyDrafts[id] || '').trim()
    clearError(id)
    if (!text) {
      setError(id, '回复内容不能为空')
      return
    }

    setBusyId(id)
    const res = await replyQuestion(id, text)
    setBusyId(null)

    if (!res.success) {
      setError(id, res.error)
      return
    }
    setReplyingId(null)
    router.refresh()
  }

  /* ---------- 通过并发布（可带上回复） ---------- */
  const handleApprove = async (q: AdminQuestion) => {
    // 如果正在编辑回复，就把它一起保存
    const reply = replyingId === q.id ? (replyDrafts[q.id] || '').trim() : ''
    clearError(q.id)
    setBusyId(q.id)

    const res = await approveQuestion(q.id, reply)
    setBusyId(null)

    if (!res.success) {
      setError(q.id, res.error)
      return
    }
    setReplyingId(null)
    router.refresh()
  }

  /* ---------- 驳回 ---------- */
  const handleReject = async (id: number) => {
    const reason = rejectReason.trim()
    clearError(id)
    if (reason.length < 2) {
      setError(id, '驳回理由至少写 2 个字')
      return
    }

    setBusyId(id)
    const res = await rejectQuestion(id, reason)
    setBusyId(null)

    if (!res.success) {
      setError(id, res.error)
      return
    }
    setRejectingId(null)
    setRejectReason('')
    router.refresh()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {questions.map((q) => {
        const meta = statusMeta(q.status)
        const isPending = q.status === 'pending' || q.status === 'replied'
        const isBusy = busyId === q.id

        return (
          <div key={q.id} className="ui-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', gap: '12px', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>{q.title}</h3>
              <span
                style={{
                  fontSize: '12px',
                  padding: '2px 10px',
                  borderRadius: '100px',
                  color: meta.color,
                  border: `1px solid ${meta.color}`,
                  flexShrink: 0,
                  height: 'fit-content',
                }}
              >
                {meta.label}
              </span>
            </div>

            <div style={{ fontSize: '13px', color: 'var(--text-dim)', marginBottom: '16px' }}>
              用户：{q.user_name || '匿名'} | 地市：{q.ip_location || '未知'} | 时间：
              {q.created_at ? new Date(q.created_at).toLocaleString('zh-CN', { hour12: false }) : '—'}
            </div>

            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px', background: 'var(--bg-void)', padding: '16px', borderRadius: '8px', whiteSpace: 'pre-wrap' }}>
              {q.content}
            </p>

            {q.admin_reply && (
              <div style={{ background: 'rgba(0,212,255,0.05)', padding: '16px', borderRadius: '8px', marginBottom: '16px', borderLeft: '2px solid var(--cyan)' }}>
                <span style={{ fontSize: '12px', color: 'var(--cyan)', display: 'block', marginBottom: '4px' }}>官方回复：</span>
                <p style={{ margin: 0, fontSize: '14px', whiteSpace: 'pre-wrap' }}>{q.admin_reply}</p>
              </div>
            )}

            {q.status === 'rejected' && q.reject_reason && (
              <div style={{ background: 'rgba(255,68,68,0.08)', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', borderLeft: '2px solid #ff4444' }}>
                <span style={{ fontSize: '12px', color: '#ff4444', display: 'block', marginBottom: '4px' }}>驳回理由：</span>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>{q.reject_reason}</p>
              </div>
            )}

            {errors[q.id] && (
              <p style={{ fontSize: '13px', color: '#ff4444', marginBottom: '12px' }}>{errors[q.id]}</p>
            )}

            {/* ---------- 操作按钮 ---------- */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              {isPending && (
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => handleApprove(q)}
                  style={{ padding: '6px 16px', background: 'rgba(60,220,140,0.1)', color: 'var(--green)', border: '1px solid var(--green)', borderRadius: '6px', cursor: isBusy ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '13px', opacity: isBusy ? 0.6 : 1 }}
                >
                  {isBusy ? '处理中…' : '通过并发布'}
                </button>
              )}

              {isPending && (
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => {
                    setRejectingId(rejectingId === q.id ? null : q.id)
                    setRejectReason('')
                    clearError(q.id)
                  }}
                  style={{ padding: '6px 16px', background: 'rgba(255,68,68,0.1)', color: '#ff4444', border: '1px solid #ff4444', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                >
                  驳回
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  const willOpen = replyingId !== q.id
                  setReplyingId(willOpen ? q.id : null)
                  if (willOpen && !replyDrafts[q.id]) {
                    setReplyDrafts((prev) => ({ ...prev, [q.id]: q.admin_reply || '' }))
                  }
                }}
                style={{ padding: '6px 16px', background: 'rgba(0,212,255,0.1)', color: 'var(--cyan)', border: '1px solid var(--cyan)', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
              >
                {q.admin_reply ? '修改回复' : '仅写回复'}
              </button>

              <form action={deleteQuestionAction}>
                <input type="hidden" name="id" value={q.id} />
                <button type="submit" style={{ padding: '6px 16px', background: 'transparent', color: '#ff4444', border: '1px solid #ff4444', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                  删除
                </button>
              </form>
            </div>

            {/* ---------- 回复编辑区 ---------- */}
            {replyingId === q.id && (
              <div style={{ marginTop: '16px' }}>
                <textarea
                  value={replyDrafts[q.id] || ''}
                  onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [q.id]: e.target.value }))}
                  rows={3}
                  maxLength={1000}
                  placeholder="输入官方回复。点「保存回复」只保存不发布；点「通过并发布」会一起发布。"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'var(--text-primary)', fontSize: '13px', resize: 'vertical' }}
                />
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleSaveReply(q.id)}
                    style={{ padding: '7px 18px', background: 'var(--cyan)', color: '#05070d', borderRadius: '6px', fontWeight: 'bold', border: 'none', cursor: isBusy ? 'not-allowed' : 'pointer', fontSize: '13px' }}
                  >
                    {isBusy ? '保存中…' : '保存回复'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setReplyingId(null)}
                    style={{ padding: '7px 18px', background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                  >
                    取消
                  </button>
                </div>
              </div>
            )}

            {/* ---------- 驳回理由编辑区 ---------- */}
            {rejectingId === q.id && (
              <div style={{ marginTop: '16px', padding: '16px', borderRadius: '8px', border: '1px dashed #ff4444', background: 'rgba(255,68,68,0.06)' }}>
                <div style={{ fontSize: '13px', color: '#ff4444', fontWeight: 'bold', marginBottom: '8px' }}>
                  填写驳回理由（用户会在「我的问答」里看到）
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                  {QUICK_REASONS.map((reason) => (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => setRejectReason(reason)}
                      style={{ padding: '4px 10px', fontSize: '12px', borderRadius: '100px', cursor: 'pointer', background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={2}
                  maxLength={100}
                  placeholder="例如：问题描述太笼统，请补充具体场景和报错信息"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'var(--text-primary)', fontSize: '13px', resize: 'vertical' }}
                />
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleReject(q.id)}
                    style={{ padding: '7px 18px', background: '#ff4444', color: '#fff', borderRadius: '6px', fontWeight: 'bold', border: 'none', cursor: isBusy ? 'not-allowed' : 'pointer', fontSize: '13px' }}
                  >
                    {isBusy ? '提交中…' : '确认驳回'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRejectingId(null)
                      setRejectReason('')
                    }}
                    style={{ padding: '7px 18px', background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                  >
                    取消
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      })}

      {questions.length === 0 && (
        <div className="ui-card" style={{ padding: '60px 20px', textAlign: 'center', borderStyle: 'dashed' }}>
          <p style={{ color: 'var(--text-secondary)' }}>还没有用户提问。</p>
        </div>
      )}
    </div>
  )
}
