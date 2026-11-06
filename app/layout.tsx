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
        {/* 引入独立出来的导航栏 */}
        <Navbar />
        
        {/* 页面的主体内容，加一点顶部内边距给固定的导航栏让位 */}
        <div style={{ paddingTop: '120px', minHeight: 'calc(100vh - 300px)' }}>
          {children}
        </div>

        {/* 引入独立出来的页脚 */}
        <Footer />
      </body>
    </html>
  )
}