'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitMessage(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string
  const contact = formData.get('contact') as string
  const content = formData.get('content') as string

  if (!name || !contact || !content) {
    return { success: false, error: '请填写完整信息。' }
  }

  const { error } = await supabase.from('contact_messages').insert({ name, contact, content })
  
  if (error) return { success: false, error: error.message }
  
  // 刷新后台数据
  revalidatePath('/admin/messages')
  return { success: true }
}