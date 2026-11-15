'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import styles from './auth.module.css'

export default function AuthForm({ initialMode = 'login' }: { initialMode?: 'login' | 'register' }) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  
  const [msg, setMsg] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isAwaitingVerify, setIsAwaitingVerify] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setEmail('')
        setPassword('')
        setMsg('')
        setIsSuccess(false)
        setIsAwaitingVerify(false)
      }
    }
    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [])

  const switchTab = (loginMode: boolean) => {
    setIsLogin(loginMode)
    setMsg('')
    setIsSuccess(false)
    setIsAwaitingVerify(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    setIsSuccess(false)

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        
        setIsSuccess(true)
        setMsg('登录成功，正在进入...')
        
        if (data.user?.email === 'sj2282@sina.com') {
          router.push('/admin')
        } else {
          router.push('/dashboard')
        }
        router.refresh() 

      } else {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error

        if (data.user && data.session === null) {
          setIsSuccess(true)
          setIsAwaitingVerify(true)
          setMsg('注册成功！请前往邮箱查收验证链接，验证后方可登录。')
        } else if (data.session) {
          setIsSuccess(true)
          setMsg('注册成功，正在自动登录...')
          router.push('/dashboard')
          router.refresh()
        }
      }
    } catch (error: any) {
      setIsSuccess(false)
      if (error.message.includes('Invalid login credentials')) {
        setMsg('邮箱或密码错误，请重试。')
      } else if (error.message.includes('User already registered')) {
        setMsg('该邮箱已注册，请直接登录。')
      } else if (error.message.includes('Password should be at least')) {
        setMsg('密码长度至少需要 6 位。')
      } else {
        setMsg(error.message || '操作失败，请检查网络或配置。')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        
        <h1 className={styles.authTitle}>{isLogin ? '欢迎回来' : '创建账号'}</h1>
        <p className={styles.authSubtitle}>
          {isLogin ? '登录以继续你的 AIGC 学习之旅' : '加入 OASIS，开启创意无限增长'}
        </p>

        <div className={styles.tabContainer}>
          <button className={`${styles.tabBtn} ${isLogin ? styles.tabBtnActive : ''}`} onClick={() => switchTab(true)} type="button">登录</button>
          <button className={`${styles.tabBtn} ${!isLogin ? styles.tabBtnActive : ''}`} onClick={() => switchTab(false)} type="button">注册</button>
        </div>

        {msg && (
          <div style={{ 
            padding: '14px', marginBottom: '24px', borderRadius: '10px', fontSize: '14px', textAlign: 'center', lineHeight: '1.5',
            background: isSuccess ? 'rgba(60, 220, 140, 0.1)' : 'rgba(255, 68, 68, 0.1)',
            color: isSuccess ? '#3cdc8c' : '#ff4444',
            border: `1px solid ${isSuccess ? 'rgba(60, 220, 140, 0.3)' : 'rgba(255, 68, 68, 0.3)'}`
          }}>
            {msg}
          </div>
        )}

        {!isAwaitingVerify ? (
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>电子邮箱</label>
              <input type="email" required placeholder="name@example.com" className={styles.inputField} value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>密码</label>
              <input type="password" required placeholder="至少 6 位字符" className={styles.inputField} value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
            </div>

            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? '正在处理...' : (isLogin ? '登 录' : '注 册')}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>验证邮件已发送</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              请前往 <strong>{email}</strong> 查收验证邮件。<br/>
              点击邮件中的链接激活账号后，即可返回此处登录。
            </p>
            <button onClick={() => switchTab(true)} style={{ marginTop: '24px', background: 'transparent', border: '1px solid var(--cyan)', color: 'var(--cyan)', padding: '10px 24px', borderRadius: '100px', cursor: 'pointer', fontWeight: 'bold' }}>返回登录</button>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Link href="/" style={{ fontSize: '13px', color: 'var(--text-dim)', textDecoration: 'none' }}>← 返回网站首页</Link>
        </div>
      </div>
    </div>
  )
}