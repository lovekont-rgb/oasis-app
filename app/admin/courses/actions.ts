'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCourse(formData: FormData) {
  const supabase = await createClient()
  
  const title = formData.get('title') as string
  const icon = formData.get('icon') as string
  const meta = formData.get('meta') as string
  const description = formData.get('description') as string
  const prereq = formData.get('prereq') as string
  
  // 将文本域的换行符分割成数组，逗号分割成标签数组
  const syllabusRaw = formData.get('syllabus') as string
  const syllabus = syllabusRaw.split('\n').filter(s => s.trim() !== '')
  
  const chipsRaw = formData.get('chips') as string
  const chips = chipsRaw.split(/[,，]/).map(c => c.trim()).filter(c => c !== '')

  if (!title || !icon || !meta || !description) {
    return { success: false, error: '必填字段不能为空。' }
  }

  const { error } = await supabase.from('courses').insert({ 
    title, icon, meta, description, syllabus, prereq, chips 
  })
  
  if (error) return { success: false, error: error.message }
  
  revalidatePath('/admin/courses')
  revalidatePath('/modules')
  return { success: true }
}

export async function deleteCourse(id: number): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('courses').delete().eq('id', id)
  if (error) throw new Error(error.message)
  
  revalidatePath('/admin/courses')
  revalidatePath('/modules')
}

export async function deleteCourseAction(formData: FormData): Promise<void> {
  const id = Number(formData.get('id'))
  if (id) await deleteCourse(id)
}