'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function markLessonComplete(courseId: number, lessonTitle: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, error: '请先登录' }

  const { error } = await supabase.from('learning_progress').insert({
    user_id: user.id, // 👈 使用真实用户ID
    course_id: courseId,
    lesson_title: lessonTitle
  })

  if (error && error.code !== '23505') { 
    return { success: false, error: error.message }
  }
  
  revalidatePath(`/learn/${courseId}`)
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/learning')
  return { success: true }
}