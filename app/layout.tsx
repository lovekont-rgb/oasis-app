import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { createClient } from '@/lib/supabase/server'
import { Suspense } from 'react'
import NetworkStatus from './components/NetworkStatus'

export const metadata = { title: 'OASIS | 创意无线增长' }

// 优化：只在服务端获取一次，不缓存，保证数据准确且极快
async function NavbarWrapper() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let role = 'user'
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role) role = profile.role
  }

  return <Navbar initialUser={user} userRole={role} />
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('oasis-theme')||'dark';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.setAttribute('data-theme',d?'dark':'light');document.documentElement.setAttribute('data-theme-pref',t);}catch(e){}})();` }} />
      </head>
      <body>
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