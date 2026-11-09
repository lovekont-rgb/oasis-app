'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { replyMessage, toggleHideMessage, deleteMessage } from './actions'

export default function MessagesClient({ initialMessages }: { initialMessages: any[] }) {
  const router = useRouter()
  const [replyingId, setReplyingId] = useState<number | null>(null)
  const [replyText, setReplyText] = useState('')

  const handleReplySubmit = async (id: number) => {
    if (!replyText.trim()) return alert('回复内容不能为空')
    const res = await replyMessage(id, replyText)
    if (res.success) {
      alert('回复成功！')
      setReplyingId(null)
      setReplyText('')
      router.refresh()
    } else {
      alert('回复失败: ' + res.error)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {initialMessages.map((msg) => (
        <div key={msg.id} className="ui-card" style={{ padding: '24px', opacity: msg.status === 'hidden' ? 0.5 : 1 }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
                {msg.name} <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontWeight: 'normal' }}>({msg.contact})</span>
              </h4>
              <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{new Date(msg.created_at).toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {msg.status === 'pending' && <span style={{ fontSize: '12px', color: 'var(--warn)', border: '1px solid var(--warn)', padding: '2px 8px', borderRadius: '100px' }}>待处理</span>}
              {msg.status === 'replied' && <span style={{ fontSize: '12px', color: 'var(--green)', border: '1px solid var(--green)', padding: '2px 8px', borderRadius: '100px' }}>已回复</span>}
              {msg.status === 'hidden' && <span style={{ fontSize: '12px', color: 'var(--text-dim)', border: '1px solid var(--text-dim)', padding: '2px 8px', borderRadius: '100px' }}>已隐藏</span>}
            </div>
          </div>

          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
            {msg.content}
          </p>

          {/* 已有的回复展示 */}
          {msg.reply && (
            <div style={{ marginBottom: '16px', paddingLeft: '12px', borderLeft: '2px solid var(--cyan)' }}>
              <span style={{ fontSize: '12px', color: 'var(--cyan)', display: 'block', marginBottom: '4px' }}>管理员回复：</span>
              <p style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{msg.reply}</p>
            </div>
          )}

          {/* 操作按钮组 */}
          <div style={{ display: 'flex', gap: '12px', borderTop: '1px dashed var(--border-subtle)', paddingTop: '16px' }}>
            <button onClick={() => setReplyingId(replyingId === msg.id ? null : msg.id)} style={{ background: 'rgba(0,212,255,0.1)', color: 'var(--cyan)', border: '1px solid var(--cyan)', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
              {msg.reply ? '修改回复' : '回复'}
            </button>
            <button onClick={() => toggleHideMessage(msg.id, msg.status)} style={{ background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
              {msg.status === 'hidden' ? '取消隐藏' : '隐藏'}
            </button>
            <form action={deleteMessage}>
              <input type="hidden" name="id" value={msg.id} />
              <button type="submit" style={{ background: 'transparent', color: '#ff4444', border: '1px solid #ff4444', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>删除</button>
            </form>
          </div>

          {/* 回复输入框 */}
          {replyingId === msg.id && (
            <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
              <input 
                value={replyText} 
                onChange={(e) => setReplyText(e.target.value)} 
                placeholder="输入回复内容..." 
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white' }} 
              />
              <button onClick={() => handleReplySubmit(msg.id)} style={{ padding: '0 24px', background: 'var(--cyan)', color: '#05070d', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>发送</button>
            </div>
          )}

        </div>
      ))}
      {initialMessages.length === 0 && <p style={{ color: 'var(--text-dim)' }}>暂无留言。</p>}
    </div>
  )
}