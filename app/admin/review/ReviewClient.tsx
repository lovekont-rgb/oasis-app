'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { approvePortfolio, rejectPortfolio, approveQuestion, rejectQuestion } from './actions'

export default function ReviewClient({ portfolios, questions }: { portfolios: any[], questions: any[] }) {
  const router = useRouter()
  const [tab, setTab] = useState<'portfolio' | 'qa'>('portfolio')
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    if (action === 'reject' && !rejectReason.trim()) return alert('请填写驳回理由！')
    setLoadingId(id)
    
    let res;
    if (tab === 'portfolio') {
      res = action === 'approve' ? await approvePortfolio(id) : await rejectPortfolio(id, rejectReason)
    } else {
      res = action === 'approve' ? await approveQuestion(id) : await rejectQuestion(id, rejectReason)
    }
    
    setLoadingId(null)
    if (res.success) {
      setRejectReason('')
      router.refresh()
    } else alert(res.error)
  }

  const currentList = tab === 'portfolio' ? portfolios : questions

  return (
    <div>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        <button onClick={() => setTab('portfolio')} style={{ padding: '10px 24px', borderRadius: '100px', background: tab === 'portfolio' ? 'var(--cyan)' : 'transparent', color: tab === 'portfolio' ? '#05070d' : 'var(--text-secondary)', border: '1px solid var(--border-subtle)', cursor: 'pointer', fontWeight: 'bold' }}>待审作品 ({portfolios.length})</button>
        <button onClick={() => setTab('qa')} style={{ padding: '10px 24px', borderRadius: '100px', background: tab === 'qa' ? 'var(--cyan)' : 'transparent', color: tab === 'qa' ? '#05070d' : 'var(--text-secondary)', border: '1px solid var(--border-subtle)', cursor: 'pointer', fontWeight: 'bold' }}>待审问答 ({questions.length})</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {currentList.map(item => (
          <div key={item.id} className="ui-card" style={{ padding: '24px', background: 'var(--surface-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>{item.title}</h3>
              <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>作者ID: {item.user_id?.slice(0,8)}... | 时间: {new Date(item.created_at).toLocaleString()}</span>
            </div>
            
            <div style={{ padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--border-subtle)', marginBottom: '20px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              {tab === 'portfolio' ? item.description || item.content : item.content}
              {tab === 'portfolio' && item.file_url && (
                <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--cyan)' }}>包含文件：{item.file_url.split('/').pop()}</div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button onClick={() => handleAction(item.id, 'approve')} disabled={loadingId === item.id} style={{ padding: '10px 24px', background: 'var(--green)', color: '#05070d', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>✓ 通过发布</button>
              
              <div style={{ flex: 1, display: 'flex', gap: '12px' }}>
                <input value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="填写驳回理由（必填）..." style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ff4444', background: 'rgba(255,68,68,0.05)', color: 'white' }} />
                <button onClick={() => handleAction(item.id, 'reject')} disabled={loadingId === item.id} style={{ padding: '10px 24px', background: 'transparent', color: '#ff4444', border: '1px solid #ff4444', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>✕ 驳回</button>
              </div>
            </div>
          </div>
        ))}
        {currentList.length === 0 && (
          <div className="ui-card" style={{ textAlign: 'center', padding: '60px', borderStyle: 'dashed' }}>
            <p style={{ color: 'var(--text-dim)' }}>太棒了！当前没有待审核的内容。</p>
          </div>
        )}
      </div>
    </div>
  )
}