'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client' // 注意路径，如果是 lib 请调整
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMsg(error.message)
      else router.push('/dashboard')
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMsg(error.message)
      else setMsg('注册成功！请查收邮件验证（或在 Supabase 关闭邮箱验证）。')
    }
    setLoading(false)
  }

  return (
    <main className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="ui-card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <div className="ui-badge"><span className="ui-badge-dot"></span>OASIS IDENTITY</div>
        <h2 className="ui-title" style={{ fontSize: '1.8rem', marginBottom: '24px' }}>
          {isLogin ? '登录控制台' : '注册新账号'}
        </h2>
        
        {msg && <div style={{ color: msg.includes('成功') ? 'var(--green)' : 'red', marginBottom: '16px', fontSize: '14px' }}>{msg}</div>}

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>电子邮箱</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg-void)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }} />
          </div>
          <div>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>密码</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg-void)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }} />
          </div>
          <button type="submit" disabled={loading} style={{
            padding: '14px', borderRadius: '8px', background: 'linear-gradient(120deg, var(--cyan), #4ae0ff)',
            color: '#05070d', fontWeight: 700, border: 'none', cursor: 'pointer', marginTop: '8px'
          }}>
            {loading ? '处理中...' : (isLogin ? '登 录' : '注 册')}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
          {isLogin ? '还没有账号？' : '已经有账号了？'}
          <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: 'var(--cyan)', cursor: 'pointer', fontWeight: 'bold' }}>
            {isLogin ? '立即注册' : '去登录'}
          </button>
        </div>
        
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link href="/" style={{ fontSize: '13px', color: 'var(--text-dim)' }}>← 返回网站首页</Link>
        </div>
      </div>
    </main>
  )
}