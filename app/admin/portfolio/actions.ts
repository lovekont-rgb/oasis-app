'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createPortfolio(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('portfolios').insert({
    title: formData.get('title') as string,
    cover_url: formData.get('cover_url') as string,
    author_name: formData.get('author_name') as string,
    category: formData.get('category') as string,
  })
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/portfolio'); revalidatePath('/portfolio')
  return { success: true }
}

export async function deletePortfolioAction(formData: FormData): Promise<void> {
  const id = Number(formData.get('id'))
  const supabase = await createClient()
  await supabase.from('portfolios').delete().eq('id', id)
  revalidatePath('/admin/portfolio'); revalidatePath('/portfolio')
}