'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// 1. 新增提示词
export async function createPrompt(formData: FormData) {
  const supabase = await createClient()
  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const model = formData.get('model') as string
  const content = formData.get('content') as string

  // 如果字段为空，直接返回错误
  if (!title || !category || !model || !content) {
    return { success: false, error: '所有字段都必须填写。' }
  }

  const { error } = await supabase.from('prompts').insert({ title, category, model, content })
  
  if (error) {
    console.error('Supabase Insert Error:', error) // 这个会在 Vercel 的后台日志显示
    return { success: false, error: error.message }
  }
  
  revalidatePath('/admin/prompts')
  revalidatePath('/prompts')
  return { success: true }
}

// 2. 删除提示词（保持不变）
export async function deletePrompt(id: number): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('prompts').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/prompts')
  revalidatePath('/prompts')
}

// 3. 删除动作表单封装（保持不变）
export async function deletePromptAction(formData: FormData): Promise<void> {
  const id = Number(formData.get('id'))
  if (id) {
    await deletePrompt(id)
  }
}