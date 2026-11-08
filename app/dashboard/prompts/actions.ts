'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// 1. 新增提示词的方法
export async function addPrompt(formData: FormData): Promise<void> {
  const supabase = await createClient()
  
  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const model = formData.get('model') as string
  const content = formData.get('content') as string

  const { error } = await supabase.from('prompts').insert({
    title, category, model, content
  })

  if (error) {
    console.error(error)
    throw new Error(error.message) // 👈 如果有错，直接抛出异常
  }

  // 刷新页面数据，让新添加的数据立刻显示
  revalidatePath('/dashboard/prompts')
  revalidatePath('/prompts')
}

// 2. 删除提示词的方法
export async function deletePrompt(id: number): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('prompts').delete().eq('id', id)

  if (error) throw new Error(error.message)

  // 刷新页面数据
  revalidatePath('/dashboard/prompts')
  revalidatePath('/prompts')
}

// 3. 专门用于表单调用的删除动作
export async function deletePromptAction(formData: FormData): Promise<void> {
  const id = Number(formData.get('id'))
  if (id) {
    await deletePrompt(id)
  }
}