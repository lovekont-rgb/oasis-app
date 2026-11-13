'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function DetailInteraction({ portfolioId, initialLikes, user }: { portfolioId: number, initialLikes: number, user: any }) {
  const supabase = createClient()
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(false)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // 页面加载时，获取已有的评论
  useEffect(() => {
    const fetchComments = async () => {
      const { data } = await supabase
        .from('portfolio_comments')
        .select('*')
        .eq('portfolio_id', portfolioId)
        .order('created_at', { ascending: true })
      if (data) setComments(data)
    }
    fetchComments()
  }, [portfolioId])

  // 点赞逻辑
  const handleLike = async () => {
    if (isLiked) return
    setLikes(prev => prev + 1)
    setIsLiked(true)
    await supabase.from('portfolios').update({ likes_count: likes + 1 }).eq('id', portfolioId)
  }

  // 提交评论逻辑
  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return alert('请先登录才能评论！')
    if (!comment.trim()) return

    setLoading(true)
    const { data, error } = await supabase.from('portfolio_comments').insert({
      portfolio_id: portfolioId,
      user_id: user.id,
      user_name: user.email?.split('@')[0] || '匿名用户',
      content: comment
    }).select().single()
    
    setLoading(false)
    if (error) {
      alert('评论失败: ' + error.message)
    } else {
      setComments([...comments, data])
      setComment('')
    }
  }

  return (
    <div style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px dashed var(--border-subtle)' }}>
      
      {/* 点赞按钮 */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <button onClick={handleLike} style={{ padding: '10px 24px', borderRadius: '100px', background: isLiked ? 'rgba(255, 68, 68, 0.1)' : 'rgba(0,212,255,0.1)', color: isLiked ? '#ff4444' : 'var(--cyan)', border: `1px solid ${isLiked ? '#ff4444' : 'var(--cyan)'}`, cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' }}>
          {isLiked ? '❤️ 已点赞' : '🤍 点赞'} ({likes})
        </button>
      </div>

      <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--text-primary)' }}>评论区</h3>
      
      {/* 评论列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        {comments.map((c, i) => (
          <div key={i} style={{ background: 'var(--surface-card)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '12px', color: 'var(--cyan)', fontWeight: 'bold' }}>@{c.user_name}</span>
            <p style={{ fontSize: '14px', marginTop: '8px', color: 'var(--text-secondary)', margin: 0 }}>{c.content}</p>
          </div>
        ))}
        {comments.length === 0 && <p style={{ fontSize: '14px', color: 'var(--text-dim)' }}>还没有评论，快来抢沙发吧！</p>}
      </div>

      {/* 评论输入框 */}
      <form onSubmit={handleComment} style={{ display: 'flex', gap: '12px' }}>
        <input 
          value={comment} 
          onChange={e => setComment(e.target.value)} 
          placeholder={user ? "说点什么..." : "请先登录后发表评论..."} 
          disabled={!user || loading} 
          style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white' }} 
        />
        <button type="submit" disabled={!user || loading} style={{ padding: '0 24px', background: 'var(--cyan)', color: '#05070d', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: user ? 'pointer' : 'not-allowed', opacity: user ? 1 : 0.5 }}>
          发送
        </button>
      </form>
    </div>
  )
}