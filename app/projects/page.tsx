import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import styles from './projects.module.css'

export const instant = false

export default async function ProjectsPage() {
  const supabase = await createClient()
  
  // 并行拉取项目和市场信号
  const [ { data: projects }, { data: signals } ] = await Promise.all([
    supabase.from('project_items').select('*').order('sort_order', { ascending: true }),
    supabase.from('market_signals').select('*').order('sort_order', { ascending: true })
  ])

  return (
    <main className="page-container">
      <div className="ui-badge"><span className="ui-badge-dot"></span>REAL PROJECTS</div>
      <h1 className="ui-title">
        用 <span className="ui-title-gradient">商业交付</span> 检验学习
      </h1>
      <p className="ui-subtitle">
        2026 年 AIGC 市场已经给出了明确的价格信号：AI 视频项目报价可达 1000 元 / 秒，一条 90 秒成品广告 9 万元，AI 短剧 60 秒以上商单报价 25.8 万元。这些数字的意义不是制造焦虑，而是告诉你：市场愿意为能交付的人付费。
      </p>

      {/* 项目卡片网格 */}
      <div className="ui-grid-2">
        {projects?.map((proj) => (
          <div key={proj.id} className="ui-card" style={{ display: 'flex', flexDirection: 'column' }}>
            
            <div className={styles.cardTag}>{proj.tag}</div>
            <h2 className={styles.cardTitle}>{proj.title}</h2>
            <p className={styles.cardDesc}>{proj.description}</p>
            
            <ul className={styles.list}>
              {proj.deliverables?.map((item: string, i: number) => (
                <li key={i} className={styles.listItem}>
                  <span className={styles.arrow}>▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            
            <div className={styles.cardFooter}>
              <div className={styles.price}>
                {proj.price} <span className={styles.unit}>{proj.unit}</span>
              </div>
              <div className={styles.chips}>
                {proj.chips?.map((chip: string, i: number) => (
                  <span key={i} className={styles.chip}>{chip}</span>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* 真实市场信号 */}
      <h2 className="ui-section-title">真实市场信号</h2>
      <p className={styles.marketSubtitle}>
        以下数据来自 2026 年公开报道与创作者访谈，用于校准预期，而非承诺收益。
      </p>
      
      <div className={styles.caseList}>
        {signals?.map((signal) => (
          <div key={signal.id} className={styles.caseItem}>
            <h4>{signal.title}</h4>
            <p>{signal.description}</p>
          </div>
        ))}
      </div>

      <div className={styles.ctaGroup}>
        <Link href="/community" className={styles.btnPrimary}>去社区看作品拆解 →</Link>
      </div>
    </main>
  )
}