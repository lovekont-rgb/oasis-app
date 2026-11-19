'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createMyPortfolio(data: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { success: false, error: '未登录' }

  const { data: profile } = await supabase.from('profiles').select('is_muted').eq('id', user.id).single()
  if (profile?.is_muted) return { success: false, error: '您的账号已被禁言，暂时无法发布作品。' }

  const { error } = await supabase.from('portfolios').insert({
    ...data,
    user_id: user.id,
    status: 'pending' // 👈 强制设为待审核
  })
  
  if (error) return { success: false, error: error.message }
  
  revalidatePath('/dashboard/portfolio')
  revalidatePath('/portfolio')
  return { success: true }
}

export async function deleteMyPortfolio(id: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: '未登录' }

  const { error } = await supabase.from('portfolios').delete().eq('id', id).eq('user_id', user.id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/portfolio'); revalidatePath('/portfolio')
  return { success: true }
}

export async function updateMyPortfolio(id: number, data: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: '未登录' }

  const { error } = await supabase.from('portfolios')
    .update({ ...data, status: 'pending' }) // 👈 修改后重新进入待审核
    .eq('id', id).eq('user_id', user.id)
  
  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/portfolio'); revalidatePath(`/portfolio/${id}`); revalidatePath('/portfolio')
  return { success: true }
}