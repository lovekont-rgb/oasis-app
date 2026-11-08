import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware' // 注意：如果你的模板里是 lib，请改成 @/lib/...

export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了静态资源。
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}