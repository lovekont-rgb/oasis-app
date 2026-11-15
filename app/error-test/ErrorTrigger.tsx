'use client'

import { useState } from 'react'

export default function ErrorTrigger() {
  const [shouldCrash, setShouldCrash] = useState(false)

  if (shouldCrash) {
    // 在客户端组件中抛出错误，一定会被 error.tsx 捕获
    throw new Error('这是一个测试错误，用来验证 error.tsx 界面是否正常工作。')
  }

  return (
    <div style={{ padding: '100px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px', color: 'var(--cyan)' }}>
        网络异常测试区
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>
        点击下方按钮，模拟系统崩溃，验证全局错误界面。
      </p>
      <button 
        onClick={() => setShouldCrash(true)}
        style={{ padding: '12px 32px', background: '#ff4444', color: 'white', borderRadius: '100px', fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 0 20px rgba(255,68,68,0.4)' }}
      >
        点击触发系统崩溃 💥
      </button>
    </div>
  )
}