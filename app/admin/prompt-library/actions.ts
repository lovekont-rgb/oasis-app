'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createLibraryPrompt(formData: FormData) {
  const supabase = await createClient()
  const tagsString = formData.get('tags') as string
  
  const { error } = await supabase.from('prompt_library').insert({
    title: formData.get('title') as string,
    category_id: Number(formData.get('category_id')), // 关联分类 ID
    model: formData.get('model') as string,
    content: formData.get('content') as string,
    image_url: formData.get('image_url') as string || null,
    tags: tagsString ? tagsString.split(',').map(t => t.trim()) : []
  })
  
  if (error) return { success: false, error: error.message }
  
  revalidatePath('/admin/prompt-library')
  revalidatePath('/prompt-library')
  return { success: true }
}

export async function deleteLibraryPromptAction(formData: FormData): Promise<void> {
  const id = Number(formData.get('id'))
  const supabase = await createClient()
  await supabase.from('prompt_library').delete().eq('id', id)
  
  revalidatePath('/admin/prompt-library')
  revalidatePath('/prompt-library')
}