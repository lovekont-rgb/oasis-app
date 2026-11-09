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
// --- 以下是新增的周刊和问答 Actions ---

export async function createWeekly(formData: FormData) {
  const supabase = await createClient()
  const vol = formData.get('vol') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string

  if (!vol || !title || !description) return { success: false, error: '必填字段不能为空。' }

  const { error } = await supabase.from('community_weekly').insert({ vol, title, description })
  if (error) return { success: false, error: error.message }
  
  revalidatePath('/admin/community')
  revalidatePath('/community')
  return { success: true }
}

export async function deleteWeeklyAction(formData: FormData): Promise<void> {
  const id = Number(formData.get('id'))
  const supabase = await createClient()
  await supabase.from('community_weekly').delete().eq('id', id)
  revalidatePath('/admin/community')
  revalidatePath('/community')
}

export async function createFaq(formData: FormData) {
  const supabase = await createClient()
  const question = formData.get('question') as string
  const answer = formData.get('answer') as string

  if (!question || !answer) return { success: false, error: '必填字段不能为空。' }

  const { error } = await supabase.from('community_faqs').insert({ question, answer })
  if (error) return { success: false, error: error.message }
  
  revalidatePath('/admin/community')
  revalidatePath('/community')
  return { success: true }
}

export async function deleteFaqAction(formData: FormData): Promise<void> {
  const id = Number(formData.get('id'))
  const supabase = await createClient()
  await supabase.from('community_faqs').delete().eq('id', id)
  revalidatePath('/admin/community')
  revalidatePath('/community')
}