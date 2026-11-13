'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// 添加作品（绑定当前用户）
export async function createMyPortfolio(data: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { success: false, error: '未登录' }

  const { error } = await supabase.from('portfolios').insert({
    ...data,
    user_id: user.id // 强制绑定当前用户
  })
  
  if (error) return { success: false, error: error.message }
  
  revalidatePath('/dashboard/portfolio')
  revalidatePath('/portfolio') // 同步刷新前台作品广场
  return { success: true }
}

// 删除作品（校验权限，只能删自己的）
export async function deleteMyPortfolio(id: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { success: false, error: '未登录' }

  // 核心防御：必须带上 user_id 过滤，防止恶意删除别人的
  const { error } = await supabase
    .from('portfolios')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id) 
  
  if (error) return { success: false, error: error.message }
  
  revalidatePath('/dashboard/portfolio')
  revalidatePath('/portfolio')
  return { success: true }
}