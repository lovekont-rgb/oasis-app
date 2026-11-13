import { createClient } from '@/lib/supabase/server'
import PortfolioClient from './PortfolioClient'

export const instant = false

export default async function MyPortfolioPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  // 只查询当前登录用户的 user_id 对应的作品
  const { data: works } = await supabase
    .from('portfolios')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <PortfolioClient 
      initialData={works || []} 
      userEmail={user.email || 'user'} 
    />
  )
}