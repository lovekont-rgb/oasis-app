'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('系统运行异常:', error)
  }, [error])

  return (
    <main className="page-container" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      
      <style dangerouslySetInnerHTML={{__html: `
        .err-500 {
          font-family: 'Orbitron', monospace;
          font-size: clamp(6rem, 15vw, 10rem);
          font-weight: 900;
          line-height: 1;
          margin-bottom: 20px;
          color: transparent;
          -webkit-text-stroke: 2px var(--warn);
          position: relative;
          letter-spacing: 10px;
          text-shadow: 0 0 20px rgba(255, 180, 60, 0.4), 0 0 40px rgba(255, 180, 60, 0.2);
          animation: glitch-pulse 3s infinite alternate;
        }
        @keyframes glitch-pulse {
          0% { text-shadow: 0 0 10px rgba(255,180,60,0.2); -webkit-text-stroke-color: rgba(255,180,60,0.5); }
          100% { text-shadow: 0 0 30px rgba(255,180,60,0.8); -webkit-text-stroke-color: rgba(255,180,60,1); }
        }
        .err-terminal {
          background: rgba(10, 15, 28, 0.8);
          border: 1px solid rgba(255, 180, 60, 0.2);
          border-radius: 8px;
          padding: 20px;
          width: 100%;
          max-width: 600px;
          text-align: left;
          font-family: 'Orbitron', monospace;
          font-size: 13px;
          color: var(--text-secondary);
          box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
        }
        .err-warn { color: var(--warn); font-weight: bold; }
        .err-red { color: #ff4444; }
        .err-cursor {
          display: inline-block; width: 8px; height: 14px;
          background: var(--warn); vertical-align: middle;
          animation: blink 1s step-end infinite;
        }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}} />

      <div className="ui-badge" style={{ borderColor: 'var(--warn)', color: 'var(--warn)', background: 'rgba(255, 180, 60, 0.1)', marginBottom: '24px' }}>
        <span className="ui-badge-dot" style={{ background: 'var(--warn)', boxShadow: '0 0 10px var(--warn)' }}></span>
        SYSTEM ERROR: 500
      </div>

      <h1 className="err-500">500</h1>

      <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>
        网络开小差了
      </h2>
      
      <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.8, maxWidth: '480px', margin: '0 auto 40px' }}>
        服务器连接超时或系统发生异常。请检查您的网络连接，稍后再试。
      </p>

      <div className="err-terminal" style={{ marginBottom: '40px' }}>
        <p><span className="err-warn">guest@oasis:~$</span> ping api.oasis.com</p>
        <p className="err-red">Error: Network unreachable or Request Timeout.</p>
        {error?.message && <p className="err-red">Detail: {error.message}</p>}
        <p><span className="err-warn">guest@oasis:~$</span> <span className="err-cursor"></span></p>
      </div>

      <div style={{ display: 'flex', gap: '16px' }}>
        <button 
          onClick={() => reset()} 
          style={{ padding: '12px 32px', borderRadius: '100px', background: 'linear-gradient(120deg, var(--warn), #ffd700)', color: '#05070d', fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 0 20px rgba(255,180,60,0.3)' }}
        >
          重新加载 / 重试
        </button>
        <Link href="/" style={{ padding: '12px 32px', borderRadius: '100px', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontWeight: 'bold', textDecoration: 'none', background: 'transparent' }}>
          返回安全区（首页）
        </Link>
      </div>

    </main>
  )
}