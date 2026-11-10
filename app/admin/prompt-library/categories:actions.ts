'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addCategory(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string
  const parentId = formData.get('parent_id') ? Number(formData.get('parent_id')) : null

  if (!name) return { success: false, error: '分类名称不能为空' }

  const { error } = await supabase.from('prompt_categories').insert({ name, parent_id: parentId })
  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/prompt-library/categories')
  revalidatePath('/prompt-library')
  return { success: true }
}

export async function deleteCategory(id: number): Promise<void> {
  const supabase = await createClient()
  await supabase.from('prompt_categories').delete().eq('id', id)
  revalidatePath('/admin/prompt-library/categories')
  revalidatePath('/prompt-library')
}