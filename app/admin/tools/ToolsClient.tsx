'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createTool, deleteToolAction } from './actions'

export default function ToolsClient({ initialTools }: { initialTools: any[] }) {
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()
  
  // 👇 新增：用于控制当前选中的分类
  const [activeCat, setActiveCat] = useState('all')

  // 👇 新增：定义分类列表
  const categories = [
    { key: 'all', label: '全部' },
    { key: 'text', label: '对话 / 文本' },
    { key: 'image', label: '图像' },
    { key: 'video', label: '视频' },
    { key: 'code', label: '编程 / Agent' },
    { key: 'audio', label: '音频 / 音乐' },
    { key: 'office', label: '办公 / 效率' }
  ]

  // 👇 新增：根据选中的分类过滤数据
  const filteredTools = initialTools.filter(tool => 
    activeCat === 'all' ? true : tool.category === activeCat
  )

  const handleSubmit = async (formData: FormData) => {
    try {
      const result = await createTool(formData)
      if (result.success) {
        alert('发布成功！')
        formRef.current?.reset()
        router.refresh()
      } else {
        alert('发布失败: ' + result.error)
      }
    } catch (err: any) {
      alert('请求异常: ' + err.message)
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
      
      {/* 左侧：新增表单 */}
      <div className="ui-card" style={{ height: 'fit-content' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--cyan)' }}>上架新工具</h3>
        <form ref={formRef} action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', display: 'block', marginBottom: '6px', color: 'var(--text-secondary)' }}>工具名称</label>
            <input name="name" required placeholder="例如：ChatGPT" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white' }} />
          </div>
          <div>
            <label style={{ fontSize: '13px', display: 'block', marginBottom: '6px', color: 'var(--text-secondary)' }}>所属分类</label>
            <select name="category" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white' }}>
              <option value="text">对话 / 文本</option>
              <option value="image">图像</option>
              <option value="video">视频</option>
              <option value="code">编程 / Agent</option>
              <option value="audio">音频 / 音乐</option>
              <option value="office">办公 / 效率</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '13px', display: 'block', marginBottom: '6px', color: 'var(--text-secondary)' }}>定价模式</label>
            <select name="pricing" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white' }}>
              <option value="free">Free (免费)</option>
              <option value="paid">Paid (付费)</option>
              <option value="oss">Open (开源)</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '13px', display: 'block', marginBottom: '6px', color: 'var(--text-secondary)' }}>一句话描述</label>
            <textarea name="description" required rows={4} placeholder="简单介绍这个工具的作用..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white', resize: 'vertical' }}></textarea>
          </div>
          <button type="submit" style={{ padding: '12px', background: 'var(--cyan)', color: '#05070d', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', border: 'none', marginTop: '8px' }}>
            确认上架
          </button>
        </form>
      </div>

      {/* 右侧：数据列表 */}
      <div className="ui-card">
        {/* 👇 动态显示当前分类的数量 */}
        <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>
          已上架工具 {activeCat !== 'all' && `- ${categories.find(c => c.key === activeCat)?.label}`} ({filteredTools.length})
        </h3>

        {/* 👇 新增：Tab 分类切换栏 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCat(cat.key)}
              style={{
                padding: '6px 14px', borderRadius: '100px', fontSize: '13px', cursor: 'pointer',
                transition: '0.3s', border: '1px solid',
                borderColor: activeCat === cat.key ? 'var(--cyan)' : 'var(--border-subtle)',
                background: activeCat === cat.key ? 'var(--cyan)' : 'transparent',
                color: activeCat === cat.key ? '#05070d' : 'var(--text-secondary)',
                fontWeight: activeCat === cat.key ? 'bold' : 'normal'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '600px', overflowY: 'auto', paddingRight: '8px' }}>
          {/* 👇 渲染过滤后的数据 */}
          {filteredTools.map((tool) => (
            <div key={tool.id} style={{ padding: '16px', background: 'var(--bg-void)', border: '1px solid var(--border-subtle)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '4px' }}>{tool.name}</h4>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{tool.category} · {tool.pricing}</span>
              </div>
              
              <form action={deleteToolAction}>
                <input type="hidden" name="id" value={tool.id} />
                <button type="submit" style={{ background: 'transparent', border: '1px solid #ff4444', color: '#ff4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', transition: '0.2s' }}>
                  下架
                </button>
              </form>
            </div>
          ))}
          {filteredTools.length === 0 && <p style={{ color: 'var(--text-dim)' }}>该分类下暂无工具。</p>}
        </div>
      </div>

    </div>
  )
}