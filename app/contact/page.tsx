import { createClient } from '@/lib/supabase/server'
import ContactForm from './ContactForm'

export const instant = false

export default async function ContactPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('site_settings').select('content').eq('key', 'contact_us').single()

  // 👈 这里就是缺失的 paragraphs 定义
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

        {/* 右侧表单组件 */}
        <ContactForm />
      </div>
    </main>
  )
}