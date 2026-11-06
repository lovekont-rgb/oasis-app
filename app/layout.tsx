import './globals.css'
import ThemeToggle from './components/ThemeToggle'

export const metadata = {
  title: 'OASIS 工具矩阵',
  description: '创意无线增长',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  var t = localStorage.getItem('oasis-theme') || 'dark';
                  var d = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  document.documentElement.setAttribute('data-theme', d ? 'dark' : 'light');
                  document.documentElement.setAttribute('data-theme-pref', t);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <nav className="navbar">
          <a href="/" className="logo"><span className="logo-mark">O</span>OASIS</a>
          <ThemeToggle />
        </nav>
        {children}
      </body>
    </html>
  )
}