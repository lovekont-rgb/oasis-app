'use client'

import { useState } from 'react'
import { submitMessage } from './actions'

export default function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    
    const formData = new FormData(e.currentTarget)
    const res = await submitMessage(formData)
    
    setLoading(false)
    if (res.success) {
      setMsg('留言提交成功！我们会尽快与您联系。')
      e.currentTarget.reset()
    } else {
      setMsg('提交失败: ' + res.error)
    }
  }

  return (
    <div className="ui-card" style={{ padding: '40px' }}>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>发送留言</h3>
      {msg && <div style={{ padding: '12px', background: msg.includes('成功') ? 'rgba(60,220,140,0.1)' : 'rgba(255,68,68,0.1)', color: msg.includes('成功') ? 'var(--green)' : '#ff4444', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{msg}</div>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <input name="name" required placeholder="您的称呼" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white' }} />
        <input name="contact" required placeholder="联系方式 (邮箱/微信)" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white' }} />
        <textarea name="content" required placeholder="留言内容..." rows={4} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white', resize: 'vertical' }}></textarea>
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: 'var(--cyan)', color: '#05070d', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
          {loading ? '发送中...' : '提交留言'}
        </button>
      </form>
    </div>
  )
}