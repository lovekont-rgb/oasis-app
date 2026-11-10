import PromptForm from '../PromptForm'
import { createPrompt } from '../actions'
import Link from 'next/link'

export const instant = false

export default function NewPromptPage() {
  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <Link href="/admin/prompts" style={{ fontSize: '14px', color: 'var(--cyan)', textDecoration: 'none', display: 'inline-block', marginBottom: '16px' }}>← 返回列表</Link>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>发布新提示词</h1>
      </div>
      <div className="ui-card" style={{ padding: '32px' }}>
        <PromptForm action={createPrompt} />
      </div>
    </div>
  )
}