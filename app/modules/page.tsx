import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import styles from './modules.module.css'

export const instant = false

export default async function ModulesPage() {
  const supabase = await createClient()
  // 去数据库拉取数据
  const { data: modulesData } = await supabase.from('courses').select('*').order('id')

  return (
    <main className="page-container">
      <div className="ui-badge"><span className="ui-badge-dot"></span>COURSE MODULES</div>
      <h1 className="ui-title">
        按能力组织， <span className="ui-title-gradient">不按工具堆砌</span>
      </h1>
      <p className="ui-subtitle">
        每个模块包含大纲、课时、先修要求和配套项目。课时为参考值，实际学习节奏因人而异。建议按“学习路径”的阶段顺序推进，但模块之间可以交叉参考。
      </p>

      <div className="ui-grid-2">
        {modulesData?.map((mod) => (
          // 👈 注意这里：把 div 换成了 Link，并加上了 href
          <Link href={`/modules/${mod.id}`} key={mod.id} className="ui-card" style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none' }}>
            
            <div className={styles.cardTop}>
              <h2>{mod.title}</h2>
              <div className={styles.iconBox}>{mod.icon}</div>
            </div>
            
            <div className={styles.meta}>{mod.meta}</div>
            <p className={styles.desc}>{mod.description}</p>
            
            <ul className={styles.syllabus}>
              {mod.syllabus.map((item: string, i: number) => (
                <li key={i}>
                  <span className={styles.number}>{String(i + 1).padStart(2, '0')}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            
            <div className={styles.prereq}>先修：<b>{mod.prereq}</b></div>
            
            <div className={styles.chips}>
              {mod.chips.map((chip: string, i: number) => (
                <span key={i} className={styles.chip}>{chip}</span>
              ))}
            </div>
          </Link> // 👈 注意这里：闭合标签也必须是 Link
        ))}
      </div>

      <div className={styles.ctaGroup}>
        <Link href="/prompts" className={styles.btnPrimary}>深入提示词工程 →</Link>
        <Link href="/projects" className={styles.btnGhost}>查看项目实战</Link>
      </div>
    </main>
  )
}