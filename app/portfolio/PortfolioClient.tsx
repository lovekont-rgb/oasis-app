'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function PortfolioClient({ initialData, currentUser, initialInteractions }: { initialData: any[], currentUser?: any, initialInteractions: any[] }) {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState('全部')
  const [sortBy, setSortBy] = useState<'latest' | 'hot'>('latest')
  
  const [works, setWorks] = useState(initialData)
  
  // 👇 修复：精确映射每个动作的状态，不再动态拼接
  const [interactions, setInteractions] = useState<Record<string, { liked: boolean, disliked: boolean, collected: boolean }>>(() => {
    const map: Record<string, any> = {}
    initialInteractions.forEach(i => {
      if (!map[i.portfolio_id]) map[i.portfolio_id] = { liked: false, disliked: false, collected: false }
      if (i.type === 'like') map[i.portfolio_id].liked = true
      if (i.type === 'dislike') map[i.portfolio_id].disliked = true
      if (i.type === 'collect') map[i.portfolio_id].collected = true
    })
    return map
  })

  const tabs = ['全部', '作品集', '优秀作品', '兼职接单']

  let filteredData = works.filter(item => activeTab === '全部' ? true : item.category === activeTab)
  filteredData = filteredData.sort((a, b) => {
    if (sortBy === 'hot') return (b.likes_count || 0) - (a.likes_count || 0)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  // 👇 修复：精确读取状态，不使用 `${type}d` 拼接
  const handleAction = async (e: React.MouseEvent, id: number, type: 'like' | 'dislike' | 'collect') => {
    e.preventDefault()
    e.stopPropagation()

    if (!currentUser) return alert('请先登录再操作！')

    const currentInteract = interactions[id] || { liked: false, disliked: false, collected: false }
    const isActive = type === 'like' ? currentInteract.liked : type === 'dislike' ? currentInteract.disliked : currentInteract.collected
    
    // 1. 立即更新 UI
    setInteractions(prev => {
      const current = prev[id] || { liked: false, disliked: false, collected: false }
      return {
        ...prev,
        [id]: {
          ...current,
          liked: type === 'like' ? !isActive : current.liked,
          disliked: type === 'dislike' ? !isActive : current.disliked,
          collected: type === 'collect' ? !isActive : current.collected,
        }
      }
    })
    
    setWorks(prev => prev.map(w => {
      if (w.id === id) {
        const field = `${type}s_count`
        return { ...w, [field]: (w[field] || 0) + (isActive ? -1 : 1) }
      }
      return w
    }))

    // 2. 后台静默请求
    try {
      if (isActive) {
        await supabase.from('portfolio_interactions').delete().eq('portfolio_id', id).eq('user_id', currentUser.id).eq('type', type)
        const currentCount = works.find(w => w.id === id)?.[`${type}s_count`] || 0
        await supabase.from('portfolios').update({ [`${type}s_count`]: Math.max(0, currentCount - 1) }).eq('id', id)
      } else {
        await supabase.from('portfolio_interactions').insert({ portfolio_id: id, user_id: currentUser.id, type })
        const currentCount = works.find(w => w.id === id)?.[`${type}s_count`] || 0
        await supabase.from('portfolios').update({ [`${type}s_count`]: currentCount + 1 }).eq('id', id)
      }
    } catch (error) {
      console.error('操作失败:', error)
    }
  }

  return (
    <div style={{ position: 'relative', minHeight: '60vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 20px', borderRadius: '100px', border: '1px solid', borderColor: activeTab === tab ? 'var(--cyan)' : 'transparent', background: activeTab === tab ? 'rgba(0, 212, 255, 0.1)' : 'transparent', color: activeTab === tab ? 'var(--cyan)' : 'var(--text-secondary)', fontSize: '14px', fontWeight: activeTab === tab ? 'bold' : 'normal', cursor: 'pointer', transition: '0.3s' }}>
              {tab}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-void)', padding: '4px', borderRadius: '100px', border: '1px solid var(--border-subtle)' }}>
          <button onClick={() => setSortBy('latest')} style={{ padding: '6px 16px', borderRadius: '100px', border: 'none', background: sortBy === 'latest' ? 'var(--cyan)' : 'transparent', color: sortBy === 'latest' ? '#05070d' : 'var(--text-dim)', cursor: 'pointer', fontSize: '13px' }}>最新</button>
          <button onClick={() => setSortBy('hot')} style={{ padding: '6px 16px', borderRadius: '100px', border: 'none', background: sortBy === 'hot' ? 'var(--cyan)' : 'transparent', color: sortBy === 'hot' ? '#05070d' : 'var(--text-dim)', cursor: 'pointer', fontSize: '13px' }}>最热</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {filteredData.map((item) => {
          const action = interactions[item.id] || { liked: false, disliked: false, collected: false }
          
          return (
            <div key={item.id} className="ui-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <Link href={`/portfolio/${item.id}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
                  <img src={item.cover_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '16px 20px 8px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '4px' }}>{item.title}</h3>
                  <span style={{ fontSize: '12px', color: 'var(--cyan)' }}>{item.category}</span>
                </div>
              </Link>

              <div style={{ padding: '8px 20px 16px', marginTop: 'auto', borderTop: '1px dashed var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href={`/portfolio/author/${encodeURIComponent(item.author_name)}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg, var(--violet), var(--cyan))', display: 'grid', placeItems: 'center', fontSize: '10px', color: 'white', fontWeight: 'bold' }}>
                    {item.author_name?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{item.author_name}</span>
                </Link>
                
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={(e) => handleAction(e, item.id, 'like')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: action.liked ? '#ff4444' : 'var(--text-secondary)' }}>
                    {action.liked ? '❤️' : '🤍'} {item.likes_count || 0}
                  </button>
                  <button onClick={(e) => handleAction(e, item.id, 'dislike')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: action.disliked ? 'var(--warn)' : 'var(--text-secondary)' }}>
                    {action.disliked ? '👎' : '👎'} {item.dislikes_count || 0}
                  </button>
                  <button onClick={(e) => handleAction(e, item.id, 'collect')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: action.collected ? '#ffd700' : 'var(--text-secondary)' }}>
                    {action.collected ? '⭐' : '☆'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <Link href="/dashboard/portfolio" style={{ position: 'fixed', bottom: '40px', right: '40px', zIndex: 50, padding: '16px 32px', borderRadius: '100px', background: 'linear-gradient(120deg, var(--cyan), #4ae0ff)', color: '#05070d', fontWeight: 800, fontSize: '16px', textDecoration: 'none', boxShadow: '0 10px 30px rgba(0,212,255,0.4)' }}>
        ✨ 发布我的作品
      </Link>
    </div>
  )
}