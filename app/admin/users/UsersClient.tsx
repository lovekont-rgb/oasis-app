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

  // 获取当前登录者的邮箱（用来判断操作权限）
  const [currentAdminEmail, setCurrentAdminEmail] = useState('')
  
  useState(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setCurrentAdminEmail(data.user.email)
    })
  })

  const isSuperAdmin = currentAdminEmail === 'sj2282@sina.com'

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  // 修改角色逻辑
  const handleRoleChange = async (id: string, newRole: string, targetEmail: string) => {
    if (targetEmail === 'sj2282@sina.com') {
      return alert('唯一拥有者的权限无法被修改！')
    }

    setLoadingId(id)
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', id)
    setLoadingId(null)

    if (error) {
      alert('修改失败: ' + error.message)
    } else {
      setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u))
    }
  }

  // 封禁/解封逻辑
  const handleToggleBan = async (id: string, currentBanStatus: boolean, targetEmail: string, targetRole: string) => {
    // 🚨 权限防御：不能封禁超管
    if (targetEmail === 'sj2282@sina.com') {
      return alert('无法封禁网站拥有者！')
    }
    // 🚨 权限防御：如果你是普通管理员，试图封禁另一个管理员，允许！但如果你试图封禁比你权限高的人则不行（虽然目前超管是写死的邮箱，这里逻辑已经覆盖）
    
    const confirmMsg = currentBanStatus ? '确定要解封该账号吗？' : '确定要封禁该账号吗？封禁后对方将无法登录。'
    if (!confirm(confirmMsg)) return

    setLoadingId(id)
    const { error } = await supabase.from('profiles').update({ is_banned: !currentBanStatus }).eq('id', id)
    setLoadingId(null)

    if (error) {
      alert('操作失败: ' + error.message)
    } else {
      setUsers(users.map(u => u.id === id ? { ...u, is_banned: !currentBanStatus } : u))
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>用户与权限管理</h1>
          <p style={{ color: 'var(--text-secondary)' }}>全站注册用户列表。Super Admin 拥有最高权限。</p>
        </div>
        
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
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)' }}>账号状态</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)', textAlign: 'right' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => {
              const isTargetSuper = u.email === 'sj2282@sina.com'
              const isTargetAdmin = u.role === 'admin'

              // 核心逻辑：判断当前登录者有没有权限操作这一行
              // 只有超管能修改角色；普通Admin和超管都能封禁（除了超管）
              const canManageRole = isSuperAdmin && !isTargetSuper
              const canBan = !isTargetSuper

              return (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '14px', opacity: u.is_banned ? 0.5 : 1 }}>
                  <td style={{ padding: '16px' }}>
                    {u.email}
                    {isTargetSuper && <span style={{ marginLeft: '8px', fontSize: '10px', color: '#ffd700', border: '1px solid #ffd700', padding: '2px 6px', borderRadius: '4px' }}>拥有者</span>}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '12px',
                      background: isTargetAdmin ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.1)',
                      color: isTargetAdmin ? 'var(--cyan)' : 'var(--text-secondary)'
                    }}>
                      {isTargetSuper ? '超级管理员' : isTargetAdmin ? '管理员' : '普通用户'}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ color: u.is_banned ? '#ff4444' : 'var(--green)', fontWeight: 'bold' }}>
                      {u.is_banned ? '已封禁' : '正常'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    
                    {/* 角色修改下拉框 */}
                    {canManageRole ? (
                      <select 
                        value={u.role} 
                        disabled={loadingId === u.id}
                        onChange={(e) => handleRoleChange(u.id, e.target.value, u.email)}
                        style={{ padding: '6px 12px', borderRadius: '6px', background: 'var(--bg-void)', color: 'white', border: '1px solid var(--border-subtle)', cursor: 'pointer', fontSize: '12px' }}
                      >
                        <option value="user">普通用户</option>
                        <option value="admin">管理员</option>
                      </select>
                    ) : (
                      <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>无权改角色</span>
                    )}

                    {/* 封禁按钮 */}
                    {canBan ? (
                      <button 
                        onClick={() => handleToggleBan(u.id, u.is_banned, u.email, u.role)}
                        disabled={loadingId === u.id}
                        style={{ 
                          padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold',
                          background: u.is_banned ? 'rgba(60, 220, 140, 0.1)' : 'rgba(255, 68, 68, 0.1)',
                          color: u.is_banned ? 'var(--green)' : '#ff4444',
                          border: `1px solid ${u.is_banned ? 'var(--green)' : '#ff4444'}`
                        }}
                      >
                        {u.is_banned ? '解封' : '封禁'}
                      </button>
                    ) : (
                      <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>不可封禁</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}