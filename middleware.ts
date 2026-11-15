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

    // 处理后台权限
    if (path.startsWith('/admin')) {
      if (path === '/admin/login') return response;

      const isSuperAdmin = user.email === 'sj2282@sina.com'
      const isAdmin = profile?.role === 'admin'

      if (!isSuperAdmin && !isAdmin) {
        const url = request.nextUrl.clone()
        url.pathname = '/admin/login'
        return NextResponse.redirect(url)
      }

      // 普通管理员试图越权访问用户管理
      if (path.startsWith('/admin/users') && !isSuperAdmin) {
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