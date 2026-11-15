'use client'

import { useState, useEffect } from 'react'

export default function NetworkStatus() {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    // 初始检查
    if (typeof window !== 'undefined' && !navigator.onLine) {
      setIsOffline(true)
    }

    // 监听网络断开与恢复事件
    const handleOffline = () => setIsOffline(true)
    const handleOnline = () => setIsOffline(false)

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  if (!isOffline) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: 'rgba(5, 7, 13, 0.92)', backdropFilter: 'blur(20px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '20px', textAlign: 'center', animation: 'fadeIn 0.3s ease'
    }}>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .offline-icon {
          width: 80px; height: 80px; border-radius: 50%;
          background: rgba(255, 68, 68, 0.1); border: 2px dashed #ff4444;
          display: grid; place-items: center; margin-bottom: 24px;
          animation: spin 4s linear infinite;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .offline-card {
          background: rgba(10, 15, 28, 0.9);
          border: 1px solid rgba(255, 68, 68, 0.3);
          border-radius: 16px; padding: 40px; max-width: 500px; width: 100%;
          box-shadow: 0 20px 60px rgba(0,0,0,0.8), inset 0 0 40px rgba(255, 68, 68, 0.05);
        }
        .offline-terminal {
          background: rgba(0,0,0,0.5); border-radius: 8px; padding: 16px;
          text-align: left; font-family: 'Orbitron', monospace; font-size: 13px;
          color: var(--text-secondary); margin: 24px 0;
          border: 1px solid rgba(255, 68, 68, 0.2);
        }
      `}} />

      <div className="offline-card">
        {/* 旋转雷达图标 */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="offline-icon">
            <span style={{ fontSize: '32px', animation: 'spin 4s linear infinite reverse' }}>📡</span>
          </div>
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#ff4444', marginBottom: '12px' }}>
          网络信号丢失
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6 }}>
          系统检测到您的设备已离线。请检查您的 Wi-Fi 或移动网络，恢复连接后即可继续操作。
        </p>

        {/* 终端风格提示 */}
        <div className="offline-terminal">
          <p><span style={{ color: '#ff4444' }}>guest@oasis:~$</span> ping oasis.com</p>
          <p style={{ color: '#ff4444' }}>Error: Network is unreachable.</p>
          <p><span style={{ color: '#ff4444' }}>guest@oasis:~$</span> <span style={{ display: 'inline-block', width: 8, height: 14, background: '#ff4444', verticalAlign: 'middle', animation: 'blink 1s step-end infinite' }}></span></p>
        </div>

        {/* 重试按钮 */}
        <button 
          onClick={() => window.location.reload()}
          style={{ 
            width: '100%', padding: '14px', borderRadius: '100px', 
            background: '#ff4444', color: 'white', fontWeight: 'bold', 
            fontSize: '16px', border: 'none', cursor: 'pointer',
            boxShadow: '0 0 20px rgba(255, 68, 68, 0.4)', transition: '0.3s'
          }}
        >
          重新检测并刷新
        </button>
      </div>

    </div>
  )
}