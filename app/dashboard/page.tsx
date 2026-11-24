import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import UnfollowButton from './UnfollowButton';

export const instant = false;

async function DashboardData({ userId, username }: { userId: string, username: string }) {
  const supabase = await createClient();
  
  // 1. 查基础统计
  const { count: learningCount } = await supabase.from('learning_progress').select('*', { count: 'exact', head: true }).eq('user_id', userId);
  const { count: portfolioCount } = await supabase.from('portfolios').select('*', { count: 'exact', head: true }).eq('user_id', userId);
  const { data: portfolios } = await supabase.from('portfolios').select('likes_count, dislikes_count').eq('user_id', userId);
  const likes = (portfolios || []).reduce((acc, p) => acc + (p.likes_count || 0), 0);
  const dislikes = (portfolios || []).reduce((acc, p) => acc + (p.dislikes_count || 0), 0);
  const { count: collectCount } = await supabase.from('portfolio_interactions').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('type', 'collect');
  const { count: qaCount } = await supabase.from('community_questions').select('*', { count: 'exact', head: true }).eq('user_id', userId);
  
  // 2. 查粉丝和关注者
  const { data: followingData } = await supabase.from('follows').select('following_id').eq('follower_id', userId);
  const followingIds = followingData?.map(f => f.following_id) || [];
  let followingProfiles: any[] = [];
  if (followingIds.length > 0) {
    const { data } = await supabase.from('profiles').select('id, username, avatar_url, bio').in('id', followingIds);
    followingProfiles = data || [];
  }

  const { data: followersData } = await supabase.from('follows').select('follower_id').eq('following_id', userId);
  const followerIds = followersData?.map(f => f.follower_id) || [];
  let followerProfiles: any[] = [];
  if (followerIds.length > 0) {
    const { data } = await supabase.from('profiles').select('id, username, avatar_url, bio').in('id', followerIds);
    followerProfiles = data || [];
  }

  const stats = [
    { label: '已学课时', value: learningCount || 0 },
    { label: '发布作品', value: portfolioCount || 0 },
    { label: '获赞 / 踩', value: `${likes} / ${dislikes}` },
    { label: '我的收藏', value: collectCount || 0 },
    { label: '我的提问', value: qaCount || 0 },
    { label: '粉丝（被关注）', value: followerProfiles.length },
    { label: '我关注的人', value: followingProfiles.length },
  ];

  const Card = ({ user }: { user: any }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-void)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link href={`/portfolio/author/${encodeURIComponent(user.username)}`} style={{ display: 'block', width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--violet), var(--cyan))', overflow: 'hidden', flexShrink: 0 }}>
          {user.avatar_url ? <img src={user.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 'bold' }}>{user.username?.charAt(0).toUpperCase()}</div>}
        </Link>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Link href={`/portfolio/author/${encodeURIComponent(user.username)}`} style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}>{user.username}</Link>
          <span style={{ fontSize: '12px', color: 'var(--text-dim)', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.bio || '暂无简介'}</span>
        </div>
      </div>
      {/* 在「我关注的人」列表中显示取消关注按钮 */}
      {username === user.username ? null : <UnfollowButton targetUserId={user.id} targetUsername={user.username} />}
    </div>
  );

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px', marginBottom: '40px' }}>
        {stats.map(s => (
          <div key={s.label} className="ui-card" style={{ padding: '24px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--cyan)', fontFamily: 'Orbitron, sans-serif' }}>{s.value}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* 我关注的人 */}
        <div className="ui-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>我关注的人</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {followingProfiles.length === 0 ? (
              <p style={{ color: 'var(--text-dim)', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>还没有关注任何人</p>
            ) : (
              followingProfiles.map(u => <Card key={u.id} user={u} />)
            )}
          </div>
        </div>

        {/* 关注我的人（粉丝） */}
        <div className="ui-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>关注我的人（粉丝）</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {followerProfiles.length === 0 ? (
              <p style={{ color: 'var(--text-dim)', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>还没有粉丝，快去发布作品吧</p>
            ) : (
              followerProfiles.map(u => (
                <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'var(--bg-void)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <Link href={`/portfolio/author/${encodeURIComponent(u.username)}`} style={{ display: 'block', width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--violet), var(--cyan))', overflow: 'hidden', flexShrink: 0 }}>
                    {u.avatar_url ? <img src={u.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 'bold' }}>{u.username?.charAt(0).toUpperCase()}</div>}
                  </Link>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Link href={`/portfolio/author/${encodeURIComponent(u.username)}`} style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}>{u.username}</Link>
                    <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{u.bio || '暂无简介'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single();
  const username = profile?.username || user.email?.split('@')[0] || 'user';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>数据概览</h1>
        <Link href={`/portfolio/author/${encodeURIComponent(username)}`} style={{ padding: '10px 20px', borderRadius: '100px', background: 'linear-gradient(120deg, var(--cyan), #4ae0ff)', color: '#05070d', fontWeight: 700, textDecoration: 'none', fontSize: '14px', boxShadow: '0 0 20px rgba(0,212,255,0.3)' }}>
          查看我的主页 →
        </Link>
      </div>
      
      <Suspense fallback={<div style={{ color: 'var(--text-secondary)' }}>数据加载中…</div>}>
        <DashboardData userId={user.id} username={username} />
      </Suspense>
    </div>
  )
}