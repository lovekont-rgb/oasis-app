import PromptForm from '../PromptForm'
import { updatePrompt } from '../actions'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const instant = false

export default async function EditPromptPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const id = Number(resolvedParams.id)

  const supabase = await createClient()
  const { data: prompt } = await supabase.from('prompts').select('*').eq('id', id).single()

  if (!prompt) notFound()

  const updateActionWithId = updatePrompt.bind(null, id)

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <Link href="/admin/prompts" style={{ fontSize: '14px', color: 'var(--cyan)', textDecoration: 'none', display: 'inline-block', marginBottom: '16px' }}>← 返回列表</Link>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>编辑提示词</h1>
      </div>
      <div className="ui-card" style={{ padding: '32px' }}>
        <PromptForm initialData={prompt} action={updateActionWithId} />
      </div>
    </div>
  )
}