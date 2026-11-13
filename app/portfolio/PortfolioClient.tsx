'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function PortfolioClient({ initialData }: { initialData: any[] }) {
  const [activeTab, setActiveTab] = useState('全部')
  const [sortBy, setSortBy] = useState<'latest' | 'hot'>('latest')
  const tabs = ['全部', '作品集', '优秀作品', '兼职接单']

  // 先按分类过滤
  let filteredData = initialData.filter(item => 
    activeTab === '全部' ? true : item.category === activeTab
  )

  // 再按排序规则处理
  filteredData = filteredData.sort((a, b) => {
    if (sortBy === 'hot') {
      return (b.likes_count || 0) - (a.likes_count || 0) // 按点赞数降序
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime() // 按时间降序
  })

  return (
    <div style={{ position: 'relative', minHeight: '60vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* 分类 Tabs */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 20px', borderRadius: '100px', border: '1px solid', borderColor: activeTab === tab ? 'var(--cyan)' : 'transparent', background: activeTab === tab ? 'rgba(0, 212, 255, 0.1)' : 'transparent', color: activeTab === tab ? 'var(--cyan)' : 'var(--text-secondary)', fontSize: '14px', fontWeight: activeTab === tab ? 'bold' : 'normal', cursor: 'pointer', transition: '0.3s' }}>
              {tab}
            </button>
          ))}
        </div>

        {/* 排序按钮 */}
        <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-void)', padding: '4px', borderRadius: '100px', border: '1px solid var(--border-subtle)' }}>
          <button onClick={() => setSortBy('latest')} style={{ padding: '6px 16px', borderRadius: '100px', border: 'none', background: sortBy === 'latest' ? 'var(--cyan)' : 'transparent', color: sortBy === 'latest' ? '#05070d' : 'var(--text-dim)', cursor: 'pointer', fontSize: '13px', transition: '0.3s' }}>最新</button>
          <button onClick={() => setSortBy('hot')} style={{ padding: '6px 16px', borderRadius: '100px', border: 'none', background: sortBy === 'hot' ? 'var(--cyan)' : 'transparent', color: sortBy === 'hot' ? '#05070d' : 'var(--text-dim)', cursor: 'pointer', fontSize: '13px', transition: '0.3s' }}>最热</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {filteredData.map((item) => (
          <Link href={`/portfolio/${item.id}`} key={item.id} className="ui-card" style={{ padding: 0, overflow: 'hidden', textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
              <img src={item.cover_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ padding: '16px 20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '12px' }}>{item.title}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{item.author_name}</span>
                <span style={{ fontSize: '12px', color: '#ff4444' }}>❤️ {item.likes_count || 0}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 右下角悬浮发布按钮 */}
      <Link href="/dashboard/portfolio" style={{
        position: 'fixed', bottom: '40px', right: '40px', zIndex: 50,
        padding: '16px 32px', borderRadius: '100px', background: 'linear-gradient(120deg, var(--cyan), #4ae0ff)',
        color: '#05070d', fontWeight: 800, fontSize: '16px', textDecoration: 'none',
        boxShadow: '0 10px 30px rgba(0,212,255,0.4)', display: 'flex', alignItems: 'center', gap: '8px',
        transition: '0.3s'
      }}>
        ✨ 发布我的作品
      </Link>
    </div>
  )
}