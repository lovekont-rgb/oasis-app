'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function replyQuestion(id: number, replyText: string) {
  const supabase = await createClient()
  
  if (replyText.length > 1000) {
    return { success: false, error: '回复内容最多 1000 个字' }
  }

  const { error } = await supabase
    .from('community_questions')
    .update({ admin_reply: replyText })
    .eq('id', id)
  
  if (error) return { success: false, error: error.message }
  
  revalidatePath('/admin/qa')
  revalidatePath('/admin/review')
  revalidatePath('/community/qa')
  revalidatePath('/dashboard/qa')
  
  return { success: true }
}

export async function deleteQuestionAction(formData: FormData): Promise<void> {
  const id = Number(formData.get('id'))
  const supabase = await createClient()
  await supabase.from('community_questions').delete().eq('id', id)
  revalidatePath('/admin/qa')
  revalidatePath('/community/qa')
  revalidatePath('/admin/review')
}