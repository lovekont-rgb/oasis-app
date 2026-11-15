import AuthForm from '@/app/components/AuthForm'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata = { title: '登录 | OASIS' }

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 👇 如果已经登录，直接跳转到对应页面，根本不让看登录表单
  if (user) {
    if (user.email === 'sj2282@sina.com') redirect('/admin')
    else redirect('/dashboard')
  }

  return <AuthForm initialMode="login" />
}