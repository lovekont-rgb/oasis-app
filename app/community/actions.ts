'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createWork(formData: FormData) {
  const supabase = await createClient()
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const author = formData.get('author') as string || '匿名创作者'

  if (!title || !description) {
    return { success: false, error: '标题和描述不能为空。' }
  }

  const { error } = await supabase.from('community_works').insert({ title, description, author })
  
  if (error) {
    console.error("Insert Error:", error)
    return { success: false, error: error.message }
  }
  
  revalidatePath('/admin/community')
  revalidatePath('/community')
  return { success: true }
}

export async function deleteWork(id: number): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('community_works').delete().eq('id', id)
  if (error) throw new Error(error.message)
  
  revalidatePath('/admin/community')
  revalidatePath('/community')
}

export async function deleteWorkAction(formData: FormData): Promise<void> {
  const id = Number(formData.get('id'))
  if (id) await deleteWork(id)
}