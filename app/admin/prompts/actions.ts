'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function parseFormData(formData: FormData) {
  const tagsString = formData.get('tags') as string
  return {
    title: formData.get('title') as string,
    category: formData.get('category') as string,
    model: formData.get('model') as string,
    content: formData.get('content') as string,
    image_url: formData.get('image_url') as string || null,
    tags: tagsString ? tagsString.split(',').map(t => t.trim()).filter(t => t) : []
  }
}

export async function createPrompt(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('prompts').insert(parseFormData(formData))
  if (error) throw new Error(error.message)
  revalidatePath('/admin/prompts'); revalidatePath('/prompts')
  redirect('/admin/prompts')
}

export async function updatePrompt(id: number, formData: FormData): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('prompts').update(parseFormData(formData)).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/prompts'); revalidatePath('/prompts')
  redirect('/admin/prompts')
}

export async function deletePromptAction(formData: FormData): Promise<void> {
  const id = Number(formData.get('id'))
  const supabase = await createClient()
  await supabase.from('prompts').delete().eq('id', id)
  revalidatePath('/admin/prompts'); revalidatePath('/prompts')
}