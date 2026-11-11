'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function parseData(formData: FormData) {
  const toolsStr = formData.get('tools') as string
  return {
    title: formData.get('title') as string,
    cover_url: formData.get('cover_url') as string,
    author_name: formData.get('author_name') as string,
    category: formData.get('category') as string,
    content: formData.get('content') as string,
    file_url: formData.get('file_url') as string,
    file_type: formData.get('file_type') as string,
    tools: toolsStr ? toolsStr.split(',').map(t => t.trim()) : []
  }
}

export async function createPortfolio(formData: FormData): Promise<void> {
  const supabase = await createClient()
  await supabase.from('portfolios').insert(parseData(formData))
  revalidatePath('/admin/portfolio'); revalidatePath('/portfolio')
  redirect('/admin/portfolio')
}

export async function updatePortfolio(id: number, formData: FormData): Promise<void> {
  const supabase = await createClient()
  await supabase.from('portfolios').update(parseData(formData)).eq('id', id)
  revalidatePath('/admin/portfolio'); revalidatePath('/portfolio')
  revalidatePath(`/portfolio/${id}`)
  redirect('/admin/portfolio')
}

export async function deletePortfolioAction(formData: FormData): Promise<void> {
  const id = Number(formData.get('id'))
  const supabase = await createClient()
  await supabase.from('portfolios').delete().eq('id', id)
  revalidatePath('/admin/portfolio'); revalidatePath('/portfolio')
}