import PortfolioForm from '../PortfolioForm'
import { createPortfolio } from '../actions'
import Link from 'next/link'

export const instant = false

export default function NewPortfolioPage() {
  return (
    <div>
      <Link href="/admin/portfolio" style={{ color: 'var(--cyan)', display: 'inline-block', marginBottom: '20px' }}>← 返回列表</Link>
      <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '32px' }}>发布新作品</h1>
      <PortfolioForm action={createPortfolio} />
    </div>
  )
}