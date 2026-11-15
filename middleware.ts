import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // 1. 未登录用户拦截：保护 /learn, /dashboard 和 /admin
  if (!user && (path.startsWith('/learn') || path.startsWith('/dashboard') || path.startsWith('/admin'))) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 2. 管理员权限拦截
  if (path.startsWith('/admin')) {
    // 如果访问的是专属登录页，直接放行
    if (path === '/admin/login') return response;

    // 查数据库获取角色
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id || '').single()
    
    const isSuperAdmin = user?.email === 'sj2282@sina.com'
    const isAdmin = profile?.role === 'admin'

    // 如果不是超管，也不是普通管理员，踢回管理员登录页
    if (!isSuperAdmin && !isAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    // 🚨 核心防线：如果是普通管理员试图访问“用户权限管理”页面
    if (path.startsWith('/admin/users') && !isSuperAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin' // 直接踢回后台首页
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}