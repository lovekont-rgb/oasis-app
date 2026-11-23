import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const instant = false;

async function DashboardStats({ userId }: { userId: string }) {
  const supabase = await createClient();
  
  const { count: learningCount } = await supabase.from('learning_progress').select('*', { count: 'exact', head: true }).eq('user_id', userId);
  const { count: portfolioCount } = await supabase.from('portfolios').select('*', { count: 'exact', head: true }).eq('user_id', userId);
  
  const { data: portfolios } = await supabase.from('portfolios').select('likes_count, dislikes_count').eq('user_id', userId);
  const likes = (portfolios || []).reduce((acc, p) => acc + (p.likes_count || 0), 0);
  const dislikes = (portfolios || []).reduce((acc, p) => acc + (p.dislikes_count || 0), 0);
  
  const { count: collectCount } = await supabase.from('portfolio_interactions').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('type', 'collect');
  const { count: qaCount } = await supabase.from('community_questions').select('*', { count: 'exact', head: true }).eq('user_id', userId);
  
  // ★ 新增：被关注数（粉丝数）
  const { count: followersCount } = await supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', userId);

  const stats = [
    { label: '已学课时', value: learningCount || 0 },
    { label: '发布作品', value: portfolioCount || 0 },
    { label: '获赞 / 踩', value: `${likes} / ${dislikes}` },
    { label: '我的收藏', value: collectCount || 0 },
    { label: '我的提问', value: qaCount || 0 },
    { label: '被关注（粉丝）', value: followersCount || 0 },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px' }}>
       {stats.map(s => (
         <div key={s.label} className="ui-card" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--cyan)', fontFamily: 'Orbitron, sans-serif' }}>{s.value}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>{s.label}</div>
         </div>
       ))}
    </div>
  )
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single();
  const username = profile?.username || user.email?.split('@')[0] || 'user';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>概览</h1>
        {/* ★ 新增：个人主页入口 */}
        <Link href={`/portfolio/author/${encodeURIComponent(username)}`} style={{ 
          padding: '10px 20px', borderRadius: '100px', 
          background: 'linear-gradient(120deg, var(--cyan), #4ae0ff)', 
          color: '#05070d', fontWeight: 700, textDecoration: 'none', 
          fontSize: '14px', boxShadow: '0 0 20px rgba(0,212,255,0.3)' 
        }}>
          查看我的主页 →
        </Link>
      </div>
      
      <Suspense fallback={<div style={{ color: 'var(--text-secondary)' }}>数据加载中…</div>}>
        <DashboardStats userId={user.id} />
      </Suspense>
    </div>
  )
}