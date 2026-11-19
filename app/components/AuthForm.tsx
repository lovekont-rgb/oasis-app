'use client'

import { useState } from 'react'
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
  
  const router = useRouter()
  const supabase = createClient()

  const switchTab = (loginMode: boolean) => {
    setIsLogin(loginMode)
    setMsg('')
    setIsSuccess(false)
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
          router.replace('/admin')
        } else {
          router.replace('/dashboard')
        }
        router.refresh() 

      } else {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error

        if (data.user && data.session === null) {
          setIsSuccess(true)
          setMsg('注册成功！请前往邮箱查收验证链接。')
          setIsLogin(true)
          setLoading(false)
        } else if (data.session) {
          setIsSuccess(true)
          setMsg('注册成功，正在自动登录...')
          router.replace('/dashboard')
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
        setMsg(error.message || '操作失败，请检查网络。')
      }
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
          <button className={`${styles.tabBtn} ${isLogin ? styles.tabBtnActive : ''}`} onClick={() => switchTab(true)} type="button" disabled={loading}>登录</button>
          <button className={`${styles.tabBtn} ${!isLogin ? styles.tabBtnActive : ''}`} onClick={() => switchTab(false)} type="button" disabled={loading}>注册</button>
        </div>

        {msg && (
          <div style={{ 
            padding: '12px', marginBottom: '20px', borderRadius: '8px', fontSize: '13px', textAlign: 'center', fontWeight: 'bold',
            background: isSuccess ? 'rgba(60, 220, 140, 0.1)' : 'rgba(255, 68, 68, 0.1)',
            color: isSuccess ? '#3cdc8c' : '#ff4444',
            border: `1px solid ${isSuccess ? 'rgba(60, 220, 140, 0.3)' : 'rgba(255, 68, 68, 0.3)'}`
          }}>
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>电子邮箱</label>
            {/* 👇 加入 autoComplete 阻止浏览器自动填充 */}
            <input type="email" required placeholder="name@example.com" autoComplete="off" className={styles.inputField} value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading || isSuccess} />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>密码</label>
            {/* 👇 new-password 强制禁用密码回填 */}
            <input type="password" required placeholder="至少 6 位字符" autoComplete="new-password" className={styles.inputField} value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading || isSuccess} />
          </div>

          <button 
            type="submit" 
            disabled={loading || isSuccess} 
            className={styles.submitBtn}
            style={{
              background: isSuccess ? 'var(--green)' : 'linear-gradient(120deg, var(--cyan), #4ae0ff)',
              color: '#05070d',
              cursor: (loading || isSuccess) ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {loading ? '处理中...' : isSuccess ? '跳转中...' : (isLogin ? '登 录' : '注 册')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link href="/" style={{ fontSize: '13px', color: 'var(--text-dim)', textDecoration: 'none' }}>← 返回网站首页</Link>
        </div>
      </div>
    </div>
  )
}