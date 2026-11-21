'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function PortfolioClient({ initialData, currentUser }: { initialData: any[], currentUser?: any }) {
  const supabase = createClient()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('全部')
  const [sortBy, setSortBy] = useState<'latest' | 'hot'>('latest')
  const [loadingId, setLoadingId] = useState<number | null>(null)
  
  // 本地状态追踪用户点赞，避免刷新延迟
  const [userLikes, setUserLikes] = useState<number[]>([])
  
  const tabs = ['全部', '作品集', '优秀作品', '兼职接单']

  // 获取数据并排序
  let filteredData = initialData.filter(item => activeTab === '全部' ? true : item.category === activeTab)
  filteredData = filteredData.sort((a, b) => {
    if (sortBy === 'hot') return (b.likes_count || 0) - (a.likes_count || 0)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  // 👇 核心修复：处理列表页点赞，坚决阻止跳转
  const handleLike = async (e: React.MouseEvent, id: number, currentLikes: number) => {
    e.preventDefault() // 阻止 Link 跳转
    e.stopPropagation() // 阻止事件冒泡

    if (!currentUser) return alert('请先登录再点赞！')
    if (loadingId === id) return

    setLoadingId(id)
    const isLiked = userLikes.includes(id)

    try {
      if (isLiked) {
        // 取消点赞
        await supabase.from('portfolio_interactions').delete().eq('portfolio_id', id).eq('user_id', currentUser.id).eq('type', 'like')
        await supabase.from('portfolios').update({ likes_count: currentLikes - 1 }).eq('id', id)
        setUserLikes(prev => prev.filter(lid => lid !== id))
      } else {
        // 新增点赞
        await supabase.from('portfolio_interactions').insert({ portfolio_id: id, user_id: currentUser.id, type: 'like' })
        await supabase.from('portfolios').update({ likes_count: currentLikes + 1 }).eq('id', id)
        setUserLikes(prev => [...prev, id])
      }
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingId(null)
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
        {filteredData.map((item) => (
          // 注意：Link 只包裹了图片和文字，把点赞按钮放在了 Link 外部！
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
              
              {/* 👇 真实的点赞按钮，不会跳转 */}
              <button 
                onClick={(e) => handleLike(e, item.id, item.likes_count || 0)}
                disabled={loadingId === item.id}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: userLikes.includes(item.id) ? '#ff4444' : 'var(--text-secondary)', transition: '0.2s' }}
              >
                {userLikes.includes(item.id) ? '❤️' : '🤍'} {item.likes_count || 0}
              </button>
            </div>
          </div>
        ))}
      </div>

      <Link href="/dashboard/portfolio" style={{ position: 'fixed', bottom: '40px', right: '40px', zIndex: 50, padding: '16px 32px', borderRadius: '100px', background: 'linear-gradient(120deg, var(--cyan), #4ae0ff)', color: '#05070d', fontWeight: 800, fontSize: '16px', textDecoration: 'none', boxShadow: '0 10px 30px rgba(0,212,255,0.4)' }}>
        ✨ 发布我的作品
      </Link>
    </div>
  )
}