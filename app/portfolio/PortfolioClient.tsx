'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { formatDateTime } from '@/lib/format';

export default function PortfolioClient({ 
  initialPortfolios, 
  initialInteractions,
  currentUser 
}: { 
  initialPortfolios: any[], 
  initialInteractions: any[],
  currentUser: any 
}) {
  const [portfolios] = useState(initialPortfolios);
  const [filter, setFilter] = useState('全部');
  const [sortBy, setSortBy] = useState('最新');

  const filtered = useMemo(() => {
    let list = portfolios;
    if (filter !== '全部') {
      list = list.filter(p => p.category === filter);
    }
    if (sortBy === '最热') {
      list = [...list].sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
    }
    return list;
  }, [portfolios, filter, sortBy]);

  return (
    <div>
      {/* 工具栏 */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
        {['全部', '作品集', '优秀作品', '兼职接单'].map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{ padding: '8px 20px', borderRadius: '100px', border: `1px solid ${filter === cat ? 'var(--cyan)' : 'var(--border-subtle)'}`, background: filter === cat ? 'var(--cyan)' : 'transparent', color: filter === cat ? '#05070d' : 'var(--text-secondary)', fontSize: '14px', cursor: 'pointer', fontWeight: filter === cat ? 'bold' : 'normal', transition: 'all 0.2s' }}>
            {cat}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <button onClick={() => setSortBy('最新')} style={{ background: 'none', border: 'none', color: sortBy === '最新' ? 'var(--cyan)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '14px' }}>最新</button>
          <span style={{ color: 'var(--border-subtle)' }}>|</span>
          <button onClick={() => setSortBy('最热')} style={{ background: 'none', border: 'none', color: sortBy === '最热' ? 'var(--cyan)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '14px' }}>最热</button>
        </div>
      </div>

      {/* 列表 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {filtered.map(p => {
          // ★ 核心修复：优先从 profiles 联表取头像和名字
          const authorName = p.profiles?.username || p.author_name || '匿名用户';
          const authorAvatar = p.profiles?.avatar_url;
          
          return (
            <div key={p.id} className="ui-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <Link href={`/portfolio/${p.id}`} style={{ display: 'block', height: '220px', background: 'var(--bg-void)', overflow: 'hidden', textDecoration: 'none' }}>
                <img src={p.cover_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe'} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} />
              </Link>
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  {/* 头像展示 */}
                  <Link href={`/portfolio/author/${encodeURIComponent(authorName)}`} style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--violet), var(--cyan))', overflow: 'hidden', display: 'grid', placeItems: 'center', flexShrink: 0, textDecoration: 'none', color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>
                    {authorAvatar ? (
                      <img src={authorAvatar} alt={authorName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      authorName.charAt(0).toUpperCase()
                    )}
                  </Link>
                  <Link href={`/portfolio/author/${encodeURIComponent(authorName)}`} style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                    {authorName}
                  </Link>
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)', marginLeft: 'auto' }}>
                    {formatDateTime(p.created_at).split(' ')[0]}
                  </span>
                </div>
                <Link href={`/portfolio/${p.id}`} style={{ textDecoration: 'none' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.4 }}>{p.title}</h3>
                </Link>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '20px', flex: 1 }}>{p.content}</p>
                <div style={{ display: 'flex', gap: '20px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', fontSize: '13px', color: 'var(--text-dim)' }}>
                  <span>❤️ {p.likes_count}</span>
                  <span>💔 {p.dislikes_count}</span>
                  <span>⭐ {p.collects_count}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 24px', border: '1px dashed var(--border-subtle)', borderRadius: '20px' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>📭</div>
          <p style={{ color: 'var(--text-secondary)' }}>该分类下暂无作品。</p>
        </div>
      )}
    </div>
  );
}