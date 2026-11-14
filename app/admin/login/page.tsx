'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) {
      setMsg(error.message)
      setLoading(false)
      return
    }

    // 登录成功，检查权限
    if (data.user?.email === 'sj2282@sina.com') {
      router.push('/admin')
      router.refresh()
    } else {
      setMsg('非法访问：您没有超级管理员权限！')
      await supabase.auth.signOut() // 如果不是管理员，立刻退登
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-void)', padding: '20px' }}>
      <div className="ui-card" style={{ width: '100%', maxWidth: '400px', padding: '48px', border: '1px solid var(--cyan)', boxShadow: '0 0 50px rgba(0,212,255,0.1)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, var(--violet), var(--cyan))', display: 'grid', placeItems: 'center', color: 'white', fontSize: '24px', fontWeight: 900, margin: '0 auto 16px' }}>O</div>
          <h1 style={{ fontFamily: 'Orbitron', fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>OASIS 核心控制台</h1>
          <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '8px', letterSpacing: '0.1em' }}>RESTRICTED ACCESS ONLY</p>
        </div>

        {msg && (
          <div style={{ padding: '12px', marginBottom: '20px', borderRadius: '8px', fontSize: '13px', textAlign: 'center', background: 'rgba(255,68,68,0.1)', color: '#ff4444', border: '1px solid rgba(255,68,68,0.3)' }}>
            {msg}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input 
            type="email" required placeholder="管理员邮箱" 
            value={email} onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: '14px', borderRadius: '8px', background: 'var(--bg-void)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }} 
          />
          <input 
            type="password" required placeholder="安全密钥" 
            value={password} onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: '14px', borderRadius: '8px', background: 'var(--bg-void)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }} 
          />
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', borderRadius: '8px', background: 'var(--cyan)', color: '#05070d', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '8px' }}>
            {loading ? '认证中...' : '进入系统'}
          </button>
        </form>
      </div>
    </div>
  )
}