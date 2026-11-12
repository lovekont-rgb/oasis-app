'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { submitQuestion } from './actions'

export default function QaClient({ officialFaqs, userQuestions }: { officialFaqs: any[], userQuestions: any[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const res = await submitQuestion(formData)
    setLoading(false)
    if (res.success) {
      alert('提问发布成功！')
      setShowForm(false)
      router.refresh()
    } else {
      alert('失败: ' + res.error)
    }
  }

  const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white', marginBottom: '16px' }

  return (
    <div>
      {/* 官方经典 FAQ 版块 */}
      <div style={{ marginBottom: '60px' }}>
        <h2 className="ui-section-title" style={{ marginTop: 0, marginBottom: '24px' }}>官方精选问答</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {officialFaqs.map((faq) => (
            <details key={faq.id} className="ui-card" style={{ padding: '16px 24px', cursor: 'pointer' }}>
              <summary style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {faq.question}
                <span style={{ color: 'var(--cyan)' }}>+</span>
              </summary>
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed var(--border-subtle)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* 用户互动提问版块 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 className="ui-section-title" style={{ margin: 0 }}>用户最新提问 ({userQuestions.length})</h2>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '10px 24px', background: 'var(--cyan)', color: '#05070d', borderRadius: '100px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
          {showForm ? '取消提问' : '+ 发起提问'}
        </button>
      </div>

      {/* 提问表单 */}
      {showForm && (
        <form onSubmit={handleSubmit} className="ui-card" style={{ padding: '32px', marginBottom: '40px', border: '1px solid var(--cyan)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>您的称呼 (未来将自动带入)</label>
              <input name="user_name" required placeholder="请输入昵称" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>问题标题</label>
              <input name="title" required placeholder="一句话描述您的问题" style={inputStyle} />
            </div>
          </div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>详细内容 (可附带报错信息)</label>
          <textarea name="content" required rows={4} placeholder="详细描述您遇到的卡点..." style={{ ...inputStyle, resize: 'vertical' }} />
          <button type="submit" disabled={loading} style={{ padding: '12px 32px', background: 'var(--cyan)', color: '#05070d', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
            {loading ? '发布中...' : '确认发布'}
          </button>
        </form>
      )}

      {/* 用户提问列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {userQuestions.map((q) => (
          <div key={q.id} className="ui-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{q.title}</h3>
              <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                {q.user_name} · 来自 {q.ip_location} · {new Date(q.created_at).toLocaleDateString()}
              </span>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>{q.content}</p>
            
            {/* 官方回复展示 */}
            {q.admin_reply && (
              <div style={{ background: 'rgba(0, 212, 255, 0.05)', borderLeft: '3px solid var(--cyan)', padding: '16px', borderRadius: '0 8px 8px 0' }}>
                <span style={{ fontSize: '12px', color: 'var(--cyan)', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>🛡️ OASIS 官方回复</span>
                <p style={{ fontSize: '14px', color: 'var(--text-primary)', margin: 0 }}>{q.admin_reply}</p>
              </div>
            )}
          </div>
        ))}
        {userQuestions.length === 0 && <p style={{ color: 'var(--text-dim)' }}>暂无提问，快来抢占沙发！</p>}
      </div>
    </div>
  )
}