import { createClient } from '@/lib/supabase/server'
import ReviewClient, { type ReviewItem, type ReviewLog } from './ReviewClient'

export const instant = false

/**
 * 内容审核中心 · 列表页
 *
 * 数据来源：
 * - portfolios（作品表）
 * - community_questions（提问表）
 * - review_logs（审核日志，可选；没建表时自动显示"暂无处理记录"）
 *
 * 支持 URL 参数：
 * - /admin/review?type=portfolio   只看作品
 * - /admin/review?type=question&status=pending
 * - /admin/review?focus=11         自动展开 id=11 的卡片（作品管理页跳转过来时用）
 */
export default async function AdminReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; focus?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const [{ data: portfolios }, { data: questions }, logResult] = await Promise.all([
    supabase
      .from('portfolios')
      .select('id, title, author_name, category, content, file_url, file_type, status, reject_reason, created_at, user_id')
      .order('created_at', { ascending: false })
      .limit(200),
    supabase
      .from('community_questions')
      .select('id, title, content, user_name, status, admin_reply, reject_reason, created_at, user_id')
      .order('created_at', { ascending: false })
      .limit(200),
    // review_logs 是可选表：没有建表时这里会返回 error，页面照常工作
    supabase
      .from('review_logs')
      .select('id, target_type, target_id, action, reason, operator_email, created_at')
      .order('created_at', { ascending: false })
      .limit(300),
  ])

  const logs: ReviewLog[] = (logResult.data || []) as ReviewLog[]

  const items: ReviewItem[] = [
    ...(portfolios || []).map((row) => ({
      id: row.id as number,
      type: 'portfolio' as const,
      title: (row.title as string) || '未命名作品',
      author: (row.author_name as string) || '匿名',
      category: (row.category as string) || '未分类',
      content: (row.content as string) || '',
      fileUrl: (row.file_url as string) || null,
      fileType: (row.file_type as string) || null,
      status: (row.status as string) || 'pending',
      rejectReason: (row.reject_reason as string) || null,
      adminReply: null,
      createdAt: (row.created_at as string) || '',
    })),
    ...(questions || []).map((row) => ({
      id: row.id as number,
      type: 'question' as const,
      title: (row.title as string) || '未命名提问',
      author: (row.user_name as string) || '匿名',
      category: '问答互助',
      content: (row.content as string) || '',
      fileUrl: null,
      fileType: null,
      status: (row.status as string) || 'pending',
      rejectReason: (row.reject_reason as string) || null,
      adminReply: (row.admin_reply as string) || null,
      createdAt: (row.created_at as string) || '',
    })),
  ]

  const initialType =
    params.type === 'portfolio' || params.type === 'question' ? params.type : 'all'
  const focusId = params.focus ? Number(params.focus) : null

  return (
    <ReviewClient
      items={items}
      logs={logs}
      initialType={initialType}
      focusId={Number.isFinite(focusId) && (focusId as number) > 0 ? (focusId as number) : null}
    />
  )
}
