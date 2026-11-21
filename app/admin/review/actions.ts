'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approvePortfolio(id: number) {
  const supabase = await createClient()
  const { error } = await supabase.from('portfolios').update({ status: 'approved' }).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/review'); revalidatePath('/portfolio')
  return { success: true }
}

export async function rejectPortfolio(id: number, reason: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('portfolios').update({ status: 'rejected', reject_reason: reason }).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/review'); revalidatePath('/dashboard/portfolio')
  return { success: true }
}

export async function approveQuestion(id: number) {
  const supabase = await createClient()
  const { error } = await supabase.from('community_questions').update({ status: 'approved' }).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/review'); revalidatePath('/community/qa')
  return { success: true }
}

export async function rejectQuestion(id: number, reason: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('community_questions').update({ status: 'rejected', reject_reason: reason }).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/review'); revalidatePath('/dashboard/qa')
  return { success: true }
}