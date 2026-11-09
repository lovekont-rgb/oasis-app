'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// 辅助函数：解析视频文本域 (格式: 标题 | 时长 | 链接)
function parseVideos(raw: string) {
  if (!raw) return []
  return raw.split('\n').filter(line => line.trim()).map(line => {
    const [title, duration, url] = line.split('|').map(s => s.trim())
    return { title: title || '未命名视频', duration: duration || '00:00', url: url || '#' }
  })
}

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
    video_list: parseVideos(formData.get('video_list') as string)
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
    video_list: parseVideos(formData.get('video_list') as string)
  }

  const { error } = await supabase.from('courses').update(data).eq('id', id)
  if (error) return { success: false, error: error.message }
  
  revalidatePath('/admin/courses')
  revalidatePath('/modules')
  revalidatePath(`/modules/${id}`)
  return { success: true }
}

export async function deleteCourseAction(formData: FormData): Promise<void> {
  const id = Number(formData.get('id'))
  const supabase = await createClient()
  await supabase.from('courses').delete().eq('id', id)
  revalidatePath('/admin/courses')
  revalidatePath('/modules')
}