import { createClient } from '@/lib/supabase/server'

export const instant = false

export default async function ContactPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('site_settings').select('content').eq('key', 'contact_us').single()

  const paragraphs = data?.content.split('\n').filter((p: string) => p.trim() !== '') || ['暂无内容']

  return (
    <main className="page-container" style={{ maxWidth: '900px' }}>
      <div className="ui-badge"><span className="ui-badge-dot"></span>CONTACT US</div>
      <h1 className="ui-title">联系 <span className="ui-title-gradient">我们</span></h1>
      
      <div className="ui-grid-2" style={{ marginTop: '32px', alignItems: 'start' }}>
        {/* 左侧文案 */}
        <div className="ui-card" style={{ padding: '40px' }}>
          {paragraphs.map((para: string, index: number) => (
            <p key={index} style={{ 
              fontSize: '15px', lineHeight: 1.8, color: 'var(--text-secondary)', 
              marginBottom: index === paragraphs.length - 1 ? 0 : '20px' 
            }}>
              {para}
            </p>
          ))}
        </div>

        {/* 右侧简单表单展示 */}
        <div className="ui-card" style={{ padding: '40px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>发送留言</h3>
          <input placeholder="您的称呼" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white', marginBottom: '16px' }} />
          <input placeholder="联系方式 (邮箱/微信)" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white', marginBottom: '16px' }} />
          <textarea placeholder="留言内容..." rows={4} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white', marginBottom: '16px', resize: 'vertical' }}></textarea>
          <button style={{ width: '100%', padding: '12px', background: 'var(--cyan)', color: '#05070d', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>提交留言</button>
        </div>
      </div>
    </main>
  )
}