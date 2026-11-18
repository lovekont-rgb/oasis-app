'use client'
import { createClient } from '@/lib/supabase/client'

export default function AdminLogoutButton() {
  const supabase = createClient()

  const handleLogout = async () => {
    try {
      // 必须等待清理完成
      await supabase.auth.signOut()
    } catch (error) {
      console.error(error)
    }
    // 强制物理替换跳转
    window.location.replace('/login')
  }

  return (
    <button 
      onClick={handleLogout} 
      style={{ padding: '6px 12px', background: 'rgba(255,68,68,0.1)', color: '#ff4444', border: '1px solid #ff4444', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}
    >
      退出登录
    </button>
  )
}