'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminLogoutButton() {
  const supabase = createClient()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
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