import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { deletePortfolioAction } from './actions'
import { approvePortfolioForm } from '../review/actions'

export const instant = false

/** 作品状态 → 中文 + 颜色 */
function statusMeta(status: string | null) {
  if (status === 'approved') return { label: '已发布', color: 'var(--green)' }
  if (status === 'rejected') return { label: '已驳回', color: '#ff4444' }
  return { label: '待审核', color: 'var(--warn)' }
}

export default async function AdminPortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; ok?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const { data } = await supabase.from('portfolios').select('*').order('created_at', { ascending: false })

  return (
    <div>
      {/* 顶部提示条：操作失败 / 操作成功 */}
      {params.error && (
        <div
          style={{
            marginBottom: '20px',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid #ff4444',
            background: 'rgba(255,68,68,0.08)',
            color: '#ff4444',
            fontSize: '13px',
          }}
        >
          操作失败：{params.error}
        </div>
      )}
      {params.ok && (
        <div
          style={{
            marginBottom: '20px',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid var(--green)',
            background: 'rgba(60,220,140,0.08)',
            color: 'var(--green)',
            fontSize: '13px',
          }}
        >
          {params.ok}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>作品管理</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            用户投稿会先进「待审核」，通过后才会出现在前台作品广场。
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link
            href="/admin/review?type=portfolio&status=pending"
            style={{ padding: '10px 20px', border: '1px solid var(--cyan)', color: 'var(--cyan)', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none', fontSize: '14px' }}
          >
            去审核中心
          </Link>
          <Link href="/admin/portfolio/new" style={{ padding: '10px 24px', background: 'var(--cyan)', color: '#05070d', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }}>
            + 发布新作品
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {data?.map((item) => {
          const meta = statusMeta(item.status)
          const isPending = item.status === 'pending' || item.status === 'replied'

          return (
            <div key={item.id} className="ui-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative' }}>
                <img src={item.cover_url} alt="" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }} />
                {/* 状态胶囊 */}
                <span
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    fontSize: '11px',
                    padding: '2px 8px',
                    borderRadius: '100px',
                    background: 'rgba(5,7,13,0.85)',
                    color: meta.color,
                    border: `1px solid ${meta.color}`,
                  }}
                >
                  {meta.label}
                </span>
              </div>

              <h3 style={{ fontWeight: 'bold', marginBottom: '6px' }}>{item.title}</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '12px' }}>
                {item.author_name || '匿名'} · {item.category || '未分类'}
              </p>

              {/* 驳回理由回显 */}
              {item.status === 'rejected' && item.reject_reason && (
                <p style={{ fontSize: '12px', color: '#ff4444', marginBottom: '12px' }}>
                  驳回理由：{item.reject_reason}
                </p>
              )}

              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                <Link href={`/admin/portfolio/${item.id}`} style={{ flex: 1, textAlign: 'center', padding: '6px', border: '1px solid var(--cyan)', color: 'var(--cyan)', borderRadius: '4px', textDecoration: 'none', fontSize: '13px' }}>编辑</Link>
                <form action={deletePortfolioAction} style={{ flex: 1 }}>
                  <input type="hidden" name="id" value={item.id} />
                  <button type="submit" style={{ width: '100%', padding: '6px', border: '1px solid #ff4444', color: '#ff4444', background: 'transparent', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>删除</button>
                </form>
              </div>

              {/* 待审核作品：一键通过 / 去审核（驳回需要填理由，统一到审核中心做） */}
              {isPending && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <form action={approvePortfolioForm} style={{ flex: 1 }}>
                    <input type="hidden" name="id" value={item.id} />
                    <button
                      type="submit"
                      style={{ width: '100%', padding: '6px', border: '1px solid var(--green)', color: 'var(--green)', background: 'rgba(60,220,140,0.08)', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                    >
                      一键通过
                    </button>
                  </form>
                  <Link
                    href={`/admin/review?type=portfolio&focus=${item.id}`}
                    style={{ flex: 1, textAlign: 'center', padding: '6px', border: '1px solid #ff4444', color: '#ff4444', borderRadius: '4px', textDecoration: 'none', fontSize: '13px' }}
                  >
                    去驳回
                  </Link>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {(!data || data.length === 0) && (
        <div className="ui-card" style={{ padding: '60px 20px', textAlign: 'center', borderStyle: 'dashed' }}>
          <p style={{ color: 'var(--text-secondary)' }}>还没有任何作品，点右上角发布第一条吧。</p>
        </div>
      )}
    </div>
  )
}
