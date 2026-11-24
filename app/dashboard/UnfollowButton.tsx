'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toggleFollow } from '@/app/portfolio/author/[name]/followActions';

export default function UnfollowButton({ targetUserId, targetUsername }: { targetUserId: string, targetUsername: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUnfollow = async () => {
    if (!window.confirm(`确定不再关注 ${targetUsername} 吗？`)) return;
    setLoading(true);
    const res = await toggleFollow(targetUserId, true, targetUsername);
    if (res.success) {
      router.refresh(); // 刷新当前页面
    } else {
      alert(res.error);
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleUnfollow}
      disabled={loading}
      style={{
        padding: '4px 12px', borderRadius: '100px', border: '1px solid var(--border-subtle)',
        background: 'transparent', color: 'var(--text-secondary)', fontSize: '12px',
        cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s'
      }}
      onMouseEnter={e => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.borderColor = 'var(--danger)'; }}
      onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
    >
      {loading ? '...' : '取消关注'}
    </button>
  );
}