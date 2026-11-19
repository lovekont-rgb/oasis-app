'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

export async function submitQuestion(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: '请先登录' }

  const { data: profile } = await supabase.from('profiles').select('is_muted').eq('id', user.id).single()
  if (profile?.is_muted) return { success: false, error: '您的账号已被禁言，暂时无法发布内容。' }

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const userName = formData.get('user_name') as string || user?.email?.split('@')[0] || '匿名用户'

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
    user_id: user.id, 
    user_name: userName, 
    title, 
    content, 
    ip_location: ipLocation,
    status: 'pending' // 👈 强制设为待审核
  })
  
  if (error) return { success: false, error: error.message }
  revalidatePath('/community/qa'); revalidatePath('/dashboard'); revalidatePath('/dashboard/qa')
  return { success: true }
}