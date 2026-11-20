'use server'
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approveContent(table: 'portfolios' | 'community_questions', id: number) {
  const supabase = await createClient()
  const { error } = await supabase.from(table).update({ status: 'approved' }).eq('id', id)
  if (error) return { success: false, error: error.message }
  
  revalidatePath('/admin/review')
  revalidatePath(table === 'portfolios' ? '/portfolio' : '/community/qa')
  return { success: true }
}

export async function rejectContent(table: 'portfolios' | 'community_questions', id: number, reason: string) {
  const supabase = await createClient()
  const { error } = await supabase.from(table).update({ status: 'rejected', reject_reason: reason }).eq('id', id)
  if (error) return { success: false, error: error.message }
  
  revalidatePath('/admin/review')
  revalidatePath(table === 'portfolios' ? '/dashboard/portfolio' : '/dashboard/qa')
  return { success: true }
}
=======
>>>>>>> Stashed changes

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/require-admin'

/**
 * 内容审核中心的全部服务端动作
 *
 * 状态机（只允许单向流转）：
 *   pending（待审核） --通过--> approved（已发布）
 *   pending（待审核） --驳回--> rejected（已驳回，必须写理由）
 * 作者修改作品后，会自动回到 pending，需要重新审核。
 */

type ActionResult = { success: true } | { success: false; error: string }
type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>

const PENDING = 'pending'
const APPROVED = 'approved'
const REJECTED = 'rejected'

/** 把前端传来的 id 统一成合法正整数，非法返回 null */
function normalizeId(value: unknown): number | null {
  const id = Number(value)
  if (!Number.isFinite(id) || id <= 0) return null
  return Math.floor(id)
}

/** 状态的中文名，用于错误提示 */
function statusText(status: string | null | undefined): string {
  if (status === APPROVED) return '已发布'
  if (status === REJECTED) return '已驳回'
  if (status === PENDING) return '待审核'
  if (status === 'replied') return '已回复（旧状态，未发布）'
  return '未知状态'
}

/** 审核通过 / 驳回后，把所有相关页面的缓存一起刷新 */
function refreshAllPages() {
  revalidatePath('/admin/review')
  revalidatePath('/admin/portfolio')
  revalidatePath('/admin/qa')
  revalidatePath('/portfolio')
  revalidatePath('/community/qa')
  revalidatePath('/dashboard/portfolio')
  revalidatePath('/dashboard/qa')
}

/**
 * 写一条审核日志（review_logs 表不存在时自动跳过，不影响主流程）
 */
async function writeLog(
  supabase: SupabaseServerClient,
  entry: {
    target_type: 'portfolio' | 'question'
    target_id: number
    action: 'approve' | 'reject' | 'reply'
    reason?: string | null
    operator_id: string
    operator_email: string
  }
) {
  try {
    await supabase.from('review_logs').insert({
      target_type: entry.target_type,
      target_id: entry.target_id,
      action: entry.action,
      reason: entry.reason || null,
      operator_id: entry.operator_id,
      operator_email: entry.operator_email,
    })
  } catch {
    // 没有建 review_logs 表时静默忽略，审核功能本身仍然可用
  }
}

/* ============================================================
 * 作品审核
 * ============================================================ */

export async function approvePortfolio(idInput: number): Promise<ActionResult> {
  const guard = await requireAdmin()
  if (!guard.ok) return { success: false, error: guard.error }

  const id = normalizeId(idInput)
  if (!id) return { success: false, error: '作品 ID 不合法' }

  const supabase = await createClient()
  const { data: item, error: readError } = await supabase
    .from('portfolios')
    .select('id, status')
    .eq('id', id)
    .single()

  if (readError || !item) return { success: false, error: '作品不存在或已被删除' }

  if (item.status !== PENDING) {
    return {
      success: false,
      error: `这条作品当前是「${statusText(item.status)}」，只有「待审核」的作品可以操作`,
    }
  }

  const { error } = await supabase
    .from('portfolios')
    .update({ status: APPROVED, reject_reason: null })
    .eq('id', id)

  if (error) return { success: false, error: '通过失败：' + error.message }

  await writeLog(supabase, {
    target_type: 'portfolio',
    target_id: id,
    action: 'approve',
    operator_id: guard.userId,
    operator_email: guard.email,
  })

  refreshAllPages()
  return { success: true }
}

export async function rejectPortfolio(idInput: number, reasonInput: string): Promise<ActionResult> {
  const guard = await requireAdmin()
  if (!guard.ok) return { success: false, error: guard.error }

  const id = normalizeId(idInput)
  if (!id) return { success: false, error: '作品 ID 不合法' }

  const reason = (reasonInput || '').trim()
  if (reason.length < 2) return { success: false, error: '请填写驳回理由（至少 2 个字），作者需要知道原因' }
  if (reason.length > 100) return { success: false, error: '驳回理由最多 100 个字' }

  const supabase = await createClient()
  const { data: item, error: readError } = await supabase
    .from('portfolios')
    .select('id, status')
    .eq('id', id)
    .single()

  if (readError || !item) return { success: false, error: '作品不存在或已被删除' }

  if (item.status !== PENDING) {
    return {
      success: false,
      error: `这条作品当前是「${statusText(item.status)}」，只有「待审核」的作品可以操作`,
    }
  }

  const { error } = await supabase
    .from('portfolios')
    .update({ status: REJECTED, reject_reason: reason })
    .eq('id', id)

  if (error) return { success: false, error: '驳回失败：' + error.message }

  await writeLog(supabase, {
    target_type: 'portfolio',
    target_id: id,
    action: 'reject',
    reason,
    operator_id: guard.userId,
    operator_email: guard.email,
  })

  refreshAllPages()
  return { success: true }
}

/**
 * 后台"作品管理"列表里的快速通过按钮（表单版，返回 void）
 */
export async function approvePortfolioForm(formData: FormData): Promise<void> {
  const id = normalizeId(formData.get('id'))
  if (!id) redirect('/admin/portfolio?error=' + encodeURIComponent('作品 ID 不合法'))

  const res = await approvePortfolio(id)
  if (!res.success) {
    redirect('/admin/portfolio?error=' + encodeURIComponent(res.error))
  }
  redirect('/admin/portfolio?ok=' + encodeURIComponent('已通过并发布'))
}

/* ============================================================
 * 提问审核
 * ============================================================ */

/**
 * 通过提问（可选同时写官方回复）
 * - 通过后 status = approved，前台 /community/qa 才会显示
 * - 与"回复"分开：只回复不通过，提问仍然不在前台出现
 */
export async function approveQuestion(idInput: number, replyInput?: string): Promise<ActionResult> {
  const guard = await requireAdmin()
  if (!guard.ok) return { success: false, error: guard.error }

  const id = normalizeId(idInput)
  if (!id) return { success: false, error: '提问 ID 不合法' }

  const reply = (replyInput || '').trim()
  if (reply.length > 1000) return { success: false, error: '官方回复最多 1000 个字' }

  const supabase = await createClient()
  const { data: item, error: readError } = await supabase
    .from('community_questions')
    .select('id, status')
    .eq('id', id)
    .single()

  if (readError || !item) return { success: false, error: '提问不存在或已被删除' }

  // 兼容历史数据：replied 属于"已回复但未发布"，允许继续通过
  if (item.status !== PENDING && item.status !== 'replied') {
    return {
      success: false,
      error: `这条提问当前是「${statusText(item.status)}」，只有「待审核」的提问可以操作`,
    }
  }

  const patch: { status: string; reject_reason: null; admin_reply?: string } = {
    status: APPROVED,
    reject_reason: null,
  }
  if (reply) patch.admin_reply = reply

  const { error } = await supabase.from('community_questions').update(patch).eq('id', id)
  if (error) return { success: false, error: '通过失败：' + error.message }

  await writeLog(supabase, {
    target_type: 'question',
    target_id: id,
    action: 'approve',
    operator_id: guard.userId,
    operator_email: guard.email,
  })

  refreshAllPages()
  return { success: true }
}

export async function rejectQuestion(idInput: number, reasonInput: string): Promise<ActionResult> {
  const guard = await requireAdmin()
  if (!guard.ok) return { success: false, error: guard.error }

  const id = normalizeId(idInput)
  if (!id) return { success: false, error: '提问 ID 不合法' }

  const reason = (reasonInput || '').trim()
  if (reason.length < 2) return { success: false, error: '请填写驳回理由（至少 2 个字），作者需要知道原因' }
  if (reason.length > 100) return { success: false, error: '驳回理由最多 100 个字' }

  const supabase = await createClient()
  const { data: item, error: readError } = await supabase
    .from('community_questions')
    .select('id, status')
    .eq('id', id)
    .single()

  if (readError || !item) return { success: false, error: '提问不存在或已被删除' }

  if (item.status !== PENDING) {
    return {
      success: false,
      error: `这条提问当前是「${statusText(item.status)}」，只有「待审核」的提问可以操作`,
    }
  }

  const { error } = await supabase
    .from('community_questions')
    .update({ status: REJECTED, reject_reason: reason })
    .eq('id', id)

  if (error) return { success: false, error: '驳回失败：' + error.message }

  await writeLog(supabase, {
    target_type: 'question',
    target_id: id,
    action: 'reject',
    reason,
    operator_id: guard.userId,
    operator_email: guard.email,
  })

  refreshAllPages()
  return { success: true }
}
<<<<<<< Updated upstream
=======
>>>>>>> 93d7db95f1438df1c767e89358f98c5576e34190
>>>>>>> Stashed changes
