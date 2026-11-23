'use client';

import { useState } from 'react';
import { toggleFollow } from './followActions';

export default function FollowButton({ 
  targetUserId, 
  initialIsFollowing, 
  targetUsername 
}: { 
  targetUserId: string; 
  initialIsFollowing: boolean; 
  targetUsername: string;
}) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const res = await toggleFollow(targetUserId, isFollowing, targetUsername);
    if (res.success) {
      setIsFollowing(!isFollowing);
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      style={{
        padding: '10px 28px',
        borderRadius: '100px',
        fontSize: '14px',
        fontWeight: 700,
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s',
        ...(isFollowing ? {
          background: 'transparent',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-subtle)',
        } : {
          background: 'linear-gradient(120deg, var(--cyan), #4ae0ff)',
          color: '#05070d',
          border: 'none',
          boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
        })
      }}
    >
      {loading ? '处理中…' : isFollowing ? '已关注' : '关注 TA'}
    </button>
  );
}