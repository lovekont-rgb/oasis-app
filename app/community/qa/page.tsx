import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import QaClient from './QaClient'

export const instant = false

export default async function QaPage() {
  const supabase = await createClient()
  const { data: questions } = await supabase.from('community_questions').select('*').order('created_at', { ascending: false })

  return (
    <main className="page-container" style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
        <Link href="/community" style={{ color: 'var(--cyan)' }}>社区</Link> / 问答与互助
      </div>

      <div className="ui-badge"><span className="ui-badge-dot"></span>Q&A BOARD</div>
      <h1 className="ui-title">问答 <span className="ui-title-gradient">与互助</span></h1>
      <p className="ui-subtitle">遇到卡点不要慌，留下你的问题，老师与热心同学会为你解答。</p>

      <QaClient questions={questions || []} />
    </main>
  )
}