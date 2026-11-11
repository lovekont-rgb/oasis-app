'use client'
import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createPortfolio, deletePortfolioAction } from './actions'

export default function PortfolioAdminClient({ initialData }: { initialData: any[] }) {
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await createPortfolio(new FormData(e.currentTarget))
    if (res.success) {
      alert('发布成功！')
      formRef.current?.reset()
      router.refresh()
    } else {
      alert('失败: ' + res.error)
    }
  }

  const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white', marginBottom: '12px' }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
      {/* 左侧表单 */}
      <div className="ui-card" style={{ height: 'fit-content' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--cyan)' }}>发布新作品</h3>
        <form ref={formRef} onSubmit={handleSubmit}>
          <input name="title" placeholder="作品标题" required style={inputStyle} />
          <input name="cover_url" placeholder="封面图链接 (https://...)" required style={inputStyle} />
          <input name="author_name" placeholder="作者昵称" required style={inputStyle} />
          <select name="category" required style={inputStyle}>
            <option value="作品集">作品集</option>
            <option value="优秀作品">优秀作品</option>
            <option value="兼职接单">兼职接单</option>
          </select>
          <button type="submit" style={{ width: '100%', padding: '12px', background: 'var(--cyan)', color: '#05070d', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', border: 'none' }}>确认发布</button>
        </form>
      </div>

      {/* 右侧列表 */}
      <div className="ui-card">
        <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>已发布列表 ({initialData.length})</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', maxHeight: '700px', overflowY: 'auto' }}>
          {initialData.map(item => (
            <div key={item.id} style={{ background: 'var(--bg-void)', border: '1px solid var(--border-subtle)', borderRadius: '8px', overflow: 'hidden' }}>
              <img src={item.cover_url} alt={item.title} style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
              <div style={{ padding: '12px' }}>
                <h4 style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</h4>
                <span style={{ fontSize: '12px', color: 'var(--cyan)' }}>{item.category}</span>
                <form action={deletePortfolioAction} style={{ marginTop: '8px' }}>
                  <input type="hidden" name="id" value={item.id} />
                  <button type="submit" style={{ width: '100%', border: '1px solid #ff4444', color: '#ff4444', padding: '4px', borderRadius: '4px', background: 'transparent', cursor: 'pointer', fontSize: '12px' }}>下架</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}