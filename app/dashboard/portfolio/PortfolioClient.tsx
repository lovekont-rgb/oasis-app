'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { deleteMyPortfolio, createMyPortfolio, updateMyPortfolio } from './actions'

export default function PortfolioClient({ initialData, userEmail }: { initialData: any[], userEmail: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // 状态：用来区分是新建还是编辑
  const [editingId, setEditingId] = useState<number | null>(null)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('作品集')
  const [content, setContent] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [fileType, setFileType] = useState('')

  const openNewModal = () => {
    setEditingId(null)
    setTitle(''); setCategory('作品集'); setContent(''); setFileUrl(''); setFileType('')
    setIsModalOpen(true)
  }

  const openEditModal = (item: any) => {
    setEditingId(item.id)
    setTitle(item.title)
    setCategory(item.category)
    setContent(item.content || '')
    setFileUrl(item.file_url || '')
    setFileType(item.file_type || '')
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定要下架并删除这个作品吗？')) return
    const res = await deleteMyPortfolio(id)
    if (res.success) router.refresh()
    else alert('删除失败: ' + res.error)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const isPdf = file.type === 'application/pdf'
    const isMp4 = file.type === 'video/mp4'
    if (!isPdf && !isMp4) return alert('只支持 PDF 或 MP4 格式！')
    const sizeMB = file.size / (1024 * 1024)
    if (isPdf && sizeMB > 20) return alert('PDF 不能超过 20MB')
    if (isMp4 && sizeMB > 50) return alert('视频不能超过 50MB')

    setLoading(true)
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage.from('portfolio-files').upload(fileName, file)
    if (error) alert('上传失败: ' + error.message)
    else {
      const { data } = supabase.storage.from('portfolio-files').getPublicUrl(fileName)
      setFileUrl(data.publicUrl)
      setFileType(isPdf ? 'pdf' : 'video')
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fileUrl) return alert('请先上传作品文件 (PDF 或 视频)')
    
    setLoading(true)
    const payload = {
      title, category, content, 
      file_url: fileUrl, 
      file_type: fileType,
      cover_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop'
    }

    const res = editingId 
      ? await updateMyPortfolio(editingId, payload)
      : await createMyPortfolio({ ...payload, author_name: userEmail.split('@')[0] })

    setLoading(false)
    if (res.success) {
      setIsModalOpen(false)
      router.refresh()
    } else alert('操作失败: ' + res.error)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 className="ui-title" style={{ fontSize: '2rem', marginBottom: '8px' }}>我的作品</h1>
          <p style={{ color: 'var(--text-secondary)' }}>管理你发布的实战项目与创意作品。</p>
        </div>
        <button onClick={openNewModal} style={{ padding: '12px 28px', background: 'var(--cyan)', color: '#05070d', borderRadius: '100px', fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 0 20px rgba(0,212,255,0.3)', transition: '0.3s' }}>
          + 上传新作品
        </button>
      </div>

      {initialData.length === 0 ? (
        <div className="ui-card" style={{ padding: '80px 20px', textAlign: 'center', borderStyle: 'dashed' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🖼️</div>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>你还没有发布过作品</h3>
          <p style={{ color: 'var(--text-secondary)' }}>点击右上角的按钮，展示你的才华吧！</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {initialData.map(item => (
            <div key={item.id} className="ui-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <Link href={`/portfolio/${item.id}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
                  <img src={item.cover_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'var(--cyan)', color: '#05070d', padding: '2px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 'bold' }}>已发布</div>
                </div>
                <div style={{ padding: '16px 20px', flex: 1 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>{item.title}</h3>
                  <span style={{ fontSize: '12px', color: 'var(--cyan)' }}>{item.category}</span>
                </div>
              </Link>
              
              <div style={{ padding: '0 20px 16px', display: 'flex', gap: '8px' }}>
                <button onClick={() => openEditModal(item)} style={{ flex: 1, padding: '8px', background: 'rgba(0,212,255,0.1)', color: 'var(--cyan)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>编辑</button>
                <button onClick={() => handleDelete(item.id)} style={{ flex: 1, padding: '8px', background: 'rgba(255,68,68,0.1)', color: '#ff4444', border: '1px solid rgba(255,68,68,0.3)', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>删除</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="ui-card" style={{ width: '100%', maxWidth: '600px', padding: '40px', position: 'relative' }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--text-dim)', fontSize: '24px', cursor: 'pointer' }}>×</button>
            
            <h2 className="ui-title" style={{ fontSize: '1.6rem', marginBottom: '24px' }}>{editingId ? '编辑作品' : '上传新作品'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="作品标题" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white' }} />
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white' }}>
                <option value="作品集">作品集</option>
                <option value="优秀作品">优秀作品</option>
                <option value="兼职接单">兼职接单</option>
              </select>
              <textarea value={content} onChange={e => setContent(e.target.value)} required rows={3} placeholder="创作说明..." style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white', resize: 'vertical' }} />
              <div style={{ border: '1px dashed var(--cyan)', padding: '20px', borderRadius: '8px', background: 'rgba(0,212,255,0.05)' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--cyan)', fontWeight: 'bold', fontSize: '14px' }}>上传源文件 (PDF &lt; 20MB, MP4 &lt; 50MB)</label>
                <input type="file" accept=".pdf,video/mp4" onChange={handleFileUpload} style={{ fontSize: '14px', color: 'var(--text-secondary)' }} />
                {loading && <span style={{ marginLeft: '12px', color: 'var(--warn)' }}>正在处理...</span>}
                {fileUrl && !loading && <span style={{ marginLeft: '12px', color: 'var(--green)' }}>✓ 文件已就绪</span>}
              </div>
              <button type="submit" disabled={loading} style={{ padding: '14px', background: 'var(--cyan)', color: '#05070d', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', border: 'none', cursor: 'pointer', marginTop: '8px' }}>
                {loading ? '正在保存...' : (editingId ? '保存修改' : '确认发布')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}