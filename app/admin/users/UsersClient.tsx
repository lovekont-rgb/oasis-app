'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function UsersClient({ initialUsers }: { initialUsers: any[] }) {
  const router = useRouter()
  const supabase = createClient()
  
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState(initialUsers)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  // 搜索过滤
  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  // 修改角色逻辑
  const handleRoleChange = async (id: string, newRole: string, email: string) => {
    if (email === 'sj2282@sina.com') {
      return alert('唯一拥有者的权限无法被修改！')
    }

    setLoadingId(id)
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', id)
    setLoadingId(null)

    if (error) {
      alert('修改失败: ' + error.message)
    } else {
      // 更新本地状态，页面即时刷新
      setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u))
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>用户与权限管理</h1>
          <p style={{ color: 'var(--text-secondary)' }}>全站注册用户列表。</p>
        </div>
        
        {/* 👇 搜索框 */}
        <input 
          type="text" 
          placeholder="搜索用户邮箱..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ 
            padding: '10px 16px', borderRadius: '100px', width: '300px',
            background: 'var(--bg-void)', border: '1px solid var(--border-subtle)', 
            color: 'var(--text-primary)', outline: 'none', fontSize: '14px' 
          }}
        />
      </div>

      <div className="ui-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(0,212,255,0.05)', color: 'var(--cyan)', fontSize: '13px' }}>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)' }}>邮箱账号</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)' }}>当前角色</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)', textAlign: 'right' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '14px' }}>
                <td style={{ padding: '16px' }}>
                  {u.email}
                  {u.email === 'sj2282@sina.com' && (
                    <span style={{ marginLeft: '8px', fontSize: '10px', color: '#ffd700', border: '1px solid #ffd700', padding: '2px 6px', borderRadius: '4px' }}>超级拥有者</span>
                  )}
                </td>
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
                  {u.email === 'sj2282@sina.com' ? (
                    <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>不可修改</span>
                  ) : (
                    <select 
                      value={u.role} 
                      disabled={loadingId === u.id}
                      onChange={(e) => handleRoleChange(u.id, e.target.value, u.email)}
                      style={{ padding: '6px 12px', borderRadius: '6px', background: 'var(--bg-void)', color: 'white', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                    >
                      <option value="user">普通用户</option>
                      <option value="admin">管理员</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr><td colSpan={3} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>没有找到匹配的用户</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}