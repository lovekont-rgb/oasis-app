import { createClient } from '@/lib/supabase/server'
import LearnClient from './LearnClient'
import { notFound } from 'next/navigation'

// 这里可以写 route segment config 了！
export const instant = false

export default async function LearnPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const courseId = resolvedParams.id

  const supabase = await createClient()
  const { data: course } = await supabase.from('courses').select('*').eq('id', courseId).single()

  if (!course) {
    notFound()
  }

  return <LearnClient courseId={courseId} course={course} />
}