'use client'

import { useEffect } from 'react'

export default function ThemeToggle() {
  useEffect(() => {
    // 监听系统外观变化（如果是跟随系统模式）
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
    const currentPref = document.documentElement.getAttribute('data-theme-pref') || 'dark'
    const next = ORDER[(ORDER.indexOf(currentPref) + 1) % ORDER.length]
    
    localStorage.setItem('oasis-theme', next)
    
    const isDark = next === 'dark' || (next === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    document.documentElement.setAttribute('data-theme-pref', next)
  }

  return (
    <button 
      onClick={toggle} 
      aria-label="切换主题"
      style={{
        width: 36, height: 36, borderRadius: '50%', background: 'transparent',
        border: '1px solid var(--border-glow)', cursor: 'pointer', 
        display: 'grid', placeItems: 'center', color: 'var(--cyan)', 
        transition: 'all 0.3s', padding: 0
      }}
    >
      {/* 🌙 深色模式图标 */}
      <svg className="theme-icon" data-icon="dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" width="18" height="18">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>

      {/* ☀️ 浅色模式图标 */}
      <svg className="theme-icon" data-icon="light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="18" height="18">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>

      {/* 💻 跟随系统图标 */}
      <svg className="theme-icon" data-icon="system" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="18" height="18">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    </button>
  )
}