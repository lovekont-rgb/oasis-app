import { createClient } from '@/lib/supabase/server'
import ContactForm from './ContactForm' // 👈 引入组件

export const instant = false

export default async function ContactPage() {
  // ... 保留前面获取文案的代码不变 ...

  return (
    <main className="page-container" style={{ maxWidth: '900px' }}>
      {/* ... 保留前面代码 ... */}
      <div className="ui-grid-2" style={{ marginTop: '32px', alignItems: 'start' }}>
        <div className="ui-card" style={{ padding: '40px' }}>
          {/* 左侧文案保留不变 */}
          {paragraphs.map((para: string, index: number) => (
            <p key={index} style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: index === paragraphs.length - 1 ? 0 : '20px' }}>
              {para}
            </p>
          ))}
        </div>

        {/* 👇 右侧直接用组件替换掉原本写死的 input */}
        <ContactForm />
      </div>
    </main>
  )
}