import AuthForm from '@/components/AuthForm'

export const metadata = { title: '登录 | OASIS' }

export default function LoginPage() {
  return <AuthForm initialMode="login" />
}