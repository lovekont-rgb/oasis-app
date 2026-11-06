'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [pref, setPref] = useState('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setPref(localStorage.getItem('oasis-theme') || 'dark')

    // 监听系统外观变化
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
    
    setPref(next)
    localStorage.setItem('oasis-theme', next)
    
    const isDark = next === 'dark' || (next === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    document.documentElement.setAttribute('data-theme-pref', next)
  }

  // 防止服务端渲染与客户端不一致导致闪烁
  if (!mounted) return <div style={{ width: 38, height: 38 }} />

  const icons = { dark: '🌙', light: '☀️', system: '💻' }
  const labels = { dark: '深色', light: '浅色', system: '跟随系统' }

  return (
    <button
      onClick={toggle}
      title={`当前主题：${labels[pref as keyof typeof labels]}`}
      style={{
        width: 38, height: 38, borderRadius: '50%',
        background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
        cursor: 'pointer', fontSize: 16, display: 'grid', placeItems: 'center',
        transition: 'all 0.3s'
      }}
    >
      {icons[pref as keyof typeof icons]}
    </button>
  )
}