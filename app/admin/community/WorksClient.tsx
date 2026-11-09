'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  createWork, deleteWorkAction, 
  createWeekly, deleteWeeklyAction, 
  createFaq, deleteFaqAction 
} from './actions'

export default function CommunityClient({ works, weekly, faqs }: { works: any[], weekly: any[], faqs: any[] }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'works' | 'weekly' | 'faqs'>('works')

  const worksRef = useRef<HTMLFormElement>(null)
  const weeklyRef = useRef<HTMLFormElement>(null)
  const faqsRef = useRef<HTMLFormElement>(null)

  const handleCreate = async (e: any, action: any, formRef: any) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    try {
      const res = await action(formData)
      if (res.success) {
        alert('发布成功！')
        formRef.current?.reset()
        router.refresh()
      } else {
        alert('失败: ' + res.error)
      }
    } catch (err: any) {
      alert('异常: ' + err.message)
    }
  }

  // 通用输入框样式
  const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white', marginBottom: '12px' }

  return (
    <div>
      {/* Tab 切换按钮 */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button onClick={() => setActiveTab('works')} style={{ padding: '8px 20px', borderRadius: '100px', background: activeTab === 'works' ? 'var(--cyan)' : 'transparent', color: activeTab === 'works' ? '#05070d' : 'var(--text-secondary)', border: '1px solid var(--border-subtle)', cursor: 'pointer', fontWeight: 'bold' }}>作品广场</button>
        <button onClick={() => setActiveTab('weekly')} style={{ padding: '8px 20px', borderRadius: '100px', background: activeTab === 'weekly' ? 'var(--cyan)' : 'transparent', color: activeTab === 'weekly' ? '#05070d' : 'var(--text-secondary)', border: '1px solid var(--border-subtle)', cursor: 'pointer', fontWeight: 'bold' }}>AI 周刊</button>
        <button onClick={() => setActiveTab('faqs')} style={{ padding: '8px 20px', borderRadius: '100px', background: activeTab === 'faqs' ? 'var(--cyan)' : 'transparent', color: activeTab === 'faqs' ? '#05070d' : 'var(--text-secondary)', border: '1px solid var(--border-subtle)', cursor: 'pointer', fontWeight: 'bold' }}>问答互助</button>
        <Link href="/admin/prompts" style={{ padding: '8px 20px', borderRadius: '100px', border: '1px dashed var(--cyan)', color: 'var(--cyan)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>去管理提示词库 ↗</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
        
        {/* ============ 板块 1：作品广场 ============ */}
        {activeTab === 'works' && (
          <>
            <div className="ui-card" style={{ height: 'fit-content' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--cyan)' }}>发布新作品</h3>
              <form ref={worksRef} onSubmit={(e) => handleCreate(e, createWork, worksRef)}>
                <input name="title" placeholder="作品标题" required style={inputStyle} />
                <input name="author" placeholder="作者昵称" style={inputStyle} />
                <textarea name="description" placeholder="作品描述..." required rows={4} style={{ ...inputStyle, resize: 'vertical' }}></textarea>
                <button type="submit" style={{ width: '100%', padding: '12px', background: 'var(--cyan)', color: '#05070d', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', border: 'none' }}>确认发布</button>
              </form>
            </div>
            <div className="ui-card">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>作品列表 ({works.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '600px', overflowY: 'auto' }}>
                {works.map(work => (
                  <div key={work.id} style={{ padding: '16px', background: 'var(--bg-void)', border: '1px solid var(--border-subtle)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontWeight: 'bold' }}>{work.title}</h4>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{work.description}</p>
                    </div>
                    <form action={deleteWorkAction}><input type="hidden" name="id" value={work.id} /><button type="submit" style={{ border: '1px solid #ff4444', color: '#ff4444', padding: '6px 12px', borderRadius: '6px', background: 'transparent', cursor: 'pointer' }}>删除</button></form>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ============ 板块 2：AI 周刊 ============ */}
        {activeTab === 'weekly' && (
          <>
            <div className="ui-card" style={{ height: 'fit-content' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--cyan)' }}>发布新周刊</h3>
              <form ref={weeklyRef} onSubmit={(e) => handleCreate(e, createWeekly, weeklyRef)}>
                <input name="vol" placeholder="期数 (例如: Vol.05)" required style={inputStyle} />
                <input name="title" placeholder="文章标题" required style={inputStyle} />
                <textarea name="description" placeholder="文章简介..." required rows={4} style={{ ...inputStyle, resize: 'vertical' }}></textarea>
                <button type="submit" style={{ width: '100%', padding: '12px', background: 'var(--cyan)', color: '#05070d', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', border: 'none' }}>确认发布</button>
              </form>
            </div>
            <div className="ui-card">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>周刊列表 ({weekly.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '600px', overflowY: 'auto' }}>
                {weekly.map(item => (
                  <div key={item.id} style={{ padding: '16px', background: 'var(--bg-void)', border: '1px solid var(--border-subtle)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ color: 'var(--cyan)', fontSize: '12px', fontWeight: 'bold' }}>{item.vol}</span>
                      <h4 style={{ fontWeight: 'bold' }}>{item.title}</h4>
                    </div>
                    <form action={deleteWeeklyAction}><input type="hidden" name="id" value={item.id} /><button type="submit" style={{ border: '1px solid #ff4444', color: '#ff4444', padding: '6px 12px', borderRadius: '6px', background: 'transparent', cursor: 'pointer' }}>删除</button></form>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ============ 板块 3：问答互助 ============ */}
        {activeTab === 'faqs' && (
          <>
            <div className="ui-card" style={{ height: 'fit-content' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--cyan)' }}>新增问答</h3>
              <form ref={faqsRef} onSubmit={(e) => handleCreate(e, createFaq, faqsRef)}>
                <input name="question" placeholder="问题 (例如: 如何安装ComfyUI?)" required style={inputStyle} />
                <textarea name="answer" placeholder="解答内容..." required rows={4} style={{ ...inputStyle, resize: 'vertical' }}></textarea>
                <button type="submit" style={{ width: '100%', padding: '12px', background: 'var(--cyan)', color: '#05070d', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', border: 'none' }}>确认发布</button>
              </form>
            </div>
            <div className="ui-card">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>问答列表 ({faqs.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '600px', overflowY: 'auto' }}>
                {faqs.map(faq => (
                  <div key={faq.id} style={{ padding: '16px', background: 'var(--bg-void)', border: '1px solid var(--border-subtle)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontWeight: 'bold', marginBottom: '4px' }}>{faq.question}</h4>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{faq.answer}</p>
                    </div>
                    <form action={deleteFaqAction}><input type="hidden" name="id" value={faq.id} /><button type="submit" style={{ border: '1px solid #ff4444', color: '#ff4444', padding: '6px 12px', borderRadius: '6px', background: 'transparent', cursor: 'pointer' }}>删除</button></form>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  )
}