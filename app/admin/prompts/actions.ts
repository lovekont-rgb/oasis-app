'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// 1. 新增提示词
export async function createPrompt(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const model = formData.get('model') as string
  const content = formData.get('content') as string

  const { error } = await supabase.from('prompts').insert({ title, category, model, content })
  
  if (error) throw new Error(error.message)
  
  // 刷新后台列表和前台提示词页面
  revalidatePath('/admin/prompts')
  revalidatePath('/prompts')
}

// 2. 删除提示词
export async function deletePrompt(id: number): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('prompts').delete().eq('id', id)
  
  if (error) throw new Error(error.message)
  
  revalidatePath('/admin/prompts')
  revalidatePath('/prompts')
}
// 3. 专门用于表单调用的删除动作
export async function deletePromptAction(formData: FormData): Promise<void> {
  const id = Number(formData.get('id'))
  if (id) {
    await deletePrompt(id)
  }
}