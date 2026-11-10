'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

function parseArray(text: string) {
  return text ? text.split('\n').map(t => t.trim()).filter(t => t !== '') : []
}

function getFormData(formData: FormData) {
  return {
    num: formData.get('num') as string,
    title: formData.get('title') as string,
    subtitle: formData.get('subtitle') as string,
    description: formData.get('description') as string,
    core: formData.get('core') as string,
    practice: formData.get('practice') as string,
    deliverable: formData.get('deliverable') as string,
    deliverable_desc: formData.get('deliverable_desc') as string,
    tools: parseArray(formData.get('tools') as string),
    pass_criteria: parseArray(formData.get('pass_criteria') as string),
    sort_order: Number(formData.get('sort_order')) || 0
  }
}

export async function createPath(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('learning_paths').insert(getFormData(formData))
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/paths'); revalidatePath('/paths')
  return { success: true }
}

export async function updatePath(id: number, formData: FormData): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('learning_paths').update(getFormData(formData)).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/paths'); revalidatePath('/paths')
}

export async function deletePathAction(formData: FormData): Promise<void> {
  const id = Number(formData.get('id'))
  const supabase = await createClient()
  await supabase.from('learning_paths').delete().eq('id', id)
  revalidatePath('/admin/paths'); revalidatePath('/paths')
}