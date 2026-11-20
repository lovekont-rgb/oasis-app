'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth/require-admin'

/**
 * 只保存/修改官方回复，**不改变审核状态**
 *
 * 修复的坑：旧代码回复时会把 status 写成 'replied'，
 * 导致已回复 ≠ 已发布，问题永远进不了 approved，前台看不到。
 * 现在：回复归回复，发布归"通过"（在审核中心 / 本页的"通过并发布"按钮）。
 */
export async function replyQuestion(
  id: number,
  replyText: string
): Promise<{ success: true } | { success: false; error: string }> {
  const guard = await requireAdmin()
  if (!guard.ok) return { success: false, error: guard.error }

  const text = (replyText || '').trim()
  if (text.length < 1) return { success: false, error: '回复内容不能为空' }
  if (text.length > 1000) return { success: false, error: '回复内容最多 1000 个字' }

  const supabase = await createClient()
<<<<<<< Updated upstream
  const { error } = await supabase
    .from('community_questions')
    .update({ admin_reply: text })
    .eq('id', id)

  if (error) return { success: false, error: error.message }
=======
<<<<<<< HEAD
  const { error } = await supabase.from('community_questions')
    .update({ admin_reply: replyText }) // 👈 只更新回复，不改 status
=======
  const { error } = await supabase
    .from('community_questions')
    .update({ admin_reply: text })
>>>>>>> 93d7db95f1438df1c767e89358f98c5576e34190
    .eq('id', id)

  if (error) return { success: false, error: error.message }
<<<<<<< HEAD
  revalidatePath('/admin/qa'); revalidatePath('/admin/review')
  revalidatePath('/community/qa'); revalidatePath('/dashboard/qa')
=======
>>>>>>> Stashed changes

  revalidatePath('/admin/qa')
  revalidatePath('/admin/review')
  revalidatePath('/community/qa')
  revalidatePath('/dashboard/qa')
<<<<<<< Updated upstream
=======
>>>>>>> 93d7db95f1438df1c767e89358f98c5576e34190
>>>>>>> Stashed changes
  return { success: true }
}

export async function deleteQuestionAction(formData: FormData): Promise<void> {
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
  const id = Number(formData.get('id'))
  const supabase = await createClient()
  await supabase.from('community_questions').delete().eq('id', id)
  revalidatePath('/admin/qa'); revalidatePath('/community/qa'); revalidatePath('/admin/review')
}
=======
>>>>>>> Stashed changes
  const guard = await requireAdmin()
  if (guard.ok) {
    const id = Number(formData.get('id'))
    const supabase = await createClient()
    if (Number.isFinite(id) && id > 0) {
      await supabase.from('community_questions').delete().eq('id', id)
    }
  }

  revalidatePath('/admin/qa')
  revalidatePath('/admin/review')
  revalidatePath('/community/qa')
}
<<<<<<< Updated upstream
=======
>>>>>>> 93d7db95f1438df1c767e89358f98c5576e34190
>>>>>>> Stashed changes
