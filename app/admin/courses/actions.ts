'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCourse(formData: FormData) {
  const supabase = await createClient()
  const data = {
    title: formData.get('title') as string,
    icon: formData.get('icon') as string,
    meta: formData.get('meta') as string,
    description: formData.get('description') as string,
    detailed_description: formData.get('detailed_description') as string,
    prereq: formData.get('prereq') as string,
    syllabus: (formData.get('syllabus') as string).split('\n').filter(s => s.trim() !== ''),
    chips: (formData.get('chips') as string).split(/[,，]/).map(c => c.trim()).filter(c => c !== ''),
    chapters: JSON.parse(formData.get('chapters') as string || '[]')
  }

  const { error } = await supabase.from('courses').insert(data)
  if (error) return { success: false, error: error.message }
  
  revalidatePath('/admin/courses')
  revalidatePath('/modules')
  return { success: true }
}

export async function updateCourse(id: number, formData: FormData) {
  const supabase = await createClient()
  const data = {
    title: formData.get('title') as string,
    icon: formData.get('icon') as string,
    meta: formData.get('meta') as string,
    description: formData.get('description') as string,
    detailed_description: formData.get('detailed_description') as string,
    prereq: formData.get('prereq') as string,
    syllabus: (formData.get('syllabus') as string).split('\n').filter(s => s.trim() !== ''),
    chips: (formData.get('chips') as string).split(/[,，]/).map(c => c.trim()).filter(c => c !== ''),
    chapters: JSON.parse(formData.get('chapters') as string || '[]')
  }

  const { error } = await supabase.from('courses').update(data).eq('id', id)
  if (error) return { success: false, error: error.message }
  
  revalidatePath('/admin/courses')
  revalidatePath('/modules')
  return { success: true }
}

export async function deleteCourseAction(formData: FormData): Promise<void> {
  const id = Number(formData.get('id'))
  const supabase = await createClient()
  await supabase.from('courses').delete().eq('id', id)
  revalidatePath('/admin/courses')
  revalidatePath('/modules')
}