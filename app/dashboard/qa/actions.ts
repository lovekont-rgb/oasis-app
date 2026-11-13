'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteMyQuestion(id: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: '未登录' }

  const { error } = await supabase
    .from('community_questions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id) // 👈 安全限制：只能删自己的

  if (error) return { success: false, error: error.message }
  
  revalidatePath('/dashboard/qa')
  revalidatePath('/community/qa')
  return { success: true }
}