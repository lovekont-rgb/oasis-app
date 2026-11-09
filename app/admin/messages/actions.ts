'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function replyMessage(id: number, replyText: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('contact_messages')
    .update({ reply: replyText, status: 'replied' })
    .eq('id', id)
    
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/messages')
  return { success: true }
}

export async function toggleHideMessage(id: number, currentStatus: string) {
  const supabase = await createClient()
  const newStatus = currentStatus === 'hidden' ? 'pending' : 'hidden'
  await supabase.from('contact_messages').update({ status: newStatus }).eq('id', id)
  revalidatePath('/admin/messages')
}

export async function deleteMessage(formData: FormData): Promise<void> {
  const id = Number(formData.get('id'))
  const supabase = await createClient()
  await supabase.from('contact_messages').delete().eq('id', id)
  revalidatePath('/admin/messages')
}