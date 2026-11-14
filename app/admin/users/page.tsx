import { createClient } from '@/lib/supabase/server'
import UsersClient from './UsersClient'

export const instant = false

export default async function AdminUsersPage() {
  const supabase = await createClient()
  // 获取所有用户数据
  const { data: users } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
  
  return (
    <UsersClient initialUsers={users || []} />
  )
}