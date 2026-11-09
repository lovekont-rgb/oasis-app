'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateSiteSetting(key: string, content: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('site_settings').update({ content, updated_at: new Date().toISOString() }).eq('key', key)
  
  if (error) return { success: false, error: error.message }
  
  revalidatePath('/about')
  revalidatePath('/contact')
  revalidatePath(`/admin/site/${key === 'about_us' ? 'about' : 'contact'}`)
  return { success: true }
}