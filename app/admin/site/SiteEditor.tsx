'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateSiteSetting } from './actions'

export default function SiteEditor({ settingKey, initialContent, title }: { settingKey: string, initialContent: string, title: string }) {
  const [content, setContent] = useState(initialContent)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSave = async () => {
    setLoading(true)
    const res = await updateSiteSetting(settingKey, content)
    setLoading(false)
    if (res.success) {
      alert('保存成功！')
      router.refresh()
    } else {
      alert('保存失败: ' + res.error)
    }
  }

  return (
    <div className="ui-card" style={{ padding: '32px' }}>
      <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--cyan)' }}>编辑 {title}</h2>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>提示：按下回车键可以分段。</p>
      
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={15}
        style={{ width: '100%', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white', lineHeight: 1.6, resize: 'vertical' }}
      />
      
      <button 
        onClick={handleSave} 
        disabled={loading}
        style={{ marginTop: '24px', padding: '12px 32px', background: 'var(--cyan)', color: '#05070d', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
      >
        {loading ? '保存中...' : '保存修改'}
      </button>
    </div>
  )
}