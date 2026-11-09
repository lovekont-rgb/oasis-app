import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import styles from './community.module.css'

export const instant = false

export default async function CommunityPage() {
  const supabase = await createClient()
  
  // 并行拉取四个板块的数据
  const [ 
    { data: prompts }, 
    { data: works }, 
    { data: weekly }, 
    { data: faqs } 
  ] = await Promise.all([
    supabase.from('prompts').select('*').limit(4), // 只取最新的4条展示
    supabase.from('community_works').select('*').order('id', { ascending: false }),
    supabase.from('community_weekly').select('*').order('sort_order', { ascending: false }),
    supabase.from('community_faqs').select('*').order('sort_order', { ascending: false })
  ])

  return (
    <main className="page-container">
      <div className="ui-badge"><span className="ui-badge-dot"></span>COMMUNITY</div>
      <h1 className="ui-title">
        学习不只是 <span className="ui-title-gradient">看课</span>
      </h1>
      <p className="ui-subtitle">
        提示词库、作品拆解、周刊与问答。把“学”和“做”放在同一个场域里。好的社区不是信息流，而是过滤器——从高密度噪音里筛出值得保存的判断、方法和样本。
      </p>

      <div className="ui-grid-2">
        
        {/* 1. 提示词库 (动态) */}
        <div className="ui-card">
          <div className={styles.cardHeader}>
            <h2>提示词库</h2>
            <span className={styles.badgeNum}>{prompts?.length || 0} 条推荐</span>
          </div>
          <p className={styles.cardDesc}>按场景分类，复制即用。每个提示词附带适用模型和输出示例说明。</p>
          
          <div className={styles.list}>
            {prompts?.map((p) => (
              <div key={p.id} className={styles.listItem}>
                <h4>{p.title}</h4>
                <p>{p.content.substring(0, 40)}...</p>
              </div>
            ))}
          </div>
          
          <div className={styles.tagCloud} style={{ marginTop: '20px' }}>
            <Link href="/prompts" className={styles.tag}>前往完整提示词库 →</Link>
          </div>
        </div>

        {/* 2. 作品广场 (动态) */}
        <div className="ui-card">
          <div className={styles.cardHeader}>
            <h2>作品广场</h2>
            <span className={styles.badgeNum}>{works?.length || 0}</span>
          </div>
          <p className={styles.cardDesc}>学习者发布的 AI 图集、短片、Agent 项目和商业交付案例，附带过程拆解。</p>
          
          <div className={styles.list}>
            {works?.map((work) => (
              <div key={work.id} className={styles.listItem}>
                <h4>{work.title}</h4>
                <p>{work.description} <span style={{ color: 'var(--cyan)', fontSize: '11px', marginLeft: '8px' }}>@{work.author}</span></p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. AI 周刊 (动态) */}
        <div className="ui-card">
          <div className={styles.cardHeader}>
            <h2>AI 周刊</h2>
            <span className={styles.badgeNum}>Weekly</span>
          </div>
          <p className={styles.cardDesc}>每周精选模型更新、工具迭代与值得回看的落地案例。不搬运新闻，只沉淀判断。</p>
          
          {weekly?.map((item) => (
            <div key={item.id} className={styles.weekItem}>
              <span className={styles.weekVol}>{item.vol}</span>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>{item.title}</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-dim)' }}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 4. 问答与互助 (动态) */}
        <div className="ui-card">
          <div className={styles.cardHeader}>
            <h2>问答与互助</h2>
          </div>
          <p className={styles.cardDesc}>工具报错、工作流卡点、商业接单疑问——有人踩过坑，也有人正在解决。</p>
          
          {faqs?.map((faq) => (
            <details key={faq.id} className={styles.faqItem}>
              <summary className={styles.faqQ}>{faq.question}</summary>
              <div className={styles.faqA}>{faq.answer}</div>
            </details>
          ))}
        </div>

      </div>

      <div className={styles.ctaGroup}>
        <Link href="/" className={styles.btnPrimary}>回到首页，开始你的路径 →</Link>
      </div>
    </main>
  )
}