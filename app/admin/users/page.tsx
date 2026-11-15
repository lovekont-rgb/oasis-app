import { createClient } from '@/lib/supabase/server'
import UsersClient from './UsersClient'

export const instant = false

export default async function AdminUsersPage() {
  const supabase = await createClient()
  
  // 1. 在服务端直接获取当前操作员的邮箱和用户列表
  const { data: { user } } = await supabase.auth.getUser()
  const { data: users } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
  
  return (
    <UsersClient 
      initialUsers={users || []} 
      currentAdminEmail={user?.email || ''} // 👈 传给前端，解决闪烁
    />
  )
}