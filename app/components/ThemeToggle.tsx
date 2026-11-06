'use client'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [pref, setPref] = useState('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // 初始化时读取本地存储
    const currentPref = localStorage.getItem('oasis-theme') || 'dark'
    setPref(currentPref)

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      if (localStorage.getItem('oasis-theme') === 'system') {
        document.documentElement.setAttribute('data-theme', mq.matches ? 'dark' : 'light')
      }
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const toggle = () => {
    const ORDER = ['dark', 'light', 'system']
    const next = ORDER[(ORDER.indexOf(pref) + 1) % ORDER.length]
    
    // 更新状态和本地存储
    setPref(next)
    localStorage.setItem('oasis-theme', next)
    
    // 更新 HTML 标签属性
    const isDark = next === 'dark' || (next === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    document.documentElement.setAttribute('data-theme-pref', next)
  }

  // 防止服务端渲染与客户端不一致导致闪烁
  if (!mounted) return <div style={{ width: 36, height: 36 }} />

  const icons = { dark: '🌙', light: '☀️', system: '💻' }

  return (
    <button onClick={toggle} style={{
      width: 36, height: 36, borderRadius: '50%', background: 'transparent',
      border: '1px solid var(--border-glow)', cursor: 'pointer', fontSize: 16,
      display: 'grid', placeItems: 'center', color: 'var(--cyan)', transition: 'all 0.3s'
    }}>
      {icons[pref as keyof typeof icons]}
    </button>
  )
}