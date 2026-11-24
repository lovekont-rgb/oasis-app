import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import FollowButton from './FollowButton';

export const instant = false;

export default async function AuthorPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  const supabase = await createClient();
  
  // ★ 核心修复：加 .select() 并确保拉最新
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', decodedName)
    .single();
    
  if (!profile) notFound();
  
  const { data: portfolios } = await supabase
    .from('portfolios')
    .select('*')
    .eq('user_id', profile.id) // ★ 改用 user_id 匹配，避免更名后匹配失败
    .eq('status', 'approved')
    .order('created_at', { ascending: false });
  
  const { count: followersCount } = await supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', profile.id);
  const { count: followingCount } = await supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', profile.id);
  
  const { data: { user } } = await supabase.auth.getUser();
  let isFollowing = false;
  if (user) {
    const { data: follow } = await supabase.from('follows').select('id').eq('follower_id', user.id).eq('following_id', profile.id).maybeSingle();
    isFollowing = !!follow;
  }

  const totalLikes = (portfolios || []).reduce((acc, p) => acc + (p.likes_count || 0), 0);

  return (
    <main className="page-container">
      <div className="ui-badge">
        <span className="ui-badge-dot" />
        AUTHOR PROFILE
      </div>
      
      <div className="ui-card" style={{ padding: '40px', marginBottom: '40px', display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--violet), var(--cyan))', overflow: 'hidden', display: 'grid', placeItems: 'center', color: '#fff', fontSize: '48px', fontWeight: 'bold', flexShrink: 0 }}>
          {/* ★ 强制渲染最新头像 */}
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            decodedName.charAt(0).toUpperCase()
          )}
        </div>
        <div style={{ flex: 1, minWidth: '260px' }}>
          <h1 className="ui-title" style={{ fontSize: '32px', marginBottom: '8px' }}>{profile.username || decodedName}</h1>
          <p className="ui-subtitle" style={{ margin: 0, marginBottom: '16px', fontSize: '15px' }}>{profile.bio || '这个创作者很低调，还没有写简介。'}</p>
          
          <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
            <div><strong style={{ color: 'var(--text-primary)', fontSize: '18px', fontFamily: 'Orbitron' }}>{portfolios?.length || 0}</strong> <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>作品</span></div>
            <div><strong style={{ color: 'var(--text-primary)', fontSize: '18px', fontFamily: 'Orbitron' }}>{followersCount || 0}</strong> <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>粉丝</span></div>
            <div><strong style={{ color: 'var(--text-primary)', fontSize: '18px', fontFamily: 'Orbitron' }}>{followingCount || 0}</strong> <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>关注</span></div>
            <div><strong style={{ color: 'var(--text-primary)', fontSize: '18px', fontFamily: 'Orbitron' }}>{totalLikes}</strong> <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>获赞</span></div>
          </div>

          {user && user.id !== profile.id && (
            <FollowButton targetUserId={profile.id} initialIsFollowing={isFollowing} targetUsername={profile.username || decodedName} />
          )}
        </div>
      </div>

      <h2 className="ui-section-title">TA 的作品</h2>
      {(portfolios || []).length === 0 ? (
        <div className="ui-card" style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>📭</div>
          <p style={{ color: 'var(--text-secondary)' }}>还没有发布过作品</p>
        </div>
      ) : (
        <div className="ui-grid-3">
          {portfolios!.map(p => (
             <Link key={p.id} href={`/portfolio/${p.id}`} className="ui-card" style={{ padding: 0, overflow: 'hidden', textDecoration: 'none' }}>
               <div style={{ height: '200px', background: 'var(--bg-void)', overflow: 'hidden' }}>
                 <img src={p.cover_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe'} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               </div>
               <div style={{ padding: '20px' }}>
                 <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>{p.title}</h3>
                 <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>❤️ {p.likes_count} · ⭐ {p.collects_count}</div>
               </div>
             </Link>
          ))}
        </div>
      )}
    </main>
  )
}