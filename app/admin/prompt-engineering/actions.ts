'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createEngineeringItem(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('prompt_engineering').insert({
    type: formData.get('type') as string,
    title: formData.get('title') as string,
    subtitle: formData.get('subtitle') as string,
    content: formData.get('content') as string,
    sort_order: Number(formData.get('sort_order')) || 0
  })
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/prompt-engineering'); revalidatePath('/prompts')
  return { success: true }
}

export async function deleteEngineeringItemAction(formData: FormData): Promise<void> {
  const id = Number(formData.get('id'))
  const supabase = await createClient()
  await supabase.from('prompt_engineering').delete().eq('id', id)
  revalidatePath('/admin/prompt-engineering'); revalidatePath('/prompts')
}