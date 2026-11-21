'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approvePortfolio(id: number) {
  const supabase = await createClient()
  const { error } = await supabase.from('portfolios').update({ status: 'approved' }).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/review'); revalidatePath('/portfolio'); revalidatePath('/admin/portfolio')
  return { success: true }
}

export async function rejectPortfolio(id: number, reason: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('portfolios').update({ status: 'rejected', reject_reason: reason }).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/review'); revalidatePath('/dashboard/portfolio'); revalidatePath('/admin/portfolio')
  return { success: true }
}

// 👇 专门给后台作品列表用的表单动作
export async function approvePortfolioForm(formData: FormData) {
  const id = Number(formData.get('id'))
  if (id) await approvePortfolio(id)
}

export async function rejectPortfolioForm(formData: FormData) {
  const id = Number(formData.get('id'))
  const reason = formData.get('reason') as string || '违规内容'
  if (id) await rejectPortfolio(id, reason)
}

export async function approveQuestion(id: number) {
  const supabase = await createClient()
  const { error } = await supabase.from('community_questions').update({ status: 'approved' }).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/review'); revalidatePath('/community/qa'); revalidatePath('/admin/qa')
  return { success: true }
}

export async function rejectQuestion(id: number, reason: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('community_questions').update({ status: 'rejected', reject_reason: reason }).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/review'); revalidatePath('/dashboard/qa'); revalidatePath('/admin/qa')
  return { success: true }
}