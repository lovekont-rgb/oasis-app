'use client'
import { useState } from 'react'
import styles from './library.module.css'

export default function LibraryClient({ initialPrompts, categories }: { initialPrompts: any[], categories: any[] }) {
  const [activeCat, setActiveCat] = useState<number | 'all'>('all')
  const [expandedCats, setExpandedCats] = useState<number[]>([]) // 存展开的一级目录 ID
  const [copiedId, setCopiedId] = useState<number | null>(null)

  // 过滤数据逻辑
  const filteredPrompts = initialPrompts.filter((p) => {
    if (activeCat === 'all') return true
    return p.category_id === activeCat
  })

  const handleCopy = async (id: number, content: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const toggleExpand = (id: number) => {
    setExpandedCats(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const roots = categories.filter(c => !c.parent_id)

  return (
    <div className={styles.layoutContainer}>
      <aside className={styles.sidebar}>
        <div style={{ padding: '0 16px 16px 16px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>提示词分类</h3>
        </div>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          
          <li style={{ marginBottom: '8px' }}>
            <div 
              onClick={() => setActiveCat('all')}
              className={`${styles.menuItem} ${activeCat === 'all' ? styles.menuItemActive : ''}`}
            >
              <span style={{ marginRight: '8px' }}>⭐</span>精选推荐
            </div>
          </li>

          {/* 渲染一级目录 */}
          {roots.map(root => {
            const children = categories.filter(c => c.parent_id === root.id)
            const isExpanded = expandedCats.includes(root.id)
            
            return (
              <li key={root.id} style={{ marginBottom: '8px' }}>
                <div 
                  onClick={() => toggleExpand(root.id)}
                  className={styles.menuItem}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span>📁 {root.name}</span>
                  <span style={{ fontSize: '10px' }}>{isExpanded ? '▼' : '▶'}</span>
                </div>
                
                {/* 渲染二级目录 */}
                {isExpanded && (
                  <ul style={{ listStyle: 'none', padding: '0 0 0 32px', marginTop: '4px' }}>
                    {children.map(child => (
                      <li key={child.id}>
                        <div
                          onClick={() => setActiveCat(child.id)}
                          className={`${styles.menuItem} ${activeCat === child.id ? styles.menuItemActive : ''}`}
                          style={{ fontSize: '13px', padding: '8px 12px' }}
                        >
                          {child.name}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}

        </ul>
      </aside>

      <div style={{ flex: 1 }}>
        <div className={styles.masonryGrid}>
          {filteredPrompts.map((prompt) => (
            <div key={prompt.id} className={styles.card}>
              {prompt.image_url && (
                <div className={styles.imageWrapper}>
                  <img src={prompt.image_url} alt={prompt.title} className={styles.cardImage} />
                </div>
              )}
              <div className={styles.cardContent}>
                <div className={styles.cardTags}>
                  <span className={styles.mainTag}>{prompt.category === 'image' ? '🎨 画图' : prompt.category === 'writing' ? '✍️ 文案' : '⌨️ 代码'}</span>
                  {prompt.tags?.map((tag: string) => (
                    <span key={tag} className={styles.subTag}>{tag}</span>
                  ))}
                </div>
                <h3 className={styles.cardTitle}>{prompt.title}</h3>
                <p className={styles.cardDesc}>{prompt.content}</p>
                <div className={styles.cardFooter}>
                  <button 
                    onClick={() => handleCopy(prompt.id, prompt.content)}
                    className={`${styles.actionBtn} ${copiedId === prompt.id ? styles.copied : ''}`}
                  >
                    {copiedId === prompt.id ? '已复制 ✓' : '复制提示词'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredPrompts.length === 0 && <p style={{ color: 'var(--text-dim)', marginTop: '20px' }}>该分类下暂无提示词。</p>}
      </div>
    </div>
  )
}