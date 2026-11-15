import AuthForm from '@/app/components/AuthForm'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata = { title: '注册 | OASIS' }

export default async function RegisterPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    if (user.email === 'sj2282@sina.com') redirect('/admin')
    else redirect('/dashboard')
  }

  return <AuthForm initialMode="register" />
}