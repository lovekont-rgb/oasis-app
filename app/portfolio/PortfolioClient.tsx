'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function PortfolioClient({ initialData }: { initialData: any[] }) {
  const [activeTab, setActiveTab] = useState('全部')
  const tabs = ['全部', '作品集', '优秀作品', '兼职接单']

  const filteredData = initialData.filter(item => 
    activeTab === '全部' ? true : item.category === activeTab
  )

  return (
    <div>
      {/* 顶部 Tab 切换 */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        marginBottom: '40px', borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '16px', flexWrap: 'wrap', gap: '16px'
      }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 20px', borderRadius: '100px', border: '1px solid',
                borderColor: activeTab === tab ? 'var(--cyan)' : 'transparent',
                background: activeTab === tab ? 'rgba(0, 212, 255, 0.1)' : 'transparent',
                color: activeTab === tab ? 'var(--cyan)' : 'var(--text-secondary)',
                fontSize: '14px', fontWeight: activeTab === tab ? 'bold' : 'normal',
                cursor: 'pointer', transition: '0.3s'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>如何发布作品和接单？</span>
      </div>

      {/* 网格展示 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {filteredData.map((item) => (
          
          /* 👇 核心修复：这里使用了 Link 包裹整个卡片，实现点击跳转详情页 */
          <Link 
            href={`/portfolio/${item.id}`} 
            key={item.id} 
            className="ui-card" 
            style={{ padding: '0', overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column', textDecoration: 'none' }}
          >
            {/* 封面图区域 */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
              <img 
                src={item.cover_url} 
                alt={item.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                className="portfolio-img"
              />
              <div style={{ 
                position: 'absolute', top: 0, left: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                color: 'white', padding: '4px 12px', fontSize: '11px', fontFamily: 'Orbitron', borderBottomRightRadius: '8px',
                borderTop: '2px solid var(--cyan)'
              }}>
                OASIS PORTFOLIO
              </div>
            </div>

            {/* 信息区域 */}
            <div style={{ padding: '16px 20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.title}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg, var(--violet), var(--cyan))', display: 'grid', placeItems: 'center', fontSize: '10px', color: 'white', fontWeight: 'bold' }}>
                  {item.author_name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{item.author_name}</span>
              </div>
            </div>
          </Link>
          
        ))}
      </div>
      
      {filteredData.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-dim)' }}>该分类下暂无作品。</div>
      )}
    </div>
  )
}