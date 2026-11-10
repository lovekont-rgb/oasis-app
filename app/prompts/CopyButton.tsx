'use client'
import { useState } from 'react'

export default function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={handleCopy} style={{ background: copied ? 'var(--cyan)' : 'rgba(0,212,255,0.1)', color: copied ? '#05070d' : 'var(--cyan)', border: '1px solid var(--cyan)', padding: '6px 16px', borderRadius: '100px', fontSize: '12px', cursor: 'pointer', fontFamily: 'monospace' }}>
      {copied ? '已复制 ✓' : '复制'}
    </button>
  )
}