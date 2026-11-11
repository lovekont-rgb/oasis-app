'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function parseData(formData: FormData) {
  return {
    vol: formData.get('vol') as string,
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    content: formData.get('content') as string,
    cover_url: formData.get('cover_url') as string || null,
    author: formData.get('author') as string || 'OASIS 编辑部',
    read_time: formData.get('read_time') as string || '5 分钟',
    sort_order: Number(formData.get('sort_order')) || 0
  }
}

export async function createWeekly(formData: FormData): Promise<void> {
  const supabase = await createClient()
  await supabase.from('community_weekly').insert(parseData(formData))
  revalidatePath('/admin/weekly'); revalidatePath('/community')
  redirect('/admin/weekly')
}

export async function updateWeekly(id: number, formData: FormData): Promise<void> {
  const supabase = await createClient()
  await supabase.from('community_weekly').update(parseData(formData)).eq('id', id)
  revalidatePath('/admin/weekly'); revalidatePath('/community')
  revalidatePath(`/community/weekly/${id}`)
  redirect('/admin/weekly')
}

export async function deleteWeeklyAction(formData: FormData): Promise<void> {
  const id = Number(formData.get('id'))
  const supabase = await createClient()
  await supabase.from('community_weekly').delete().eq('id', id)
  revalidatePath('/admin/weekly'); revalidatePath('/community')
}