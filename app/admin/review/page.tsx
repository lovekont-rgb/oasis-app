import { createClient } from '@/lib/supabase/server'
import ReviewClient from './ReviewClient'

export const instant = false

export default async function AdminReviewPage() {
  const supabase = await createClient()
  
  const [ { data: portfolios }, { data: questions } ] = await Promise.all([
    supabase.from('portfolios').select('*').eq('status', 'pending').order('created_at', { ascending: true }),
    supabase.from('community_questions').select('*').eq('status', 'pending').order('created_at', { ascending: true })
  ])

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>内容安全审核</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>审核用户发布的作品与问答。通过后才对前台公开。</p>
      <ReviewClient portfolios={portfolios || []} questions={questions || []} />
    </div>
  )
}