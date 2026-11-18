'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(data: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: '未登录' }

  const { error } = await supabase.from('profiles').update({
    username: data.username,
    bio: data.bio,
    skills: data.skills,
    social_links: data.social_links,
    avatar_url: data.avatar_url
  }).eq('id', user.id)

  if (error) return { success: false, error: error.message }
  
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/settings')
  revalidatePath(`/portfolio/author/${data.username}`) // 刷新创作者主页
  return { success: true }
}

export async function updatePassword(newPassword: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  
  if (error) return { success: false, error: error.message }
  return { success: true }
}