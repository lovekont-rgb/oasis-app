'use client'
import { useState } from 'react'
import styles from './prompts.module.css'

export default function PromptClient({ initialPrompts }: { initialPrompts: any[] }) {
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const handleCopy = async (id: number, content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      alert('复制失败，请手动选中复制')
    }
  }

  return (
    <div className={styles.templateList}>
      {initialPrompts.map((prompt) => (
        <div key={prompt.id} className={"ui-card"}>
          <div className={styles.templateTop}>
            <h4>{prompt.title}</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className={styles.modelTag}>{prompt.model}</span>
              <button 
                className={`${styles.copyBtn} ${copiedId === prompt.id ? styles.copied : ''}`}
                onClick={() => handleCopy(prompt.id, prompt.content)}
              >
                {copiedId === prompt.id ? '已复制 ✓' : '复制'}
              </button>
            </div>
          </div>
          <pre className={styles.codeBlock}>{prompt.content}</pre>
        </div>
      ))}
      {initialPrompts.length === 0 && <p className={styles.empty}>暂无模板数据。</p>}
    </div>
  )
}