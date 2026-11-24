import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import DetailInteraction from './DetailInteraction';

export const instant = false;

export default async function PortfolioDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // ★ 核心修复：联表查作者信息
  const { data: portfolio } = await supabase
    .from('portfolios')
    .select('*, profiles!user_id(username, avatar_url, bio)')
    .eq('id', id)
    .single();

  if (!portfolio) notFound();

  // 查评论
  const { data: comments } = await supabase
    .from('portfolio_comments')
    .select('*')
    .eq('portfolio_id', id)
    .order('created_at', { ascending: false });

  // 查互动记录
  let interactions: any[] = [];
  if (user) {
    const { data } = await supabase.from('portfolio_interactions').select('*').eq('portfolio_id', id).eq('user_id', user.id);
    interactions = data || [];
  }
  
  const authorName = portfolio.profiles?.username || portfolio.author_name;
  const authorAvatar = portfolio.profiles?.avatar_url;
  const authorBio = portfolio.profiles?.bio;

  return (
    <main className="page-container">
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px', alignItems: 'start' }}>
        {/* 左侧：媒体文件 */}
        <div>
          <div style={{ background: '#000', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-subtle)', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {portfolio.file_type === 'video' ? (
              <video src={portfolio.file_url} controls style={{ width: '100%', maxHeight: '600px' }} />
            ) : (
              <iframe src={portfolio.file_url} style={{ width: '100%', height: '600px', border: 'none' }} />
            )}
          </div>
          
          <div style={{ marginTop: '32px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>{portfolio.title}</h1>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{portfolio.content}</p>
          </div>

          <DetailInteraction portfolioId={portfolio.id} initialInteractions={interactions} currentUser={user} />
        </div>

        {/* 右侧：作者卡片 */}
        <div style={{ position: 'sticky', top: '100px' }}>
          <div className="ui-card" style={{ textAlign: 'center', padding: '32px 24px' }}>
            <Link href={`/portfolio/author/${encodeURIComponent(authorName)}`} style={{ display: 'inline-block', width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--violet), var(--cyan))', overflow: 'hidden', marginBottom: '16px', textDecoration: 'none' }}>
              {/* ★ 头像实时渲染 */}
              {authorAvatar ? (
                <img src={authorAvatar} alt={authorName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: '#fff', fontSize: '32px', fontWeight: 'bold' }}>{authorName.charAt(0).toUpperCase()}</div>
              )}
            </Link>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
              <Link href={`/portfolio/author/${encodeURIComponent(authorName)}`} style={{ color: 'inherit', textDecoration: 'none' }}>{authorName}</Link>
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>{authorBio || '这个创作者很低调，还没有写简介。'}</p>
            
            <Link href={`/portfolio/author/${encodeURIComponent(authorName)}`} style={{ display: 'block', padding: '10px', borderRadius: '100px', border: '1px solid var(--cyan)', color: 'var(--cyan)', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>
              查看主页
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}