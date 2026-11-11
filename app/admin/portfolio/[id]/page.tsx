import PortfolioForm from '../PortfolioForm'
import { updatePortfolio } from '../actions'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const instant = false

export default async function EditPortfolioPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const id = Number(resolvedParams.id)
  const supabase = await createClient()
  const { data } = await supabase.from('portfolios').select('*').eq('id', id).single()
  
  if (!data) notFound()
  const updateActionWithId = updatePortfolio.bind(null, id)

  return (
    <div>
      <Link href="/admin/portfolio" style={{ color: 'var(--cyan)', display: 'inline-block', marginBottom: '20px' }}>← 返回列表</Link>
      <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '32px' }}>编辑作品</h1>
      <PortfolioForm initialData={data} action={updateActionWithId} />
    </div>
  )
}