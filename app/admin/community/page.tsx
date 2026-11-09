import { createClient } from '@/lib/supabase/server'
import CommunityClient from './WorksClient' // 之前文件名叫WorksClient，直接引用即可

export const instant = false

export default async function AdminCommunityPage() {
  const supabase = await createClient()
  
  // 并行拉取三个板块的数据
  const [ { data: works }, { data: weekly }, { data: faqs } ] = await Promise.all([
    supabase.from('community_works').select('*').order('id', { ascending: false }),
    supabase.from('community_weekly').select('*').order('sort_order', { ascending: false }),
    supabase.from('community_faqs').select('*').order('sort_order', { ascending: false })
  ])
  
  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>社区管理</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>在这里统一管理作品广场、AI 周刊和问答互助板块。</p>
      
      <CommunityClient 
        works={works || []} 
        weekly={weekly || []} 
        faqs={faqs || []} 
      />
    </div>
  )
}