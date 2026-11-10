import { createClient } from '@/lib/supabase/server'
import LearnClient from './LearnClient'
import { notFound } from 'next/navigation'

export const instant = false

export default async function LearnPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ id: string }>, 
  searchParams: Promise<{ c?: string, l?: string }> 
}) {
  // 获取路由与URL参数
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const courseId = resolvedParams.id
  
  // 获取章节索引和小节索引（如果没有传，默认都是 0）
  const initialChapter = resolvedSearchParams.c ? parseInt(resolvedSearchParams.c) : 0
  const initialLesson = resolvedSearchParams.l ? parseInt(resolvedSearchParams.l) : 0

  const supabase = await createClient()
  const { data: course } = await supabase.from('courses').select('*').eq('id', courseId).single()

  if (!course) {
    notFound()
  }

    return (
    <LearnClient 
      key={`${courseId}-${initialChapter}-${initialLesson}`} // 👈 加上这一行，参数变了就强制重建
      courseId={courseId} 
      course={course} 
      initialChapter={initialChapter}
      initialLesson={initialLesson}
    />
  )
}