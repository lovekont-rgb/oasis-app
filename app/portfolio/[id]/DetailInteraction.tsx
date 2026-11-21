'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function DetailInteraction({ portfolioId, initialLikes, initialDislikes, initialCollects, user }: { 
  portfolioId: number, initialLikes: number, initialDislikes: number, initialCollects: number, user: any 
}) {
  const supabase = createClient()
  const router = useRouter()
  
  const [likes, setLikes] = useState(initialLikes)
  const [dislikes, setDislikes] = useState(initialDislikes)
  const [collects, setCollects] = useState(initialCollects)
  
  // 记录用户的互动状态
  const [userAction, setUserAction] = useState<{ like: boolean, dislike: boolean, collect: boolean }>({
    like: false, dislike: false, collect: false
  })

  const [comment, setComment] = useState('')
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchInteractions = async () => {
      // 1. 获取评论
      const { data: commentData } = await supabase
        .from('portfolio_comments')
        .select('*')
        .eq('portfolio_id', portfolioId)
        .order('created_at', { ascending: true })
      if (commentData) setComments(commentData)

      // 2. 获取当前用户的互动状态
      if (user) {
        const { data: actionData } = await supabase
          .from('portfolio_interactions')
          .select('type')
          .eq('portfolio_id', portfolioId)
          .eq('user_id', user.id)
        
        if (actionData) {
          setUserAction({
            like: actionData.some(a => a.type === 'like'),
            dislike: actionData.some(a => a.type === 'dislike'),
            collect: actionData.some(a => a.type === 'collect'),
          })
        }
      }
    }
    fetchInteractions()
  }, [portfolioId, user])

  // 👇 核心：点赞/踩/收藏逻辑（带防抖、防连点、防跳转）
  const handleAction = async (e: React.MouseEvent, type: 'like' | 'dislike' | 'collect') => {
    e.preventDefault() // 阻止 Link 跳转
    e.stopPropagation() // 阻止事件冒泡
    
    if (!user) return alert('请先登录才能操作！')
    if (loading) return

    setLoading(true)
    const isActive = userAction[type]

    try {
      if (isActive) {
        // 如果已经点过，则取消操作（删除记录，数量-1）
        await supabase.from('portfolio_interactions')
          .delete().eq('portfolio_id', portfolioId).eq('user_id', user.id).eq('type', type)
        
        const updateField = type === 'like' ? { likes_count: likes - 1 } : type === 'dislike' ? { dislikes_count: dislikes - 1 } : { collects_count: collects - 1 }
        await supabase.from('portfolios').update(updateField).eq('id', portfolioId)
        
        if (type === 'like') setLikes(prev => prev - 1)
        if (type === 'dislike') setDislikes(prev => prev - 1)
        if (type === 'collect') setCollects(prev => prev - 1)
      } else {
        // 如果没点过，则新增记录（数量+1）
        await supabase.from('portfolio_interactions').insert({
          portfolio_id: portfolioId, user_id: user.id, type
        })
        
        const updateField = type === 'like' ? { likes_count: likes + 1 } : type === 'dislike' ? { dislikes_count: dislikes + 1 } : { collects_count: collects + 1 }
        await supabase.from('portfolios').update(updateField).eq('id', portfolioId)
        
        if (type === 'like') setLikes(prev => prev + 1)
        if (type === 'dislike') setDislikes(prev => prev + 1)
        if (type === 'collect') setCollects(prev => prev + 1)
      }
      setUserAction(prev => ({ ...prev, [type]: !isActive }))
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return alert('请先登录才能评论！')
    if (!comment.trim()) return
    setLoading(true)
    const { data, error } = await supabase.from('portfolio_comments').insert({
      portfolio_id: portfolioId, user_id: user.id,
      user_name: user.email?.split('@')[0] || '匿名用户', content: comment
    }).select().single()
    setLoading(false)
    if (error) alert('评论失败')
    else { setComments([...comments, data]); setComment('') }
  }

  return (
    <div style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px dashed var(--border-subtle)' }}>
      
      {/* 👇 互动按钮组 */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <button onClick={(e) => handleAction(e, 'like')} disabled={loading} style={{ padding: '10px 24px', borderRadius: '100px', background: userAction.like ? 'rgba(255, 68, 68, 0.15)' : 'rgba(0,212,255,0.05)', color: userAction.like ? '#ff4444' : 'var(--cyan)', border: `1px solid ${userAction.like ? '#ff4444' : 'var(--border-subtle)'}`, cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' }}>
          {userAction.like ? '❤️ 已赞' : '🤍 点赞'} ({likes})
        </button>
        <button onClick={(e) => handleAction(e, 'dislike')} disabled={loading} style={{ padding: '10px 24px', borderRadius: '100px', background: userAction.dislike ? 'rgba(255, 180, 60, 0.15)' : 'rgba(0,212,255,0.05)', color: userAction.dislike ? 'var(--warn)' : 'var(--text-secondary)', border: `1px solid ${userAction.dislike ? 'var(--warn)' : 'var(--border-subtle)'}`, cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' }}>
          {userAction.dislike ? '👎 已踩' : '👎 踩'} ({dislikes})
        </button>
        <button onClick={(e) => handleAction(e, 'collect')} disabled={loading} style={{ padding: '10px 24px', borderRadius: '100px', background: userAction.collect ? 'rgba(255, 215, 0, 0.15)' : 'rgba(0,212,255,0.05)', color: userAction.collect ? '#ffd700' : 'var(--text-secondary)', border: `1px solid ${userAction.collect ? '#ffd700' : 'var(--border-subtle)'}`, cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' }}>
          {userAction.collect ? '⭐ 已收藏' : '⭐ 收藏'} ({collects})
        </button>
      </div>

      <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--text-primary)' }}>评论区</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        {comments.map((c, i) => (
          <div key={i} style={{ background: 'var(--surface-card)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '12px', color: 'var(--cyan)', fontWeight: 'bold' }}>@{c.user_name}</span>
            <p style={{ fontSize: '14px', marginTop: '8px', color: 'var(--text-secondary)', margin: 0 }}>{c.content}</p>
          </div>
        ))}
        {comments.length === 0 && <p style={{ fontSize: '14px', color: 'var(--text-dim)' }}>还没有评论，快来抢沙发吧！</p>}
      </div>

      <form onSubmit={handleComment} style={{ display: 'flex', gap: '12px' }}>
        <input value={comment} onChange={e => setComment(e.target.value)} placeholder={user ? "说点什么..." : "请先登录后发表评论..."} disabled={!user || loading} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white' }} />
        <button type="submit" disabled={!user || loading} style={{ padding: '0 24px', background: 'var(--cyan)', color: '#05070d', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: user ? 'pointer' : 'not-allowed', opacity: user ? 1 : 0.5 }}>发送</button>
      </form>
    </div>
  )
}