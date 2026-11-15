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

  // 如果已登录，检查是否被封禁
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role, is_banned').eq('id', user.id).single()
    
    // 🚨 核心防线：如果被封禁，强制登出并踢回登录页
    if (profile?.is_banned) {
      await supabase.auth.signOut()
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      // 可以在 url 里带个提示参数
      url.searchParams.set('error', 'banned') 
      return NextResponse.redirect(url)
    }

      // 2. 管理员权限拦截
  if (path.startsWith('/admin')) {
    if (path === '/admin/login') return response;

    // 🚀 极速通道：如果是超管，直接放行，不去查数据库，省时间！
    if (user?.email === 'sj2282@sina.com') {
      return response;
    }

    // 如果是其他人，再去查数据库验证角色
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id || '').single()
    
    const isAdmin = profile?.role === 'admin'

    if (!isAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    // 🚨 核心防线：普通管理员试图越权访问“用户权限管理”页面，直接踢回后台首页
    if (path.startsWith('/admin/users')) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    }
  }
  } else {
    // 未登录用户拦截
    if (path.startsWith('/learn') || path.startsWith('/dashboard') || path.startsWith('/admin')) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}