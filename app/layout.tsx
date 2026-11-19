import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { createClient } from '@/lib/supabase/server'
import { Suspense } from 'react'
import NetworkStatus from './components/NetworkStatus'
import BFCacheCleaner from './components/BFCacheCleaner'

export const metadata = { title: 'OASIS | 创意无线增长' }

async function NavbarWrapper() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let role = 'user'
  let avatar_url = null
  
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role, avatar_url').eq('id', user.id).single()
    if (profile) {
      role = profile.role || 'user'
      avatar_url = profile.avatar_url
    }
  }

  // 强制锁定超管权限，防止数据库数据错误
  if (user?.email === 'sj2282@sina.com') {
    role = 'admin'
  }

  return <Navbar initialUser={user} userRole={role} avatarUrl={avatar_url} />
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('oasis-theme')||'dark';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.setAttribute('data-theme',d?'dark':'light');document.documentElement.setAttribute('data-theme-pref',t);}catch(e){}})();` }} />
      </head>
      <body>
        {/* 👇 核心：全局防倒退魔法 */}
        <BFCacheCleaner />
        
        <NetworkStatus />
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