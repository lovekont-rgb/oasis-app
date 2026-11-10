import { createClient } from '@/lib/supabase/server'
import LibraryClient from './LibraryClient'

export const instant = false

export default async function PromptLibraryPage() {
  const supabase = await createClient()
  const { data: prompts } = await supabase.from('prompt_library').select('*').order('id', { ascending: false })

  return (
    <main className="page-container">
      <div className="ui-badge"><span className="ui-badge-dot"></span>PROMPT LIBRARY</div>
      <h1 className="ui-title">提示词 <span className="ui-title-gradient">瀑布流库</span></h1>
      <p className="ui-subtitle">
        汇集各类型高质量提示词，附带效果图与标签。点击即可复制，直接投入实战。
      </p>
      
      <LibraryClient initialPrompts={prompts || []} />
    </main>
  )
}