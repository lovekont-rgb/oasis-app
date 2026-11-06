import { createClient } from '@/lib/supabase/server'
import PromptClient from './PromptClient'
import styles from './prompts.module.css'

export const instant = false

export default async function PromptsPage() {
  const supabase = await createClient()
  const { data: prompts } = await supabase.from('prompts').select('*').order('id')

  return (
    <main className={styles.container}>
      {/* 头部 */}
      <div className={styles.badge}><span className={styles.dot}></span>PROMPT ENGINEERING</div>
      <h1 className={styles.title}>从 <span className={styles.gradient}>堆词</span> 到 <span className={styles.gradient}>结构化控制</span></h1>
      <p className={styles.subtitle}>
        2026 年最有价值的共识之一：Prompt 正在从“描述画面”走向“控制画面”。同样的模型，有人一直在抽卡，有人已经开始稳定出片——差别不在模型，而在有没有把自己的方法攒下来。
      </p>

      {/* 三套公式 */}
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

      {/* 五个解剖层 */}
      <h2 className={styles.sectionTitle}>图像提示词的五个解剖层</h2>
      <div className={styles.anatomyGrid}>
        <div className={styles.anatomyItem}><h4>01 / 主体</h4><p>谁 / 什么。人物、物体、场景的核心描述。越具体越好：年龄、材质、状态。</p></div>
        <div className={styles.anatomyItem}><h4>02 / 动作与关系</h4><p>主体在做什么，与其他元素的关系。动作姿态直接影响手部和肢体的稳定性。</p></div>
        <div className={styles.anatomyItem}><h4>03 / 环境与光线</h4><p>场景、时间、天气、光源方向、色温。光线是画面情绪的底层。</p></div>
        <div className={styles.anatomyItem}><h4>04 / 镜头与构图</h4><p>景别、机位、焦段、景深。镜头语言写清楚，回报会很直接。</p></div>
        <div className={styles.anatomyItem}><h4>05 / 风格与约束</h4><p>艺术风格、参考方向、画质约束、负面提示。约束不是限制，是让输出收敛。</p></div>
        <div className={styles.anatomyItem}><h4>迭代原则</h4><p>固定变量，单点调优。先锁定主体和风格，再逐层调整光线、镜头和细节。</p></div>
      </div>

      {/* 动态模板库 */}
      <h2 className={styles.sectionTitle}>可复制模板库</h2>
      <PromptClient initialPrompts={prompts || []} />

      {/* 四条迭代原则 */}
      <h2 className={styles.sectionTitle} style={{ marginTop: '60px' }}>四条迭代原则</h2>
      <div className={styles.principleGrid}>
        <div className={styles.principleItem}><h4>先结构，后语义</h4><p>角色、输入、输出、边界先立住，语义才有地方使劲。结构为零，模型只能替你猜。</p></div>
        <div className={styles.principleItem}><h4>一次只改一个变量</h4><p>同时改三个词，你无法判断哪个起了作用。单变量迭代才能沉淀可复用的方法。</p></div>
        <div className={styles.principleItem}><h4>用示例代替形容词</h4><p>“高级感”不如一张参考图或一段示例输出。Few-Shot 往往比一堆修饰词更有效。</p></div>
        <div className={styles.principleItem}><h4>把 Prompt 当文档维护</h4><p>版本化、注释、测试。好的 Prompt 不是灵感，是配方和执行文档。</p></div>
      </div>

      {/* 底部 CTA */}
      <div className={styles.ctaSection}>
        <a href="/community" className={styles.btnPrimary}>去提示词库复制更多 →</a>
      </div>
    </main>
  )
}