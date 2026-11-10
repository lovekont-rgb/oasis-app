'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// 解析数组输入（将多行文本转为数组）
function parseArray(text: string) {
  return text.split('\n').map(t => t.trim()).filter(t => t !== '')
}

// ============ 项目管理 ============
export async function createProject(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('project_items').insert({
    tag: formData.get('tag') as string,
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    deliverables: parseArray(formData.get('deliverables') as string),
    price: formData.get('price') as string,
    unit: formData.get('unit') as string,
    chips: parseArray(formData.get('chips') as string),
    sort_order: Number(formData.get('sort_order')) || 0
  })
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/projects'); revalidatePath('/projects')
  return { success: true }
}

export async function deleteProjectAction(formData: FormData): Promise<void> {
  const id = Number(formData.get('id'))
  const supabase = await createClient()
  await supabase.from('project_items').delete().eq('id', id)
  revalidatePath('/admin/projects'); revalidatePath('/projects')
}

// ============ 市场信号管理 ============
export async function createSignal(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('market_signals').insert({
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    sort_order: Number(formData.get('sort_order')) || 0
  })
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/projects'); revalidatePath('/projects')
  return { success: true }
}

export async function deleteSignalAction(formData: FormData): Promise<void> {
  const id = Number(formData.get('id'))
  const supabase = await createClient()
  await supabase.from('market_signals').delete().eq('id', id)
  revalidatePath('/admin/projects'); revalidatePath('/projects')
}