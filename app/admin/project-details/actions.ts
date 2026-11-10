'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveProjectDetail(formData: FormData) {
  const supabase = await createClient()
  const projectId = Number(formData.get('project_id'))
  const background = formData.get('background') as string
  const requirements = (formData.get('requirements') as string).split('\n').filter(s => s.trim())
  
  // 解析流程步骤（格式：标题 | 描述）
  const processStepsRaw = formData.get('process_steps') as string
  const processSteps = processStepsRaw.split('\n').filter(s => s.trim()).map(line => {
    const [title, desc] = line.split('|').map(s => s.trim())
    return { title: title || '未命名', desc: desc || '' }
  })

  // 检查是否已有详情
  const { data: existing } = await supabase.from('project_details').select('id').eq('project_id', projectId).single()

  if (existing) {
    // 更新
    await supabase.from('project_details').update({ background, requirements, process_steps: processSteps }).eq('project_id', projectId)
  } else {
    // 插入
    await supabase.from('project_details').insert({ project_id: projectId, background, requirements, process_steps: processSteps })
  }

  revalidatePath('/admin/project-details')
  revalidatePath(`/projects/${projectId}`)
  return { success: true }
}