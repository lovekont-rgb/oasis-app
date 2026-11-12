'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function markLessonComplete(userId: string, courseId: number, lessonTitle: string) {
  const supabase = await createClient()
  
  // 写入进度表
  const { error } = await supabase.from('learning_progress').insert({
    user_id: userId,
    course_id: courseId,
    lesson_title: lessonTitle
  })

  if (error && error.code !== '23505') { // 忽略唯一约束冲突（说明已经标记过了）
    return { success: false, error: error.message }
  }
  
  revalidatePath(`/learn/${courseId}`)
  return { success: true }
}