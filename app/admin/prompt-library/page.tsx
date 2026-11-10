import { createClient } from '@/lib/supabase/server'
import LibraryAdminClient from './LibraryAdminClient'

export const instant = false

export default async function AdminLibraryPage() {
  const supabase = await createClient()
  const [ { data: prompts }, { data: categories } ] = await Promise.all([
    supabase.from('prompt_library').select('*, prompt_categories(name)').order('id', { ascending: false }),
    supabase.from('prompt_categories').select('*')
  ])
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>提示词库管理</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>用于管理瀑布流提示词库的数据。</p>
        </div>
        <a href="/admin/prompt-library/categories" style={{ padding: '10px 24px', border: '1px solid var(--cyan)', color: 'var(--cyan)', borderRadius: '8px', textDecoration: 'none' }}>⚙️ 管理分类目录</a>
      </div>
      
      <LibraryAdminClient initialPrompts={prompts || []} categories={categories || []} />
    </div>
  )
}