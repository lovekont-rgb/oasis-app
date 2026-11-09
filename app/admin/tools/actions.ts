'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// 1. 新增工具
export async function createTool(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string
  const category = formData.get('category') as string
  const pricing = formData.get('pricing') as string
  const description = formData.get('description') as string

  if (!name || !category || !pricing || !description) {
    return { success: false, error: '所有字段都必须填写。' }
  }

  const { error } = await supabase.from('tools').insert({ name, category, pricing, description })
  
  if (error) {
    console.error('Supabase Insert Error:', error)
    return { success: false, error: error.message }
  }
  
  revalidatePath('/admin/tools')
  revalidatePath('/tools') // 同步刷新前台
  return { success: true }
}

// 2. 删除工具
export async function deleteTool(id: number): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('tools').delete().eq('id', id)
  if (error) throw new Error(error.message)
  
  revalidatePath('/admin/tools')
  revalidatePath('/tools')
}

// 3. 专门用于表单调用的删除动作
export async function deleteToolAction(formData: FormData): Promise<void> {
  const id = Number(formData.get('id'))
  if (id) {
    await deleteTool(id)
  }
}