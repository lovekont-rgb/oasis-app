import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { createClient } from '@/lib/supabase/server'
import { Suspense } from 'react'

export const metadata = { title: 'OASIS | 创意无线增长' }

// 1. 将获取用户信息的逻辑抽离成一个独立的组件
async function NavbarWrapper() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return <Navbar initialUser={user} />
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('oasis-theme')||'dark';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.setAttribute('data-theme',d?'dark':'light');document.documentElement.setAttribute('data-theme-pref',t);}catch(e){}})();` }} />
      </head>
      <body>
        {/* 2. 用 Suspense 包裹，并提供导航栏高度的占位，避免布局跳动 */}
        <Suspense fallback={<div style={{ height: '72px', background: 'var(--nav-bg)', borderBottom: '1px solid var(--border-subtle)' }} />}>
          <NavbarWrapper />
        </Suspense>
        
        <div style={{ paddingTop: '90px', minHeight: 'calc(100vh - 300px)' }}>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}