import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'OASIS | 创意无线增长' }

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  // 👇 在服务端直接获取用户
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('oasis-theme')||'dark';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.setAttribute('data-theme',d?'dark':'light');document.documentElement.setAttribute('data-theme-pref',t);}catch(e){}})();` }} />
      </head>
      <body>
        {/* 👇 把 user 传给 Navbar */}
        <Navbar initialUser={user} />
        <div style={{ paddingTop: '90px', minHeight: 'calc(100vh - 300px)' }}>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}