'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

export async function submitQuestion(formData: FormData) {
  const supabase = await createClient()
  
  // 👇 获取当前登录用户
  const { data: { user } } = await supabase.auth.getUser()
  const userId = user?.id || null

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const userName = formData.get('user_name') as string || user?.email?.split('@')[0] || '匿名用户'

  // 获取 IP
  const headersList = await headers()
  const forwardedFor = headersList.get('x-forwarded-for')
  const realIp = forwardedFor ? forwardedFor.split(',')[0] : '127.0.0.1'
  
  let ipLocation = '未知'
  try {
    const res = await fetch(`http://ip-api.com/json/${realIp}?lang=zh-CN`)
    const data = await res.json()
    if (data.status === 'success') ipLocation = data.city || data.regionName || '未知'
  } catch (e) {}

  if (!title || !content) return { success: false, error: '请填写完整信息。' }

  const { error } = await supabase.from('community_questions').insert({
    user_id: userId, // 👈 绑定用户ID
    user_name: userName, 
    title, 
    content, 
    ip_location: ipLocation
  })
  
  if (error) return { success: false, error: error.message }
  
  revalidatePath('/community/qa')
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/qa')
  return { success: true }
}