import { createClient } from '@/lib/supabase/server'

export const instant = false

export default async function AboutPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('site_settings').select('content').eq('key', 'about_us').single()

  // 将文本按换行符分割成段落
  const paragraphs = data?.content.split('\n').filter((p: string) => p.trim() !== '') || ['暂无内容']

  return (
    <main className="page-container" style={{ maxWidth: '800px' }}>
      <div className="ui-badge"><span className="ui-badge-dot"></span>ABOUT OASIS</div>
      <h1 className="ui-title">关于 <span className="ui-title-gradient">OASIS</span></h1>
      
      <div className="ui-card" style={{ padding: '48px', marginTop: '32px' }}>
        {paragraphs.map((para: string, index: number) => (
          <p key={index} style={{ 
            fontSize: '16px', lineHeight: 1.8, color: 'var(--text-secondary)', 
            marginBottom: index === paragraphs.length - 1 ? 0 : '24px' 
          }}>
            {para}
          </p>
        ))}
      </div>
    </main>
  )
}