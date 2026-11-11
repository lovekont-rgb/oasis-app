import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import styles from './community.module.css'

export const instant = false

export default async function CommunityPage() {
  const supabase = await createClient()
  
  // 拉取所有板块数据
  const [ 
    { data: prompts }, 
    { data: works }, 
    { data: weekly }, 
    { data: faqs } 
  ] = await Promise.all([
    supabase.from('prompts').select('*').limit(4),
    supabase.from('community_works').select('*').order('id', { ascending: false }).limit(4),
    supabase.from('community_weekly').select('*').order('sort_order', { ascending: false }).limit(4), // 👈 获取4条周刊
    supabase.from('community_faqs').select('*').order('sort_order', { ascending: false })
  ])

  const cardContainerStyle = {
    display: 'grid', 
    gridTemplateColumns: 'minmax(280px, 1fr) 2fr', 
    gap: '40px', 
    padding: '40px', 
    alignItems: 'start'
  }

  return (
    <main className="page-container">
      <div className="ui-badge"><span className="ui-badge-dot"></span>COMMUNITY</div>
      <h1 className="ui-title">
        学习不只是 <span className="ui-title-gradient">看课</span>
      </h1>
      <p className="ui-subtitle">
        提示词库、作品拆解、周刊与问答。把“学”和“做”放在同一个场域里。好的社区不是信息流，而是过滤器——从高密度噪音里筛出值得保存的判断、方法和样本。
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* 1. 提示词库 */}
        <div className="ui-card" style={cardContainerStyle}>
          <div>
            <div className={styles.cardHeader}>
              <h2>提示词库</h2>
              <span className={styles.badgeNum}>{prompts?.length || 0} 条推荐</span>
            </div>
            <p className={styles.cardDesc}>按场景分类，复制即用。每个提示词附带适用模型和输出示例说明。</p>
            <Link href="/prompts" className={styles.tag} style={{ display: 'inline-block', marginTop: '16px', textDecoration: 'none' }}>
              前往完整提示词库 →
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {prompts?.map((p) => (
              <div key={p.id} style={{ background: 'var(--bg-void)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '6px', color: 'var(--text-primary)' }}>{p.title}</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-dim)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. 作品广场 */}
        <Link href="/portfolio" className="ui-card" style={{ ...cardContainerStyle, textDecoration: 'none', cursor: 'pointer' }}>
          <div>
            <div className={styles.cardHeader}>
              <h2>作品广场</h2>
              <span className={styles.badgeNum}>{works?.length || 0} 个案例</span>
            </div>
            <p className={styles.cardDesc}>学习者发布的 AI 图集、短片、Agent 项目和商业交付案例，附带过程拆解。</p>
            <div style={{ display: 'inline-block', marginTop: '16px', color: 'var(--cyan)', fontWeight: 'bold', fontSize: '14px' }}>
              进入作品广场浏览更多 →
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {works?.map((work) => (
              <div key={work.id} style={{ background: 'var(--bg-void)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '6px', color: 'var(--text-primary)' }}>{work.title}</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-dim)', marginBottom: '8px' }}>{work.description}</p>
                <span style={{ fontSize: '11px', color: 'var(--cyan)' }}>@{work.author}</span>
              </div>
            ))}
          </div>
        </Link>

        {/* 3. AI 周刊 (恢复 4 条展示 + 左侧入口) */}
        <div className="ui-card" style={cardContainerStyle}>
          <div>
            <div className={styles.cardHeader}>
              <h2>AI 周刊</h2>
              <span className={styles.badgeNum}>Weekly</span>
            </div>
            <p className={styles.cardDesc}>每周精选模型更新、工具迭代与值得回看的落地案例。不搬运新闻，只沉淀判断。</p>
            <Link href="/community/weekly" style={{ display: 'inline-block', marginTop: '16px', color: 'var(--cyan)', fontWeight: 'bold', fontSize: '14px', textDecoration: 'none' }}>
              查看全部周刊 →
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {weekly?.map((item) => (
              <Link 
                key={item.id} 
                href={`/community/weekly/${item.id}`}
                style={{ 
                  textDecoration: 'none', display: 'flex', gap: '20px', 
                  background: 'rgba(255,255,255,0.02)', padding: '16px', 
                  borderRadius: '8px', border: '1px solid transparent',
                  transition: '0.3s'
                }} 
                className="hover-card"
              >
                <span style={{ fontFamily: 'Orbitron', color: 'var(--cyan)', flexShrink: 0 }}>{item.vol}</span>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '6px', color: 'var(--text-primary)' }}>{item.title}</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.description}</p>
                </div>
              </Link>
            ))}
            {weekly?.length === 0 && <span style={{ color: 'var(--text-dim)', fontSize: '13px' }}>暂无周刊内容。</span>}
          </div>
        </div>

        {/* 4. 问答与互助 */}
        <div className="ui-card" style={cardContainerStyle}>
          <div>
            <div className={styles.cardHeader}>
              <h2>问答与互助</h2>
            </div>
            <p className={styles.cardDesc}>工具报错、工作流卡点、商业接单疑问——有人踩过坑，也有人正在解决。</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs?.map((faq) => (
              <details key={faq.id} className={styles.faqItem}>
                <summary className={styles.faqQ}>{faq.question}</summary>
                <div className={styles.faqA}>{faq.answer}</div>
              </details>
            ))}
          </div>
        </div>

      </div>

      <div style={{ textAlign: 'center', marginTop: '80px' }}>
        <Link href="/" style={{ padding: '16px 40px', borderRadius: '100px', background: 'linear-gradient(120deg, var(--cyan), #4ae0ff)', color: '#05070d', fontWeight: 'bold', fontSize: '16px', textDecoration: 'none', display: 'inline-block', boxShadow: '0 0 30px rgba(0,212,255,0.3)' }}>
          回到首页，开始你的路径 →
        </Link>
      </div>
    </main>
  )
}