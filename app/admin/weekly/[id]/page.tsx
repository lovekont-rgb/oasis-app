import WeeklyForm from '../WeeklyForm'
import { updateWeekly } from '../actions'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const instant = false

export default async function EditWeeklyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const id = Number(resolvedParams.id)
  const supabase = await createClient()
  const { data } = await supabase.from('community_weekly').select('*').eq('id', id).single()
  
  if (!data) notFound()
  const updateActionWithId = updateWeekly.bind(null, id)

  return (
    <div>
      <Link href="/admin/weekly" style={{ color: 'var(--cyan)', display: 'inline-block', marginBottom: '20px' }}>← 返回列表</Link>
      <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '32px' }}>编辑周刊内容</h1>
      <WeeklyForm initialData={data} action={updateActionWithId} />
    </div>
  )
}