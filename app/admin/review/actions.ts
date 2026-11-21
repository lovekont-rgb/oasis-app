'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approveContent(table: 'portfolios' | 'community_questions', id: number) {
  const supabase = await createClient()
  const { error } = await supabase.from(table).update({ status: 'approved' }).eq('id', id)
  
  if (error) return { success: false, error: error.message }
  
  revalidatePath('/admin/review')
  revalidatePath(table === 'portfolios' ? '/portfolio' : '/community/qa')
  return { success: true }
}

export async function rejectContent(table: 'portfolios' | 'community_questions', id: number, reason: string) {
  const supabase = await createClient()
  const { error } = await supabase.from(table).update({ status: 'rejected', reject_reason: reason }).eq('id', id)
  
  if (error) return { success: false, error: error.message }
  
  revalidatePath('/admin/review')
  revalidatePath(table === 'portfolios' ? '/dashboard/portfolio' : '/dashboard/qa')
  return { success: true }
}