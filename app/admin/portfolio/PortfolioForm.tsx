'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function PortfolioForm({ initialData, action }: { initialData?: any, action: (formData: FormData) => void }) {
  const supabase = createClient()
  const [uploading, setUploading] = useState(false)
  const [fileUrl, setFileUrl] = useState(initialData?.file_url || '')
  const [fileType, setFileType] = useState(initialData?.file_type || 'video')

  // 核心：处理文件上传与 20M/50M 大小限制
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 判断文件类型
    const isPdf = file.type === 'application/pdf'
    const isMp4 = file.type === 'video/mp4'
    if (!isPdf && !isMp4) return alert('只支持 PDF 或 MP4 格式！')

    // 限制大小
    const sizeMB = file.size / (1024 * 1024)
    if (isPdf && sizeMB > 20) return alert('PDF 文件不能超过 20MB')
    if (isMp4 && sizeMB > 50) return alert('视频文件不能超过 50MB')

    setUploading(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    // 上传到 Supabase Storage
    const { data, error } = await supabase.storage.from('portfolio-files').upload(fileName, file)
    if (error) {
      alert('上传失败: ' + error.message)
    } else {
      const { data: { publicUrl } } = supabase.storage.from('portfolio-files').getPublicUrl(fileName)
      setFileUrl(publicUrl)
      setFileType(isPdf ? 'pdf' : 'video')
    }
    setUploading(false)
  }

  const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white', marginBottom: '16px' }

  return (
    <form action={action} className="ui-card" style={{ padding: '32px' }}>
      <input type="hidden" name="file_url" value={fileUrl} />
      <input type="hidden" name="file_type" value={fileType} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>作品标题</label>
          <input name="title" defaultValue={initialData?.title} required style={inputStyle} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>作者昵称</label>
          <input name="author_name" defaultValue={initialData?.author_name} required style={inputStyle} />
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>分类</label>
          <select name="category" defaultValue={initialData?.category || '作品集'} style={inputStyle}>
            <option value="作品集">作品集</option>
            <option value="优秀作品">优秀作品</option>
            <option value="兼职接单">兼职接单</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>工具标签 (逗号隔开)</label>
          <input name="tools" defaultValue={initialData?.tools?.join(', ')} placeholder="Midjourney, ComfyUI" style={inputStyle} />
        </div>
      </div>

      <label style={{ display: 'block', marginBottom: '8px' }}>封面图链接 (https://...)</label>
      <input name="cover_url" defaultValue={initialData?.cover_url} required style={inputStyle} />

      <label style={{ display: 'block', marginBottom: '8px' }}>创作说明</label>
      <textarea name="content" defaultValue={initialData?.content} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />

      <div style={{ border: '1px dashed var(--cyan)', padding: '20px', borderRadius: '8px', marginBottom: '24px', background: 'rgba(0,212,255,0.05)' }}>
        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--cyan)', fontWeight: 'bold' }}>上传源文件 (PDF < 20MB, MP4 < 50MB)</label>
        <input type="file" accept=".pdf,video/mp4" onChange={handleFileUpload} style={{ fontSize: '14px', color: 'var(--text-secondary)' }} />
        {uploading && <span style={{ marginLeft: '12px', color: 'var(--warn)' }}>正在上传...</span>}
        {fileUrl && !uploading && <span style={{ marginLeft: '12px', color: 'var(--green)' }}>✓ 文件已就绪</span>}
      </div>

      <button type="submit" disabled={uploading} style={{ padding: '14px 32px', background: 'var(--cyan)', color: '#05070d', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
        保存并发布
      </button>
    </form>
  )
}