import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

export const metadata = { title: 'OASIS | 创意无线增长' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('oasis-theme')||'dark';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.setAttribute('data-theme',d?'dark':'light');document.documentElement.setAttribute('data-theme-pref',t);}catch(e){}})();` }} />
      </head>
      <body>
        <Navbar />
        <div style={{ paddingTop: '120px', minHeight: 'calc(100vh - 300px)' }}>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}