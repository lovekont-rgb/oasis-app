'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { updateProfile, updatePassword } from './actions'

export default function SettingsClient({ user, initialProfile }: { user: any, initialProfile: any }) {
  const router = useRouter()
  const supabase = createClient()

  // 表单状态
  const [username, setUsername] = useState(initialProfile?.username || user.email.split('@')[0])
  const [bio, setBio] = useState(initialProfile?.bio || '')
  const [skills, setSkills] = useState(initialProfile?.skills?.join(', ') || '')
  const [github, setGithub] = useState(initialProfile?.social_links?.github || '')
  
  const [avatarUrl, setAvatarUrl] = useState(initialProfile?.avatar_url || '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  // 密码状态
  const [newPassword, setNewPassword] = useState('')
  const [pwdMsg, setPwdMsg] = useState('')

  // 处理头像上传
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) return alert('头像不能超过 2MB')
    if (!file.type.includes('image/')) return alert('只支持图片格式')

    setUploading(true)
    const fileName = `${user.id}-${Date.now()}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage.from('avatars').upload(fileName, file)
    
    if (error) {
      alert('上传失败: ' + error.message)
    } else {
      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName)
      setAvatarUrl(data.publicUrl)
    }
    setUploading(false)
  }

  // 保存基本信息
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMsg('')

    const res = await updateProfile({
      username,
      bio,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      social_links: { github },
      avatar_url: avatarUrl
    })

    setSaving(false)
    if (res.success) {
      setMsg('个人信息更新成功！')
      router.refresh()
    } else {
      setMsg('保存失败: ' + res.error)
    }
  }

  // 修改密码
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword.length < 6) return setPwdMsg('密码至少需要 6 位')
    
    setPwdMsg('正在修改...')
    const res = await updatePassword(newPassword)
    if (res.success) {
      setPwdMsg('密码修改成功！下次登录请使用新密码。')
      setNewPassword('')
    } else {
      setPwdMsg('修改失败: ' + res.error)
    }
  }

  const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white', marginBottom: '16px' }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
      
      {/* 左侧：基本信息 */}
      <div className="ui-card" style={{ padding: '32px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '24px', color: 'var(--cyan)' }}>个人资料</h2>
        
        {msg && <div style={{ padding: '10px', marginBottom: '16px', background: 'rgba(0,212,255,0.1)', color: 'var(--cyan)', borderRadius: '6px', fontSize: '13px' }}>{msg}</div>}

        <form onSubmit={handleSaveProfile}>
          {/* 头像区域 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--violet), var(--cyan))', display: 'grid', placeItems: 'center', fontSize: '32px', color: 'white', fontWeight: 'bold', overflow: 'hidden', position: 'relative' }}>
              {avatarUrl ? <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : username.charAt(0).toUpperCase()}
            </div>
            <div>
              <label style={{ display: 'inline-block', padding: '8px 16px', background: 'rgba(0,212,255,0.1)', color: 'var(--cyan)', borderRadius: '100px', fontSize: '13px', cursor: 'pointer', fontWeight: 'bold', border: '1px solid var(--cyan)' }}>
                {uploading ? '上传中...' : '更换头像'}
                <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} disabled={uploading} />
              </label>
              <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '8px' }}>支持 JPG/PNG，不超过 2MB</p>
            </div>
          </div>

          <label style={{ fontSize: '13px', display: 'block', marginBottom: '6px', color: 'var(--text-secondary)' }}>用户名 (昵称)</label>
          <input value={username} onChange={e => setUsername(e.target.value)} required style={inputStyle} />

          <label style={{ fontSize: '13px', display: 'block', marginBottom: '6px', color: 'var(--text-secondary)' }}>个人简介</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} placeholder="一句话介绍自己..." style={{ ...inputStyle, resize: 'vertical' }} />

          <label style={{ fontSize: '13px', display: 'block', marginBottom: '6px', color: 'var(--text-secondary)' }}>擅长技能 (用逗号隔开)</label>
          <input value={skills} onChange={e => setSkills(e.target.value)} placeholder="如: ComfyUI, 提示词, 视频剪辑" style={inputStyle} />

          <label style={{ fontSize: '13px', display: 'block', marginBottom: '6px', color: 'var(--text-secondary)' }}>GitHub / 作品链接</label>
          <input value={github} onChange={e => setGithub(e.target.value)} placeholder="https://..." style={inputStyle} />

          <button type="submit" disabled={saving} style={{ width: '100%', padding: '12px', background: 'var(--cyan)', color: '#05070d', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '8px' }}>
            {saving ? '保存中...' : '保存个人资料'}
          </button>
        </form>
      </div>

      {/* 右侧：账号安全 */}
      <div>
        <div className="ui-card" style={{ padding: '32px', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '24px', color: 'var(--cyan)' }}>账号安全</h2>
          
          <label style={{ fontSize: '13px', display: 'block', marginBottom: '6px', color: 'var(--text-secondary)' }}>登录邮箱 (不可修改)</label>
          <input value={user.email} disabled style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }} />

          <form onSubmit={handleUpdatePassword}>
            <label style={{ fontSize: '13px', display: 'block', marginBottom: '6px', color: 'var(--text-secondary)' }}>修改密码</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="输入新密码 (至少6位)" style={inputStyle} />
            {pwdMsg && <p style={{ fontSize: '12px', color: pwdMsg.includes('成功') ? 'var(--green)' : '#ff4444', marginBottom: '16px' }}>{pwdMsg}</p>}
            <button type="submit" style={{ width: '100%', padding: '12px', background: 'transparent', color: 'var(--cyan)', border: '1px solid var(--cyan)', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              确认修改密码
            </button>
          </form>
        </div>
      </div>

    </div>
  )
}