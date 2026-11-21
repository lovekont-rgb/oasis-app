import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { approvePortfolioForm, rejectPortfolioForm } from '../review/actions'
import { deletePortfolioAction } from './actions'

export const instant = false

export default async function AdminPortfolioPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('portfolios').select('*').order('created_at', { ascending: false })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>作品广场管理</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>管理全站所有作品，可直接进行审核或编辑。</p>
        </div>
        <Link href="/admin/portfolio/new" style={{ padding: '10px 24px', background: 'var(--cyan)', color: '#05070d', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }}>
          + 管理员发布作品
        </Link>
      </div>

      <div className="ui-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(0,212,255,0.05)', color: 'var(--cyan)', fontSize: '13px' }}>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)' }}>作品信息</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)' }}>状态</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)', textAlign: 'right' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {data?.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '14px' }}>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={item.cover_url} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    <div>
                      <h4 style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '4px' }}>{item.title}</h4>
                      <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>作者: {item.author_name}</span>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={{
                    fontSize: '12px', padding: '4px 8px', borderRadius: '4px', border: '1px solid',
                    color: item.status === 'approved' ? 'var(--green)' : item.status === 'rejected' ? '#ff4444' : 'var(--warn)',
                    borderColor: item.status === 'approved' ? 'var(--green)' : item.status === 'rejected' ? '#ff4444' : 'var(--warn)'
                  }}>
                    {item.status === 'approved' ? '已发布' : item.status === 'rejected' ? '已驳回' : '待审核'}
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    
                    {/* 👇 如果是待审核，显示通过和驳回按钮 */}
                    {item.status === 'pending' && (
                      <>
                        <form action={approvePortfolioForm}>
                          <input type="hidden" name="id" value={item.id} />
                          <button type="submit" style={{ padding: '6px 12px', background: 'var(--green)', color: '#05070d', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>通过</button>
                        </form>
                        <form action={rejectPortfolioForm}>
                          <input type="hidden" name="id" value={item.id} />
                          <input type="hidden" name="reason" value="后台直接驳回" />
                          <button type="submit" style={{ padding: '6px 12px', background: 'transparent', color: '#ff4444', border: '1px solid #ff4444', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>驳回</button>
                        </form>
                      </>
                    )}

                    <Link href={`/admin/portfolio/${item.id}`} style={{ padding: '6px 12px', border: '1px solid var(--cyan)', color: 'var(--cyan)', borderRadius: '6px', textDecoration: 'none', fontSize: '12px' }}>编辑</Link>
                    
                    <form action={deletePortfolioAction}>
                      <input type="hidden" name="id" value={item.id} />
                      <button type="submit" style={{ padding: '6px 12px', border: '1px solid #ff4444', color: '#ff4444', background: 'transparent', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>删除</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}