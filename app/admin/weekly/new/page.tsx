import WeeklyForm from '../WeeklyForm'
import { createWeekly } from '../actions'
import Link from 'next/link'

export const instant = false

export default function NewWeeklyPage() {
  return (
    <div>
      <Link href="/admin/weekly" style={{ color: 'var(--cyan)', display: 'inline-block', marginBottom: '20px' }}>← 返回列表</Link>
      <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '32px' }}>发布新一期周刊</h1>
      <WeeklyForm action={createWeekly} />
    </div>
  )
}