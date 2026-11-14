import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export const instant = false

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data: users } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })

  // Server Action: 修改角色
  async function updateRole(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    const role = formData.get('role') as string
    const supabase = await createClient()
    await supabase.from('profiles').update({ role }).eq('id', id)
    revalidatePath('/admin/users')
  }

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>用户与权限管理</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>修改用户级别，提升为管理员。</p>

      <div className="ui-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(0,212,255,0.05)', color: 'var(--cyan)', fontSize: '13px' }}>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)' }}>邮箱</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)' }}>当前角色</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)', textAlign: 'right' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '14px' }}>
                <td style={{ padding: '16px' }}>{u.email}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ 
                    padding: '4px 8px', borderRadius: '4px', fontSize: '12px',
                    background: u.role === 'admin' ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.1)',
                    color: u.role === 'admin' ? 'var(--cyan)' : 'var(--text-secondary)'
                  }}>
                    {u.role === 'admin' ? '管理员' : '普通用户'}
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <form action={updateRole} style={{ display: 'inline-flex', gap: '8px' }}>
                    <input type="hidden" name="id" value={u.id} />
                    <select name="role" defaultValue={u.role} style={{ padding: '6px', borderRadius: '4px', background: 'var(--bg-void)', color: 'white', border: '1px solid var(--border-subtle)' }}>
                      <option value="user">普通用户</option>
                      <option value="admin">管理员</option>
                    </select>
                    <button type="submit" style={{ padding: '6px 12px', background: 'var(--cyan)', color: '#05070d', borderRadius: '4px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>保存</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}