'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function UsersClient({ initialUsers, currentAdminEmail }: { initialUsers: any[], currentAdminEmail: string }) {
  const supabase = createClient()
  
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState(initialUsers)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const isSuperAdmin = currentAdminEmail === 'sj2282@sina.com'

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.email?.toLowerCase().includes(search.toLowerCase())
    if (!isSuperAdmin && u.email === 'sj2282@sina.com') return false
    return matchesSearch
  })

  const handleRoleChange = async (id: string, newRole: string, targetEmail: string, targetRole: string) => {
    if (targetEmail === 'sj2282@sina.com') return alert('无法修改拥有者权限！')
    
    // 核心权限校验：普通管理员不能修改其他管理员
    if (!isSuperAdmin && targetRole === 'admin') {
      return alert('您无权修改其他管理员的角色！')
    }

    setLoadingId(id)
    await supabase.from('profiles').update({ role: newRole }).eq('id', id)
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u))
    setLoadingId(null)
  }

  const handleToggleBan = async (id: string, current: boolean) => {
    if (!confirm(current ? '确定要解封该账号吗？' : '确定要封禁该账号吗？')) return
    setLoadingId(id)
    await supabase.from('profiles').update({ is_banned: !current }).eq('id', id)
    setUsers(users.map(u => u.id === id ? { ...u, is_banned: !current } : u))
    setLoadingId(null)
  }

  const handleToggleMute = async (id: string, current: boolean) => {
    if (!confirm(current ? '确定要解除禁言吗？' : '确定要禁言该用户吗？')) return
    setLoadingId(id)
    await supabase.from('profiles').update({ is_muted: !current }).eq('id', id)
    setUsers(users.map(u => u.id === id ? { ...u, is_muted: !current } : u))
    setLoadingId(null)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>用户与权限管理</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            当前操作员：{isSuperAdmin ? '超级管理员 (拥有全部权限)' : '普通管理员 (仅可管理普通用户)'}
          </p>
        </div>
        
        <input 
          type="text" placeholder="搜索用户邮箱..." value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '10px 16px', borderRadius: '100px', width: '300px', background: 'var(--bg-void)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', outline: 'none', fontSize: '14px' }}
        />
      </div>

      <div className="ui-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(0,212,255,0.05)', color: 'var(--cyan)', fontSize: '13px' }}>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)' }}>邮箱账号</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)' }}>角色 / 状态</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)', textAlign: 'right' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => {
              const isTargetSuper = u.email === 'sj2282@sina.com'
              const isSelf = u.email === currentAdminEmail
              const isTargetAdmin = u.role === 'admin'

              // 判断是否可以修改角色：
              // 1. 不能改超管和自己
              // 2. 如果是超管，可以改所有人
              // 3. 如果是普管，只能改普通用户
              const canManageRole = !isTargetSuper && !isSelf && (isSuperAdmin || !isTargetAdmin)
              
              // 判断是否可以封禁/禁言：
              // 只要不是超管且不是自己，都能操作
              const canModerate = !isTargetSuper && !isSelf 

              return (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '14px', opacity: u.is_banned ? 0.5 : 1 }}>
                  <td style={{ padding: '16px', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {u.email}
                      {isTargetSuper && <span style={{ fontSize: '10px', color: '#ffd700', border: '1px solid #ffd700', padding: '2px 6px', borderRadius: '4px' }}>拥有者</span>}
                      {isSelf && <span style={{ fontSize: '10px', color: 'var(--cyan)', border: '1px solid var(--cyan)', padding: '2px 6px', borderRadius: '4px' }}>当前账号</span>}
                    </div>
                  </td>
                  <td style={{ padding: '16px', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '12px', color: isTargetAdmin ? 'var(--cyan)' : 'var(--text-secondary)' }}>
                        {isTargetSuper ? '超级管理员' : isTargetAdmin ? '管理员' : '普通用户'}
                      </span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {u.is_banned && <span style={{ fontSize: '10px', color: '#ff4444', border: '1px solid #ff4444', padding: '1px 4px', borderRadius: '4px' }}>已封禁</span>}
                        {u.is_muted && <span style={{ fontSize: '10px', color: 'var(--warn)', border: '1px solid var(--warn)', padding: '1px 4px', borderRadius: '4px' }}>已禁言</span>}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', alignItems: 'center' }}>
                      
                      {canManageRole ? (
                        <select value={u.role} disabled={loadingId === u.id} onChange={(e) => handleRoleChange(u.id, e.target.value, u.email, u.role)} style={{ padding: '6px', borderRadius: '6px', background: 'var(--bg-void)', color: 'white', border: '1px solid var(--border-subtle)', fontSize: '12px', height: '32px' }}>
                          <option value="user">普通用户</option>
                          <option value="admin">管理员</option>
                        </select>
                      ) : (
                        <span style={{ fontSize: '12px', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', height: '32px' }}>
                          {isTargetSuper ? '最高权限' : isSelf ? '受保护' : '无权改角色'}
                        </span>
                      )}

                      {canModerate ? (
                        <>
                          <button onClick={() => handleToggleMute(u.id, u.is_muted)} disabled={loadingId === u.id} style={{ padding: '0 10px', height: '32px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold', background: u.is_muted ? 'rgba(60, 220, 140, 0.1)' : 'rgba(255, 180, 60, 0.1)', color: u.is_muted ? 'var(--green)' : 'var(--warn)', border: `1px solid ${u.is_muted ? 'var(--green)' : 'var(--warn)'}` }}>
                            {u.is_muted ? '解禁言' : '禁言'}
                          </button>

                          <button onClick={() => handleToggleBan(u.id, u.is_banned)} disabled={loadingId === u.id} style={{ padding: '0 10px', height: '32px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold', background: u.is_banned ? 'rgba(60, 220, 140, 0.1)' : 'rgba(255, 68, 68, 0.1)', color: u.is_banned ? 'var(--green)' : '#ff4444', border: `1px solid ${u.is_banned ? 'var(--green)' : '#ff4444'}` }}>
                            {u.is_banned ? '解封' : '封禁'}
                          </button>
                        </>
                      ) : null}
                    </div>
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