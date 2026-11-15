import AuthForm from '@/app/components/AuthForm'

export const instant = false // 👈 告诉 Next.js 16 跳过这个页面的预渲染

export const metadata = { title: '注册 | OASIS' }

export default function RegisterPage() {
  return <AuthForm initialMode="register" />
}