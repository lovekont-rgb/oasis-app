import { createClient } from '@/lib/supabase/server'
import PortfolioClient from './PortfolioClient'

export const instant = false

export default async function PortfolioPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: portfolios } = await supabase.from('portfolios').select('*').eq('status', 'approved').order('created_at', { ascending: false })

  // 👇 核心：如果已登录，查出他对这些作品的所有历史互动记录
  let userInteractions: any[] = []
  if (user) {
    const { data } = await supabase.from('portfolio_interactions').select('*').eq('user_id', user.id)
    if (data) userInteractions = data
  }

  return (
    <main className="page-container">
      <div className="ui-badge"><span className="ui-badge-dot"></span>GALLERY</div>
      <h1 className="ui-title">作品 <span className="ui-title-gradient">广场</span></h1>
      <p className="ui-subtitle">汇集学员的优秀 AIGC 实践作品、商业交付案例与创意灵感。</p>
      
      <PortfolioClient initialData={portfolios || []} currentUser={user} initialInteractions={userInteractions} />
    </main>
  )
}