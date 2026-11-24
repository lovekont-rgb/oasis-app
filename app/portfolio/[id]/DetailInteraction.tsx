'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { formatRelativeTime } from '@/lib/format';

export default function DetailInteraction({ 
  portfolioId, 
  initialInteractions, 
  initialComments,
  currentUser 
}: { 
  portfolioId: number, 
  initialInteractions: any[], 
  initialComments: any[],
  currentUser: any 
}) {
  const supabase = createClient();
  const router = useRouter();
  
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(initialComments);
  const [submitting, setSubmitting] = useState(false);

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return alert('请先登录');
    if (!comment.trim()) return;
    setSubmitting(true);
    
    const { error } = await supabase.from('portfolio_comments').insert({
      portfolio_id: portfolioId,
      user_id: currentUser.id,
      user_name: currentUser.email?.split('@')[0] || '用户', // 保留历史兼容
      content: comment.trim()
    });

    if (error) {
      alert('评论失败：' + error.message);
    } else {
      setComment('');
      router.refresh(); // ★ 刷新服务端数据，拉取带最新头像的评论
    }
    setSubmitting(false);
  };

  return (
    <div style={{ marginTop: '48px', borderTop: '1px solid var(--border-subtle)', paddingTop: '32px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>评论 ({comments.length})</h3>

      {currentUser ? (
        <form onSubmit={handleComment} style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          <input 
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="发一条友善的评论…"
            style={{ flex: 1, padding: '12px 16px', borderRadius: '100px', border: '1px solid var(--border-subtle)', background: 'var(--surface-card)', color: 'var(--text-primary)', outline: 'none' }}
          />
          <button type="submit" disabled={submitting || !comment.trim()} style={{ padding: '0 24px', borderRadius: '100px', background: 'var(--cyan)', color: '#05070d', fontWeight: 'bold', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer' }}>
            发送
          </button>
        </form>
      ) : (
        <div style={{ padding: '24px', background: 'var(--surface-card)', borderRadius: '12px', textAlign: 'center', marginBottom: '32px', color: 'var(--text-secondary)' }}>
          请登录后参与评论。
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {comments.map((c: any) => {
          // ★ 核心修复：取联表查询的最新头像
          const commenterName = c.profiles?.username || c.user_name || '匿名用户';
          const commenterAvatar = c.profiles?.avatar_url;

          return (
            <div key={c.id} style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--violet), var(--cyan))', overflow: 'hidden', display: 'grid', placeItems: 'center', color: '#fff', fontSize: '14px', fontWeight: 'bold', flexShrink: 0 }}>
                {commenterAvatar ? (
                  <img src={commenterAvatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  commenterName.charAt(0).toUpperCase()
                )}
              </div>
              <div style={{ flex: 1, background: 'var(--surface-card)', padding: '16px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{commenterName}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{formatRelativeTime(c.created_at)}</span>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{c.content}</p>
              </div>
            </div>
          );
        })}
        {comments.length === 0 && <p style={{ color: 'var(--text-dim)', fontSize: '13px' }}>还没有评论，来抢沙发吧。</p>}
      </div>
    </div>
  );
}