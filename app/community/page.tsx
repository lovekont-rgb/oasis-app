import Link from 'next/link'
import styles from './community.module.css'

export const instant = false

export default function CommunityPage() {
  return (
    <main className="page-container">
      {/* 页面头部 */}
      <div className="ui-badge"><span className="ui-badge-dot"></span>COMMUNITY</div>
      <h1 className="ui-title">
        学习不只是 <span className="ui-title-gradient">看课</span>
      </h1>
      <p className="ui-subtitle">
        提示词库、作品拆解、周刊与问答。把“学”和“做”放在同一个场域里。好的社区不是信息流，而是过滤器——从高密度噪音里筛出值得保存的判断、方法和样本。
      </p>

      {/* 两列网格布局 */}
      <div className="ui-grid-2">
        
        {/* 卡片 1：提示词库 */}
        <div className="ui-card">
          <div className={styles.cardHeader}>
            <h2>提示词库</h2>
            <span className={styles.badgeNum}>480+</span>
          </div>
          <p className={styles.cardDesc}>按场景分类，复制即用。每个提示词附带适用模型和输出示例说明。</p>
          
          <div className={styles.list}>
            <div className={styles.listItem}>
              <h4>结构化写作 · 长文大纲</h4>
              <p>角色 + 背景 + 约束 + 输出格式，适合公众号、报告、提案。</p>
            </div>
            <div className={styles.listItem}>
              <h4>人像摄影 · 镜头控制</h4>
              <p>主体 + 光线 + 景别 + 焦段 + 风格，适合 Midjourney / FLUX。</p>
            </div>
            <div className={styles.listItem}>
              <h4>视频镜头 · 首尾帧</h4>
              <p>可灵首尾帧工作流的配套提示词结构。</p>
            </div>
            <div className={styles.listItem}>
              <h4>Agent 系统提示词</h4>
              <p>角色、边界、流程、输出规范、异常处理的完整骨架。</p>
            </div>
          </div>
          
          <div className={styles.tagCloud}>
            <span className={styles.tag}>写作</span>
            <span className={styles.tag}>设计</span>
            <span className={styles.tag}>视频</span>
            <span className={styles.tag}>编程</span>
            <span className={styles.tag}>商业</span>
          </div>
        </div>

        {/* 卡片 2：作品广场 */}
        <div className="ui-card">
          <div className={styles.cardHeader}>
            <h2>作品广场</h2>
            <span className={styles.badgeNum}>1.2k</span>
          </div>
          <p className={styles.cardDesc}>学习者发布的 AI 图集、短片、Agent 项目和商业交付案例，附带过程拆解。</p>
          
          <div className={styles.list}>
            <div className={styles.listItem}>
              <h4>「城市折叠」AI 图集</h4>
              <p>12 张系列作品，完整展示从提示词迭代到 LoRA 训练的控图过程。</p>
            </div>
            <div className={styles.listItem}>
              <h4>3 分钟 AI 漫剧《回声》</h4>
              <p>含剧本、分镜表、角色设定和 RunningHub 工作流截图。</p>
            </div>
            <div className={styles.listItem}>
              <h4>品牌视觉提案 · 咖啡包装</h4>
              <p>商业级交付案例，含报价思路和甲方修改记录。</p>
            </div>
            <div className={styles.listItem}>
              <h4>Coze 工作流：周报生成器</h4>
              <p>可复制的工作流结构，输入工作要点，输出格式化周报。</p>
            </div>
          </div>
        </div>

        {/* 卡片 3：AI 周刊 */}
        <div className="ui-card">
          <div className={styles.cardHeader}>
            <h2>AI 周刊</h2>
            <span className={styles.badgeNum}>Weekly</span>
          </div>
          <p className={styles.cardDesc}>每周精选模型更新、工具迭代与值得回看的落地案例。不搬运新闻，只沉淀判断。</p>
          
          <div className={styles.weekItem}>
            <span className={styles.weekVol}>Vol.04</span>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>结构化 Prompt 正在取代“魔法词”</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-dim)' }}>从堆词到配方和镜头表，一次只改一个变量的迭代方法正在成为共识。</p>
            </div>
          </div>
          <div className={styles.weekItem}>
            <span className={styles.weekVol}>Vol.03</span>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>视频工具的“基线”配置</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-dim)' }}>可灵 + 即梦 + 剪映构成新手可用的最小闭环，Runway / Pika 按需引入。</p>
            </div>
          </div>
          <div className={styles.weekItem}>
            <span className={styles.weekVol}>Vol.02</span>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>LoRA 训练的门槛正在降低</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-dim)' }}>ComfyUI 内批量训练工作流让角色一致性不再是少数人的能力。</p>
            </div>
          </div>
          <div className={styles.weekItem}>
            <span className={styles.weekVol}>Vol.01</span>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>创刊号：从噪音里筛出信号</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-dim)' }}>模型在变强，真正拉开差距的是控制力和工作流。</p>
            </div>
          </div>
        </div>

        {/* 卡片 4：问答与互助 */}
        <div className="ui-card">
          <div className={styles.cardHeader}>
            <h2>问答与互助</h2>
          </div>
          <p className={styles.cardDesc}>工具报错、工作流卡点、商业接单疑问——有人踩过坑，也有人正在解决。</p>
          
          {/* 使用 details 标签实现无 JS 折叠 */}
          <details className={styles.faqItem}>
            <summary className={styles.faqQ}>ComfyUI 工作流跑不通，最先检查什么？</summary>
            <div className={styles.faqA}>先检查模型路径和节点连接顺序。加载模型、采样、解码、保存的节点顺序不能乱；自定义节点缺失也会导致工作流静默失败。</div>
          </details>
          <details className={styles.faqItem}>
            <summary className={styles.faqQ}>新手做 AI 视频，工具应该装几个？</summary>
            <div className={styles.faqA}>不用全装。画面先用可灵 + 即梦，两者中文友好、支持图生视频；剪辑固定剪映。需要特效或局部控制时再开 Runway / Pika。</div>
          </details>
          <details className={styles.faqItem}>
            <summary className={styles.faqQ}>提示词怎么写才能稳定复现？</summary>
            <div className={styles.faqA}>结构化 + 单变量迭代。先固定角色、输入、输出和边界，然后一次只改一个变量，对比结果，固化有效版本。</div>
          </details>
          <details className={styles.faqItem}>
            <summary className={styles.faqQ}>第一个商单应该接什么类型？</summary>
            <div className={styles.faqA}>从你最有把握的交付物开始。品牌图集或 15–30 秒短视频是较常见的入门商单，报价可参考项目实战页面的区间，但以实际沟通为准。</div>
          </details>
        </div>

      </div>

      {/* 底部 CTA 按钮 */}
      <div className={styles.ctaGroup}>
        <Link href="/" className={styles.btnPrimary}>回到首页，开始你的路径 →</Link>
      </div>

    </main>
  )
}