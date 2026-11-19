'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/require-admin'

function parseData(formData: FormData) {
  const toolsStr = formData.get('tools') as string
  return {
    title: formData.get('title') as string,
    cover_url: formData.get('cover_url') as string,
    author_name: formData.get('author_name') as string,
    category: formData.get('category') as string,
    content: formData.get('content') as string,
    file_url: formData.get('file_url') as string,
    file_type: formData.get('file_type') as string,
    tools: toolsStr ? toolsStr.split(',').map((t) => t.trim()) : [],
  }
}

/**
 * 管理员后台新建作品
 *
 * 关键点：管理员发布的内容「直接发布」（status = 'approved'），不再走一遍审核，
 * 否则管理员自己发的作品在前台 /portfolio 里看不到（status 为 null 时前台查不到）。
 */
export async function createPortfolio(formData: FormData): Promise<void> {
  const guard = await requireAdmin()
  if (!guard.ok) {
    redirect('/admin/portfolio?error=' + encodeURIComponent(guard.error))
  }

  const supabase = await createClient()
  const { error } = await supabase.from('portfolios').insert({
    ...parseData(formData),
    status: 'approved',
    reject_reason: null,
  })

  if (error) {
    redirect('/admin/portfolio?error=' + encodeURIComponent('发布失败：' + error.message))
  }

  revalidatePath('/admin/portfolio')
  revalidatePath('/portfolio')
  redirect('/admin/portfolio?ok=' + encodeURIComponent('已直接发布'))
}

/**
 * 管理员编辑作品
 * 注意：这里「不修改 status」，避免把"已驳回"的作品在编辑时偷偷变成已发布。
 * 想让被驳回的作品重新上线，请到审核中心重新通过。
 */
export async function updatePortfolio(id: number, formData: FormData): Promise<void> {
  const guard = await requireAdmin()
  if (!guard.ok) {
    redirect('/admin/portfolio?error=' + encodeURIComponent(guard.error))
  }

  const supabase = await createClient()
  const { error } = await supabase.from('portfolios').update(parseData(formData)).eq('id', id)

  if (error) {
    redirect('/admin/portfolio?error=' + encodeURIComponent('保存失败：' + error.message))
  }

  revalidatePath('/admin/portfolio')
  revalidatePath('/portfolio')
  revalidatePath(`/portfolio/${id}`)
  redirect('/admin/portfolio?ok=' + encodeURIComponent('已保存'))
}

export async function deletePortfolioAction(formData: FormData): Promise<void> {
  const guard = await requireAdmin()
  if (!guard.ok) {
    redirect('/admin/portfolio?error=' + encodeURIComponent(guard.error))
  }

  const id = Number(formData.get('id'))
  if (!Number.isFinite(id) || id <= 0) {
    redirect('/admin/portfolio?error=' + encodeURIComponent('作品 ID 不合法'))
  }

  const supabase = await createClient()
  const { error } = await supabase.from('portfolios').delete().eq('id', id)

  if (error) {
    redirect('/admin/portfolio?error=' + encodeURIComponent('删除失败：' + error.message))
  }

  revalidatePath('/admin/portfolio')
  revalidatePath('/portfolio')
  redirect('/admin/portfolio?ok=' + encodeURIComponent('已删除'))
}
