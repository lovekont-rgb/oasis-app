import { type NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // 针对 /tools 路径直接放行，不做任何拦截
  if (request.nextUrl.pathname.startsWith('/tools')) {
    return undefined
  }
  
  // 其他路径保持默认放行
  return undefined
}

// 确保这个配置存在，用于排除静态资源
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}