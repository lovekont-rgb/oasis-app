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
  
  const router = useRouter()
  const supabase = createClient()

  // 切换 Tab 时顺便清空提示信息
  const switchTab = (mode: boolean) => {
    setIsLogin(mode)
    setMsg('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')

    try {
      if (isLogin) {
        // 登录逻辑
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/') // 登录成功跳转首页（未来可以改成个人中心）
        router.refresh()
      } else {
        // 注册逻辑
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setMsg('注册成功！请直接登录（或前往邮箱验证）。')
        setIsLogin(true) // 注册成功后自动切回登录 Tab
      }
    } catch (error: any) {
      setMsg(error.message || '操作失败，请重试。')
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

        {/* 一键切换 Tab */}
        <div className={styles.tabContainer}>
          <button 
            className={`${styles.tabBtn} ${isLogin ? styles.tabBtnActive : ''}`}
            onClick={() => switchTab(true)}
            type="button"
          >
            登录
          </button>
          <button 
            className={`${styles.tabBtn} ${!isLogin ? styles.tabBtnActive : ''}`}
            onClick={() => switchTab(false)}
            type="button"
          >
            注册
          </button>
        </div>

        {/* 错误或成功提示 */}
        {msg && (
          <div style={{ 
            padding: '12px', marginBottom: '20px', borderRadius: '8px', fontSize: '13px', textAlign: 'center',
            background: msg.includes('成功') ? 'rgba(60, 220, 140, 0.1)' : 'rgba(255, 68, 68, 0.1)',
            color: msg.includes('成功') ? 'var(--green)' : '#ff4444',
            border: `1px solid ${msg.includes('成功') ? 'rgba(60, 220, 140, 0.3)' : 'rgba(255, 68, 68, 0.3)'}`
          }}>
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>电子邮箱</label>
            <input 
              type="email" 
              required 
              placeholder="name@example.com"
              className={styles.inputField}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>密码</label>
            <input 
              type="password" 
              required 
              placeholder="至少 6 位字符"
              className={styles.inputField}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? '正在处理...' : (isLogin ? '登 录' : '注 册')}
          </button>
        </form>

        {/* 底部返回首页 */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link href="/" style={{ fontSize: '13px', color: 'var(--text-dim)', textDecoration: 'none' }}>
            ← 返回网站首页
          </Link>
        </div>

      </div>
    </div>
  )
}