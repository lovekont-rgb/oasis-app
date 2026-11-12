'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

export async function submitQuestion(formData: FormData) {
  const supabase = await createClient()
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const userName = formData.get('user_name') as string || '匿名用户'

  // 尝试获取用户真实 IP 并解析城市
  const headersList = await headers()
  const forwardedFor = headersList.get('x-forwarded-for')
  const realIp = forwardedFor ? forwardedFor.split(',')[0] : '127.0.0.1'
  
  let ipLocation = '未知'
  try {
    // 使用免费 IP 定位 API
    const res = await fetch(`http://ip-api.com/json/${realIp}?lang=zh-CN`)
    const data = await res.json()
    if (data.status === 'success') {
      ipLocation = data.city || data.regionName || '未知'
    }
  } catch (e) {
    console.error('IP 解析失败')
  }

  if (!title || !content) return { success: false, error: '请填写完整信息。' }

  const { error } = await supabase.from('community_questions').insert({
    user_name: userName, title, content, ip_location: ipLocation
  })
  
  if (error) return { success: false, error: error.message }
  
  revalidatePath('/community/qa')
  revalidatePath('/admin/qa')
  return { success: true }
}