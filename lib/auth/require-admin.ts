import { createClient } from '@/lib/supabase/server'

/**
 * 管理员身份校验（服务端）
 *
 * 用途：所有"后台写操作"在真正执行前，必须先调用它。
 * 返回 ok=false 时，调用方直接返回错误，不要继续写数据库。
 *
 * 判定规则：
 * 1. 必须已登录；
 * 2. profiles.role = 'admin'，或者邮箱是站点拥有者（超管）。
 */
export type AdminGuardResult =
  | { ok: true; userId: string; email: string; isOwner: boolean }
  | { ok: false; error: string }

export async function requireAdmin(): Promise<AdminGuardResult> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: '未登录：请先登录管理员账号' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isOwner = user.email === 'sj2282@sina.com'
  const isAdmin = profile?.role === 'admin'

  if (!isOwner && !isAdmin) {
    return { ok: false, error: '无权限：只有管理员可以执行这个操作' }
  }

  return { ok: true, userId: user.id, email: user.email || '', isOwner }
}
