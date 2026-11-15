'use client'
import { useEffect } from 'react'

export default function BFCacheGuard() {
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      // 如果页面是从浏览器前进/后退缓存中恢复的
      if (event.persisted) {
        // 直接强制刷新，让服务端重新鉴权。如果退出了，会立刻被踢回登录页
        window.location.reload()
      }
    }
    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [])
  return null
}