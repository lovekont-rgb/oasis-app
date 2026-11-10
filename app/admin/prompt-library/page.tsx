import { createClient } from '@/lib/supabase/server'
import LibraryAdminClient from './LibraryAdminClient'

export const instant = false

export default async function AdminLibraryPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('prompt_library').select('*').order('id', { ascending: false })
  
  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>提示词库管理</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>用于管理瀑布流提示词库的数据。</p>
      <LibraryAdminClient initialPrompts={data || []} />
    </div>
  )
}