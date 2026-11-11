import { createClient } from '@/lib/supabase/server'
import { deleteWeeklyAction } from './actions'
import Link from 'next/link'

export const instant = false

export default async function AdminWeeklyPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('community_weekly').select('*').order('sort_order', { ascending: false })
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>AI 周刊管理</h1>
          <p style={{ color: 'var(--text-secondary)' }}>管理每一期的周刊文章。</p>
        </div>
        <Link href="/admin/weekly/new" style={{ padding: '10px 24px', background: 'var(--cyan)', color: '#05070d', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }}>+ 发布新一期</Link>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {data?.map(item => (
          <div key={item.id} style={{ padding: '16px', background: 'var(--bg-void)', border: '1px solid var(--border-subtle)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontWeight: 'bold' }}>{item.vol} · {item.title}</h4>
              <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>排序: {item.sort_order}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link href={`/admin/weekly/${item.id}`} style={{ padding: '6px 12px', border: '1px solid var(--cyan)', color: 'var(--cyan)', borderRadius: '6px', textDecoration: 'none', fontSize: '13px' }}>编辑</Link>
              <form action={deleteWeeklyAction}><input type="hidden" name="id" value={item.id} /><button type="submit" style={{ padding: '6px 12px', border: '1px solid #ff4444', color: '#ff4444', background: 'transparent', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>删除</button></form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}