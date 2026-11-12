'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function replyQuestion(id: number, replyText: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('community_questions')
    .update({ admin_reply: replyText, status: 'replied' })
    .eq('id', id)
  
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/qa'); revalidatePath('/community/qa')
  return { success: true }
}

export async function deleteQuestionAction(formData: FormData): Promise<void> {
  const id = Number(formData.get('id'))
  const supabase = await createClient()
  await supabase.from('community_questions').delete().eq('id', id)
  revalidatePath('/admin/qa'); revalidatePath('/community/qa')
}