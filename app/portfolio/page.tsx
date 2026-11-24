import { createClient } from '@/lib/supabase/server';
import PortfolioClient from './PortfolioClient';

export const instant = false;

export default async function PortfolioPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // ★ 核心修复：通过 user_id 联表查询 profiles 表，实时获取最新昵称和头像
  const { data: portfolios } = await supabase
    .from('portfolios')
    .select('*, profiles!user_id(username, avatar_url)')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  // 查询当前用户的互动记录
  let interactions: any[] = [];
  if (user) {
    const { data } = await supabase
      .from('portfolio_interactions')
      .select('*')
      .eq('user_id', user.id);
    interactions = data || [];
  }

  return (
    <main className="page-container">
      <div className="ui-badge">
        <span className="ui-badge-dot" />
        SHOWCASE
      </div>
      <h1 className="ui-title">
        作品<span className="ui-title-gradient">广场</span>
      </h1>
      <p className="ui-subtitle">
        浏览学员的实战作品，点赞、收藏或留言，见证真实的交付。
      </p>

      <PortfolioClient
        initialPortfolios={portfolios || []}
        initialInteractions={interactions}
        currentUser={user}
      />
    </main>
  );
}