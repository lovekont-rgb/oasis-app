'use client'
import { useState } from 'react'
import styles from './tools.module.css'

export default function ToolsClient({ initialTools }: { initialTools: any[] }) {
  const [activeCat, setActiveCat] = useState('all')
  const [query, setQuery] = useState('')

  const filteredTools = initialTools.filter((t) => {
    const matchCat = activeCat === 'all' || t.category === activeCat
    const matchQuery = !query || t.name.toLowerCase().includes(query.toLowerCase()) || t.description.includes(query)
    return matchCat && matchQuery
  })

  const categories = [
    { key: 'all', label: '全部' },
    { key: 'text', label: '对话 / 文本' },
    { key: 'image', label: '图像' },
    { key: 'video', label: '视频' },
    { key: 'code', label: '编程 / Agent' },
    { key: 'audio', label: '音频 / 音乐' },
    { key: 'office', label: '办公 / 效率' }
  ]

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>⌕</span>
          <input type="text" placeholder="搜索工具名称或描述..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className={styles.tabs}>
          {categories.map((cat) => (
            <button
              key={cat.key}
              className={`${styles.tab} ${activeCat === cat.key ? styles.tabActive : ''}`}
              onClick={() => setActiveCat(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.countLine}>显示 <b>{filteredTools.length}</b> 个工具</div>

      <div className={styles.grid}>
        {filteredTools.map((tool) => (
          <div key={tool.id} className={styles.card}>
            <div className={styles.cardHead}>
              <h3 className={styles.cardName}>{tool.name}</h3>
              <span className={`${styles.badge} ${
                tool.pricing === 'free' ? styles.badgeFree : 
                tool.pricing === 'paid' ? styles.badgePaid : styles.badgeOss
              }`}>
                {tool.pricing}
              </span>
            </div>
            <p className={styles.cardDesc}>{tool.description}</p>
          </div>
        ))}
      </div>
      {filteredTools.length === 0 && <div className={styles.empty}>没有匹配的工具。</div>}
    </>
  )
}