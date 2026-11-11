import { createClient } from '@/lib/supabase/server'
import PortfolioClient from './PortfolioClient' // 👈 确保引入了它

export const instant = false

export default async function PortfolioPage() {
  const supabase = await createClient()
  const { data: portfolios } = await supabase.from('portfolios').select('*').order('created_at', { ascending: false })

  return (
    <main className="page-container">
      <div className="ui-badge"><span className="ui-badge-dot"></span>GALLERY</div>
      <h1 className="ui-title">作品 <span className="ui-title-gradient">广场</span></h1>
      <p className="ui-subtitle">
        汇集学员的优秀 AIGC 实践作品、商业交付案例与创意灵感。在这里，见证从工具使用者到创作者的蜕变。
      </p>
      
      {/* 👈 确保这里使用了它 */}
      <PortfolioClient initialData={portfolios || []} />
    </main>
  )
}