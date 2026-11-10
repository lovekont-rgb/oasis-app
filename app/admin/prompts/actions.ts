'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createPrompt(formData: FormData) {
  const supabase = await createClient()
  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const model = formData.get('model') as string
  const content = formData.get('content') as string

  if (!title || !category || !model || !content) {
    return { success: false, error: '所有字段都必须填写。' }
  }

  const { error } = await supabase.from('prompts').insert({ title, category, model, content })
  if (error) return { success: false, error: error.message }
  
  revalidatePath('/admin/prompts'); revalidatePath('/prompts')
  return { success: true }
}

export async function deletePrompt(id: number): Promise<void> {
  const supabase = await createClient()
  await supabase.from('prompts').delete().eq('id', id)
  revalidatePath('/admin/prompts'); revalidatePath('/prompts')
}

export async function deletePromptAction(formData: FormData): Promise<void> {
  const id = Number(formData.get('id'))
  if (id) await deletePrompt(id)
}