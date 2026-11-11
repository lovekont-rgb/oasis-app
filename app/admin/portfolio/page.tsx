import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { deletePortfolioAction } from './actions'

export const instant = false

export default async function AdminPortfolioPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('portfolios').select('*').order('created_at', { ascending: false })
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800 }}>作品管理</h1>
        <Link href="/admin/portfolio/new" style={{ padding: '10px 24px', background: 'var(--cyan)', color: '#05070d', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }}>+ 发布新作品</Link>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {data?.map(item => (
          <div key={item.id} className="ui-card" style={{ padding: '16px' }}>
            <img src={item.cover_url} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }} />
            <h3 style={{ fontWeight: 'bold', marginBottom: '8px' }}>{item.title}</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link href={`/admin/portfolio/${item.id}`} style={{ flex: 1, textAlign: 'center', padding: '6px', border: '1px solid var(--cyan)', color: 'var(--cyan)', borderRadius: '4px', textDecoration: 'none', fontSize: '13px' }}>编辑</Link>
              <form action={deletePortfolioAction} style={{ flex: 1 }}><input type="hidden" name="id" value={item.id} /><button type="submit" style={{ width: '100%', padding: '6px', border: '1px solid #ff4444', color: '#ff4444', background: 'transparent', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>删除</button></form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}