import AuthForm from '@/app/components/AuthForm'

export const metadata = { title: '注册 | OASIS' }

export default function RegisterPage() {
  return <AuthForm initialMode="register" />
}