import { createClient } from '@/lib/supabase/server'
import PromptClient from './PromptClient'
import styles from './prompts.module.css'

export const instant = false

export default async function PromptsPage() {
  const supabase = await createClient()
  const { data: prompts } = await supabase.from('prompts').select('*').order('id')

  return (
    <main className={styles.container}>
      <div className={styles.badge}><span className={styles.dot}></span>PROMPT ENGINEERING</div>
      <h1 className={styles.title}>
        从 <span className={styles.gradient}>堆词</span> 到 <span className={styles.gradient}>结构化控制</span>
      </h1>
      <p className={styles.subtitle}>
        2026 年最有价值的共识之一：Prompt 正在从“描述画面”走向“控制画面”。同样的模型，有人一直在抽卡，有人已经开始稳定出片——差别不在模型，而在有没有把自己的方法攒下来。
      </p>

      {/* 静态内容：三套核心公式 */}
      <h2 className={styles.sectionTitle}>三套核心公式</h2>
      <div className={styles.formulaGrid}>
        <div className={styles.formulaCard}>
          <h3>角色定位法</h3>
          <div className={styles.formulaCode}>角色描述 + 任务目标 + 输出要求</div>
          <p>适合写作、分析、方案类任务。先告诉 AI“你是谁”，再告诉它“做什么”和“做到什么程度”。</p>
        </div>
        <div className={styles.formulaCard}>
          <h3>结构化任务法</h3>
          <div className={styles.formulaCode}>背景 + 输入 + 约束 + 输出格式 + 示例</div>
          <p>适合复杂任务。用分隔符划分信息块，减少模型“替你猜”的空间。</p>
        </div>
        <div className={styles.formulaCard}>
          <h3>迭代优化法</h3>
          <div className={styles.formulaCode}>基线 Prompt → 单变量修改 → 对比 → 固化</div>
          <p>一次只改一个变量，才更容易做出可复现的输出。这是“抽卡”和“控图”的分界线。</p>
        </div>
      </div>

      {/* 动态内容：从数据库读取的模板库 */}
      <h2 className={styles.sectionTitle} style={{ marginTop: '60px' }}>可复制模板库</h2>
      <PromptClient initialPrompts={prompts || []} />
      
    </main>
  )
}