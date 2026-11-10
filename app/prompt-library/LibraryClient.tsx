'use client'
import { useState } from 'react'
import styles from './library.module.css'

export default function LibraryClient({ initialPrompts }: { initialPrompts: any[] }) {
  const [activeCat, setActiveCat] = useState('all')
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const menuData = [
    { key: 'all', label: '精选推荐', icon: '⭐' },
    { key: 'image', label: 'AI 画图', icon: '🎨' },
    { key: 'writing', label: '文案生成', icon: '✍️' },
    { key: 'agent', label: '代码开发', icon: '⌨️' },
  ]

  const filteredPrompts = initialPrompts.filter((p) => {
    if (activeCat === 'all') return true
    return p.category === activeCat
  })

  const handleCopy = async (id: number, content: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className={styles.layoutContainer}>
      <aside className={styles.sidebar}>
        <div style={{ padding: '0 16px 16px 16px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>提示词分类</h3>
        </div>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {menuData.map(menu => (
            <li key={menu.key} style={{ marginBottom: '8px' }}>
              <div 
                onClick={() => setActiveCat(menu.key)}
                className={`${styles.menuItem} ${activeCat === menu.key ? styles.menuItemActive : ''}`}
              >
                <span style={{ marginRight: '8px' }}>{menu.icon}</span>{menu.label}
              </div>
            </li>
          ))}
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
      </div>
    </div>
  )
}