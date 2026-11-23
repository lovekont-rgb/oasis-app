'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { updateProfile, updatePassword, deleteAccount } from './actions';

export default function SettingsClient({ initialUser, initialProfile }: { initialUser: any, initialProfile: any }) {
  const supabase = createClient();
  
  // 基础资料 state
  const [username, setUsername] = useState(initialProfile.username || '');
  const [bio, setBio] = useState(initialProfile.bio || '');
  const [skills, setSkills] = useState((initialProfile.skills || []).join(', '));
  const [github, setGithub] = useState(initialProfile.social_links?.github || '');
  const [avatarUrl, setAvatarUrl] = useState(initialProfile.avatar_url || null);
  
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // 改密 state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // 注销 state
  const [confirmEmail, setConfirmEmail] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setMsg({ type: 'err', text: '头像大小不能超过 2MB' });
      return;
    }
    setUploading(true);
    setMsg(null);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${initialUser.id}-${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from('avatars').upload(fileName, file, { upsert: true });
    
    if (error) {
      setMsg({ type: 'err', text: '上传失败：' + error.message });
      setUploading(false);
      return;
    }
    
    const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
    setAvatarUrl(data.publicUrl);
    
    await updateProfile({ username, bio, skills, github, avatar_url: data.publicUrl });
    setUploading(false);
    window.location.reload();
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    const res = await updateProfile({ username, bio, skills, github });
    if (res.success) {
      setMsg({ type: 'ok', text: '资料已保存' });
    } else {
      setMsg({ type: 'err', text: res.error || '保存失败' });
    }
    setSaving(false);
  };

  const handleUnbindGithub = async () => {
    if (!window.confirm('确定要解除 GitHub 绑定吗？')) return;
    setGithub('');
    setSaving(true);
    setMsg(null);
    const res = await updateProfile({ username, bio, skills, github: '' });
    if (res.success) {
      setMsg({ type: 'ok', text: 'GitHub 已解绑' });
    } else {
      setMsg({ type: 'err', text: res.error || '解绑失败' });
    }
    setSaving(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMsg({ type: 'err', text: '两次输入的密码不一致' });
      return;
    }
    setChangingPassword(true);
    setMsg(null);
    const res = await updatePassword(newPassword);
    if (res.success) {
      setMsg({ type: 'ok', text: '密码已更新' });
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setMsg({ type: 'err', text: res.error || '修改失败' });
    }
    setChangingPassword(false);
  };

  const handleDeleteAccount = async () => {
    if (confirmEmail.trim() !== initialUser.email) {
      setMsg({ type: 'err', text: '邮箱输入不正确，无法注销' });
      return;
    }
    if (!window.confirm('🚨 警告：确定要永久注销账号吗？该操作会删除你的所有作品、问答、学习进度，且不可恢复！')) return;
    
    setDeleting(true);
    setMsg(null);
    const res = await deleteAccount();
    if (res.success) {
      await supabase.auth.signOut();
      window.location.replace('/login');
    } else {
      setMsg({ type: 'err', text: res.error || '注销失败' });
      setDeleting(false);
    }
  };

  const cardStyle: React.CSSProperties = {
    background: 'var(--surface-card)',
    border: '1px dashed var(--border-subtle)',
    borderRadius: '16px',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    borderBottom: '1px solid var(--border-subtle)',
    paddingBottom: '16px',
    margin: 0,
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '13px',
    color: 'var(--text-secondary)',
    marginBottom: '8px',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid var(--border-subtle)',
    background: 'rgba(0, 0, 0, 0.2)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .settings-grid {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 24px;
          align-items: stretch; /* 改为 stretch，使左右两列等高 */
        }
        @media (max-width: 900px) {
          .settings-grid {
            grid-template-columns: 1fr;
          }
        }
      `}} />

      {msg && (
        <div style={{
          padding: '12px 16px', borderRadius: '10px', fontSize: '14px', marginBottom: '24px',
          background: msg.type === 'ok' ? 'rgba(60, 220, 140, 0.1)' : 'rgba(255, 68, 68, 0.1)',
          color: msg.type === 'ok' ? 'var(--green)' : 'var(--danger)',
          border: `1px solid ${msg.type === 'ok' ? 'var(--green)' : 'var(--danger)'}`,
        }}>
          {msg.text}
        </div>
      )}

      <div className="settings-grid">
        
        {/* 左侧：基础资料 (设置 height: 100% 撑满整列) */}
        <form onSubmit={handleSaveProfile} style={{ ...cardStyle, height: '100%' }}>
          <h2 style={sectionTitleStyle}>基础资料</h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ 
              width: '72px', height: '72px', borderRadius: '50%', 
              background: 'linear-gradient(135deg, var(--violet), var(--cyan))', 
              overflow: 'hidden', display: 'grid', placeItems: 'center', 
              color: '#fff', fontSize: '28px', fontWeight: 'bold' 
            }}>
              {avatarUrl ? <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (username.charAt(0).toUpperCase() || 'U')}
            </div>
            <div>
              <label style={{ 
                padding: '8px 16px', borderRadius: '100px', border: '1px solid var(--cyan)', 
                color: 'var(--cyan)', fontSize: '13px', cursor: 'pointer', display: 'inline-block',
                transition: 'all 0.2s'
              }}>
                {uploading ? '上传中…' : '更换头像'}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} disabled={uploading} />
              </label>
              <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '8px' }}>支持 JPG/PNG，最大 2MB</p>
            </div>
          </div>

          <div>
            <label style={labelStyle}>昵称</label>
            <input value={username} onChange={e => setUsername(e.target.value)} style={inputStyle} placeholder="你的昵称" />
          </div>
          
          <div>
            <label style={labelStyle}>个人简介</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="一句话介绍自己" />
          </div>
          
          <div>
            <label style={labelStyle}>技能标签（用逗号分隔）</label>
            <input value={skills} onChange={e => setSkills(e.target.value)} style={inputStyle} placeholder="如：AI绘画, 视频剪辑, 提示词工程" />
          </div>
          
          <div>
            <label style={labelStyle}>GitHub 主页</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input value={github} onChange={e => setGithub(e.target.value)} style={{ ...inputStyle, flex: 1 }} placeholder="https://github.com/yourname" />
              {github && (
                <button type="button" onClick={handleUnbindGithub} style={{ 
                  padding: '0 20px', borderRadius: '10px', border: '1px solid var(--danger)', 
                  color: 'var(--danger)', background: 'transparent', cursor: 'pointer', 
                  fontSize: '13px', whiteSpace: 'nowrap', transition: 'all 0.2s' 
                }}>
                  解除绑定
                </button>
              )}
            </div>
          </div>

          <button type="submit" disabled={saving} style={{ 
            padding: '12px 32px', borderRadius: '100px', border: 'none', 
            background: saving ? 'var(--border-subtle)' : 'linear-gradient(120deg, var(--cyan), #4ae0ff)', 
            color: '#05070d', fontWeight: 700, fontSize: '14px', alignSelf: 'flex-start',
            cursor: saving ? 'not-allowed' : 'pointer', boxShadow: saving ? 'none' : '0 0 20px rgba(0,212,255,0.3)',
            marginTop: 'auto' /* 让保存按钮自动吸附在卡片最底部 */
          }}>
            {saving ? '保存中…' : '保存资料'}
          </button>
        </form>

        {/* 右侧：上下两个模块 (同样 height: 100%) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
          
          {/* 右上：修改密码 */}
          <form onSubmit={handleUpdatePassword} style={cardStyle}>
            <h2 style={sectionTitleStyle}>修改密码</h2>
            <div>
              <label style={labelStyle}>新密码</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={inputStyle} placeholder="至少 6 位" />
            </div>
            <div>
              <label style={labelStyle}>确认新密码</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={inputStyle} placeholder="再次输入新密码" />
            </div>
            <button type="submit" disabled={changingPassword || !newPassword} style={{ 
              padding: '12px 32px', borderRadius: '100px', border: '1px solid var(--cyan)', 
              background: 'transparent', color: 'var(--cyan)', fontWeight: 700, fontSize: '14px', alignSelf: 'flex-start',
              cursor: (changingPassword || !newPassword) ? 'not-allowed' : 'pointer',
              opacity: (changingPassword || !newPassword) ? 0.5 : 1
            }}>
              {changingPassword ? '更新中…' : '更新密码'}
            </button>
          </form>

          {/* 右下：注销账号 (使用 marginTop: auto 把它推到最底部) */}
          <div style={{ ...cardStyle, borderColor: 'rgba(255, 68, 68, 0.4)', marginTop: 'auto' }}>
            <h2 style={{ ...sectionTitleStyle, color: 'var(--danger)', borderBottomColor: 'rgba(255, 68, 68, 0.2)' }}>注销账号</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              注销账号是不可逆操作。注销后，你的个人资料、学习进度、发布的作品、问答与所有互动数据将被永久删除，且无法恢复。
            </p>
            
            <div>
              <label style={labelStyle}>请输入你的登录邮箱 <strong style={{ color: 'var(--text-primary)' }}>{initialUser.email}</strong> 以确认</label>
              <input value={confirmEmail} onChange={e => setConfirmEmail(e.target.value)} style={{ ...inputStyle, borderColor: 'rgba(255, 68, 68, 0.3)' }} placeholder="输入邮箱" />
            </div>

            <button type="button" onClick={handleDeleteAccount} disabled={deleting || !confirmEmail} style={{ 
              padding: '12px 32px', borderRadius: '100px', border: 'none', 
              background: deleting || !confirmEmail ? 'var(--border-subtle)' : 'var(--danger)', 
              color: deleting || !confirmEmail ? 'var(--text-dim)' : '#fff', fontWeight: 700, fontSize: '14px', alignSelf: 'flex-start',
              cursor: deleting || !confirmEmail ? 'not-allowed' : 'pointer', transition: 'all 0.2s'
            }}>
              {deleting ? '正在注销…' : '永久注销账号'}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}