'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { approvePortfolio, rejectPortfolio, approveQuestion, rejectQuestion } from './actions'

/* ---------------- 类型定义（页面会把数据按这个结构传进来） ---------------- */

export type ReviewItemType = 'portfolio' | 'question'

export type ReviewItem = {
  id: number
  type: ReviewItemType
  title: string
  author: string
  category: string
  content: string
  fileUrl: string | null
  fileType: string | null
  status: string
  rejectReason: string | null
  adminReply: string | null
  createdAt: string
}

export type ReviewLog = {
  id: number
  target_type: string
  target_id: number
  action: string
  reason: string | null
  operator_email: string | null
  created_at: string
}

type Props = {
  items: ReviewItem[]
  logs: ReviewLog[]
  initialType?: 'all' | ReviewItemType
  focusId?: number | null
}

/* ---------------- 小工具 ---------------- */

const PORTFOLIO_REASONS = ['文件无法打开', '作品与主题不符', '内容涉嫌违规', '说明信息不完整']
const QUESTION_REASONS = ['问题描述不清晰', '与本站主题无关', '内容涉嫌违规', '重复提问']

function statusMeta(status: string) {
  if (status === 'approved') return { label: '已发布', color: 'var(--green)' }
  if (status === 'rejected') return { label: '已驳回', color: '#ff4444' }
  if (status === 'replied') return { label: '已回复·待发布', color: 'var(--warn)' }
  return { label: '待审核', color: 'var(--warn)' }
}

function formatTime(value: string) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('zh-CN', { hour12: false })
}

function actionLabel(action: string) {
  if (action === 'approve') return '通过'
  if (action === 'reject') return '驳回'
  if (action === 'reply') return '回复'
  return action
}

/* ---------------- 主组件 ---------------- */

export default function ReviewClient({ items, logs, initialType = 'all', focusId = null }: Props) {
  const router = useRouter()

  const [typeFilter, setTypeFilter] = useState<'all' | ReviewItemType>(
    focusId ? 'all' : initialType
  )
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>(
    focusId ? 'all' : 'pending'
  )

  // 本地状态：点通过/驳回后先立刻更新界面，再刷新服务端数据
  const [list, setList] = useState<ReviewItem[]>(items)
  const [expanded, setExpanded] = useState<string[]>(focusId ? [] : [])
  const [busyKey, setBusyKey] = useState<string | null>(null)
  const [rejectingKey, setRejectingKey] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const keyOf = (item: ReviewItem) => `${item.type}-${item.id}`

  /* ---------- 顶部计数 ---------- */
  const counts = useMemo(() => {
    const pending = list.filter((i) => i.status === 'pending' || i.status === 'replied').length
    const approved = list.filter((i) => i.status === 'approved').length
    const rejected = list.filter((i) => i.status === 'rejected').length
    return { pending, approved, rejected, total: list.length }
  }, [list])

  /* ---------- 筛选 ---------- */
  const filtered = useMemo(() => {
    return list
      .filter((i) => (typeFilter === 'all' ? true : i.type === typeFilter))
      .filter((i) => {
        if (statusFilter === 'all') return true
        if (statusFilter === 'pending') return i.status === 'pending' || i.status === 'replied'
        return i.status === statusFilter
      })
      .sort((a, b) => {
        // 待审核优先，其次按时间倒序
        const weight = (s: string) => (s === 'pending' ? 0 : s === 'replied' ? 1 : 2)
        if (weight(a.status) !== weight(b.status)) return weight(a.status) - weight(b.status)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
  }, [list, typeFilter, statusFilter])

  const toggleExpand = (key: string) => {
    setExpanded((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
  }

  const setError = (key: string, message: string) => {
    setErrors((prev) => ({ ...prev, [key]: message }))
  }

  const clearError = (key: string) => {
    setErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  /* ---------- 通过 ---------- */
  const handleApprove = async (item: ReviewItem) => {
    const key = keyOf(item)
    clearError(key)
    setBusyKey(key)

    const reply = (replyDrafts[key] || '').trim()
    const res =
      item.type === 'portfolio'
        ? await approvePortfolio(item.id)
        : await approveQuestion(item.id, reply)

    setBusyKey(null)

    if (!res.success) {
      setError(key, res.error)
      return
    }

    setList((prev) =>
      prev.map((i) =>
        i.type === item.type && i.id === item.id
          ? { ...i, status: 'approved', rejectReason: null, adminReply: reply || i.adminReply }
          : i
      )
    )
    setExpanded((prev) => [...new Set([...prev, key])])
    router.refresh()
  }

  /* ---------- 驳回 ---------- */
  const openReject = (key: string) => {
    setRejectingKey(key)
    setRejectReason('')
    clearError(key)
  }

  const confirmReject = async (item: ReviewItem) => {
    const key = keyOf(item)
    const reason = rejectReason.trim()
    if (reason.length < 2) {
      setError(key, '驳回理由至少写 2 个字，作者需要知道原因')
      return
    }

    clearError(key)
    setBusyKey(key)

    const res =
      item.type === 'portfolio' ? await rejectPortfolio(item.id, reason) : await rejectQuestion(item.id, reason)

    setBusyKey(null)

    if (!res.success) {
      setError(key, res.error)
      return
    }

    setList((prev) =>
      prev.map((i) =>
        i.type === item.type && i.id === item.id ? { ...i, status: 'rejected', rejectReason: reason } : i
      )
    )
    setRejectingKey(null)
    setRejectReason('')
    router.refresh()
  }

  return (
    <div>
      {/* ============ 标题区 ============ */}
      <div style={{ marginBottom: '24px' }}>
        <div className="ui-badge" style={{ marginBottom: '12px' }}>
          <span className="ui-badge-dot"></span>CONTENT REVIEW
        </div>
        <h1 className="ui-title" style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
          内容安全 <span className="ui-title-gradient">审核中心</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          用户提交的作品与提问会先进入这里。通过后才会出现在前台，驳回时必须填写理由，作者会在个人中心看到。
        </p>
      </div>

      {/* ============ 数据概览 ============ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: '待审核', value: counts.pending, color: 'var(--warn)' },
          { label: '已发布', value: counts.approved, color: 'var(--green)' },
          { label: '已驳回', value: counts.rejected, color: '#ff4444' },
          { label: '内容总数', value: counts.total, color: 'var(--cyan)' },
        ].map((card) => (
          <div key={card.label} className="ui-card" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{card.label}</div>
            <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '28px', fontWeight: 900, color: card.color }}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* ============ 筛选条 ============ */}
      <div
        className="ui-card"
        style={{
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: '全部类型' },
            { key: 'portfolio', label: '作品' },
            { key: 'question', label: '提问' },
          ].map((tab) => {
            const active = typeFilter === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setTypeFilter(tab.key as 'all' | ReviewItemType)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '100px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  background: active ? 'rgba(0,212,255,0.12)' : 'transparent',
                  color: active ? 'var(--cyan)' : 'var(--text-secondary)',
                  border: `1px solid ${active ? 'var(--cyan)' : 'var(--border-subtle)'}`,
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { key: 'pending', label: '待审核' },
            { key: 'approved', label: '已发布' },
            { key: 'rejected', label: '已驳回' },
            { key: 'all', label: '全部状态' },
          ].map((tab) => {
            const active = statusFilter === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key as 'pending' | 'approved' | 'rejected' | 'all')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '100px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  background: active ? 'rgba(0,212,255,0.12)' : 'transparent',
                  color: active ? 'var(--cyan)' : 'var(--text-secondary)',
                  border: `1px solid ${active ? 'var(--cyan)' : 'var(--border-subtle)'}`,
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ============ 列表 ============ */}
      {filtered.length === 0 ? (
        <div className="ui-card" style={{ padding: '72px 20px', textAlign: 'center', borderStyle: 'dashed' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛡️</div>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-primary)' }}>
            当前筛选下没有内容
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            换个筛选条件看看，或者等待新的用户投稿。
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map((item) => {
            const key = keyOf(item)
            const meta = statusMeta(item.status)
            const isExpanded = expanded.includes(key) || (focusId !== null && focusId === item.id)
            const isPending = item.status === 'pending' || item.status === 'replied'
            const isBusy = busyKey === key
            const isRejecting = rejectingKey === key
            const itemLogs = logs.filter((l) => l.target_type === item.type && l.target_id === item.id)
            const isFocused = focusId !== null && focusId === item.id

            return (
              <div
                key={key}
                className="ui-card"
                style={{
                  padding: '24px',
                  borderColor: isFocused ? 'var(--cyan)' : undefined,
                  boxShadow: isFocused ? '0 0 24px rgba(0,212,255,0.15)' : undefined,
                }}
              >
                {/* --- 标题行 --- */}
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        color: 'var(--violet)',
                        border: '1px solid var(--violet)',
                      }}
                    >
                      {item.type === 'portfolio' ? '作品' : '提问'}
                    </span>
                    <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>
                      {item.title}
                    </h3>
                  </div>

                  <span
                    style={{
                      fontSize: '12px',
                      padding: '3px 10px',
                      borderRadius: '100px',
                      color: meta.color,
                      border: `1px solid ${meta.color}`,
                      flexShrink: 0,
                    }}
                  >
                    {meta.label}
                  </span>
                </div>

                {/* --- 元信息 --- */}
                <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '10px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <span>作者：{item.author || '匿名'}</span>
                  {item.type === 'portfolio' && <span>分类：{item.category || '未分类'}</span>}
                  <span>提交：{formatTime(item.createdAt)}</span>
                  <span>ID：{item.id}</span>
                </div>

                {/* --- 正文预览 --- */}
                <p
                  style={{
                    marginTop: '14px',
                    fontSize: '14px',
                    lineHeight: 1.75,
                    color: 'var(--text-secondary)',
                    background: 'var(--bg-void)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '14px 16px',
                    whiteSpace: 'pre-wrap',
                    display: '-webkit-box',
                    WebkitLineClamp: isExpanded ? undefined : 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: isExpanded ? 'visible' : 'hidden',
                  }}
                >
                  {item.content || '（作者没有填写说明）'}
                </p>

                {/* --- 作品附件 --- */}
                {item.type === 'portfolio' && item.fileUrl && (
                  <div style={{ marginTop: '12px', fontSize: '13px' }}>
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--cyan)', textDecoration: 'none', borderBottom: '1px dashed var(--cyan)' }}
                    >
                      查看源文件（{item.fileType === 'pdf' ? 'PDF' : '视频'}）↗
                    </a>
                  </div>
                )}

                {/* --- 已有官方回复 --- */}
                {item.type === 'question' && item.adminReply && (
                  <div style={{ marginTop: '14px', padding: '14px 16px', borderRadius: '8px', background: 'rgba(0,212,255,0.06)', borderLeft: '2px solid var(--cyan)' }}>
                    <div style={{ fontSize: '12px', color: 'var(--cyan)', marginBottom: '4px' }}>官方回复</div>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                      {item.adminReply}
                    </p>
                  </div>
                )}

                {/* --- 驳回理由 --- */}
                {item.status === 'rejected' && item.rejectReason && (
                  <div style={{ marginTop: '14px', padding: '12px 16px', borderRadius: '8px', background: 'rgba(255,68,68,0.08)', borderLeft: '2px solid #ff4444' }}>
                    <div style={{ fontSize: '12px', color: '#ff4444', marginBottom: '4px' }}>驳回理由（作者可见）</div>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>{item.rejectReason}</p>
                  </div>
                )}

                {/* --- 处理记录 --- */}
                {(isExpanded || item.status !== 'pending') && (
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '8px' }}>处理记录</div>
                    {itemLogs.length === 0 ? (
                      <p style={{ fontSize: '12px', color: 'var(--text-dim)', margin: 0 }}>
                        暂无处理记录{item.type === 'portfolio' && item.status === 'pending' ? '，等待审核' : ''}
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {itemLogs.map((log) => (
                          <div key={log.id} style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {formatTime(log.created_at)} · {actionLabel(log.action)}
                            {log.reason ? ` · 理由：${log.reason}` : ''}
                            {log.operator_email ? ` · ${log.operator_email}` : ''}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* --- 错误提示 --- */}
                {errors[key] && (
                  <p style={{ marginTop: '12px', marginBottom: 0, fontSize: '13px', color: '#ff4444' }}>
                    {errors[key]}
                  </p>
                )}

                {/* --- 驳回面板 --- */}
                {isRejecting && (
                  <div style={{ marginTop: '16px', padding: '16px', borderRadius: '8px', border: '1px dashed #ff4444', background: 'rgba(255,68,68,0.06)' }}>
                    <div style={{ fontSize: '13px', color: '#ff4444', marginBottom: '8px', fontWeight: 'bold' }}>
                      填写驳回理由（作者会在个人中心看到）
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                      {(item.type === 'portfolio' ? PORTFOLIO_REASONS : QUESTION_REASONS).map((reason) => (
                        <button
                          key={reason}
                          type="button"
                          onClick={() => setRejectReason(reason)}
                          style={{
                            padding: '4px 10px',
                            fontSize: '12px',
                            borderRadius: '100px',
                            cursor: 'pointer',
                            background: 'transparent',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border-subtle)',
                          }}
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
                      placeholder="例如：封面与内容不符，请补充创作说明后重新提交"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-void)',
                        color: 'var(--text-primary)',
                        fontSize: '13px',
                        resize: 'vertical',
                      }}
                    />

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => confirmReject(item)}
                        style={{
                          padding: '8px 18px',
                          borderRadius: '8px',
                          background: '#ff4444',
                          color: '#fff',
                          fontWeight: 'bold',
                          border: 'none',
                          cursor: isBusy ? 'not-allowed' : 'pointer',
                          opacity: isBusy ? 0.6 : 1,
                        }}
                      >
                        {isBusy ? '提交中…' : '确认驳回'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRejectingKey(null)
                          setRejectReason('')
                        }}
                        style={{
                          padding: '8px 18px',
                          borderRadius: '8px',
                          background: 'transparent',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                        }}
                      >
                        取消
                      </button>
                    </div>
                  </div>
                )}

                {/* --- 提问的回复输入框 --- */}
                {item.type === 'question' && isPending && (
                  <div style={{ marginTop: '16px' }}>
                    <textarea
                      value={replyDrafts[key] ?? item.adminReply ?? ''}
                      onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [key]: e.target.value }))}
                      rows={2}
                      maxLength={1000}
                      placeholder="可选：填写官方回复。点「通过」时会一起保存并发布。"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-void)',
                        color: 'var(--text-primary)',
                        fontSize: '13px',
                        resize: 'vertical',
                      }}
                    />
                  </div>
                )}

                {/* --- 底部操作条 --- */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '18px', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => toggleExpand(key)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '6px',
                      background: 'transparent',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    {isExpanded ? '收起全文' : '展开全文'}
                  </button>

                  {isPending && !isRejecting && (
                    <>
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleApprove(item)}
                        style={{
                          padding: '7px 18px',
                          borderRadius: '6px',
                          background: 'rgba(60,220,140,0.12)',
                          color: 'var(--green)',
                          border: '1px solid var(--green)',
                          fontWeight: 'bold',
                          cursor: isBusy ? 'not-allowed' : 'pointer',
                          opacity: isBusy ? 0.6 : 1,
                          fontSize: '13px',
                        }}
                      >
                        {isBusy ? '处理中…' : '通过并发布'}
                      </button>

                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => openReject(key)}
                        style={{
                          padding: '7px 18px',
                          borderRadius: '6px',
                          background: 'rgba(255,68,68,0.1)',
                          color: '#ff4444',
                          border: '1px solid #ff4444',
                          cursor: isBusy ? 'not-allowed' : 'pointer',
                          opacity: isBusy ? 0.6 : 1,
                          fontSize: '13px',
                        }}
                      >
                        驳回
                      </button>
                    </>
                  )}

                  {item.type === 'portfolio' && (
                    <Link
                      href={`/admin/portfolio/${item.id}`}
                      style={{
                        padding: '7px 14px',
                        borderRadius: '6px',
                        color: 'var(--cyan)',
                        border: '1px solid rgba(0,212,255,0.3)',
                        textDecoration: 'none',
                        fontSize: '13px',
                      }}
                    >
                      去编辑
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
