'use client'
import { useEffect } from 'react'

export default function BFCacheCleaner() {
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      // 如果页面是从浏览器前进/后退缓存中恢复的
      if (event.persisted) {
        // 强制刷新页面，让服务端重新下发最新的登录状态
        window.location.reload()
      }
    }
    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [])
  return null
}