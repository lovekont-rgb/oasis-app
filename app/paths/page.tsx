import Link from 'next/link'
import styles from './paths.module.css'

export const instant = false

const pathsData = [
  {
    num: '01',
    title: '剪辑基础',
    subtitle: '剪辑 · 调色 · 节奏 · 42 课时',
    desc: '这个阶段不碰 AI。先把制作能力打牢：即使 AI 工具不顺手，手里也有一条自己剪出来的片子。重点掌握时间线逻辑、镜头衔接、色彩基础和声音设计。',
    core: '时间线剪辑 / 转场 / 调色 / 音频处理',
    tools: ['剪映专业版', 'Premiere Pro', 'DaVinci'],
    practice: '3 条不同节奏的 60 秒短片',
    deliverable: '独立完成的剪辑作品',
    deliverableDesc: '（含完整片头、正片、字幕与混音）',
    pass: ['节奏准确', '色彩统一', '音画同步']
  },
  {
    num: '02',
    title: '拍摄基础',
    subtitle: '构图 · 运镜 · 灯光 · 72 课时',
    desc: '建立画面意识。理解焦段、景别、光位和运动如何共同构成“镜头语言”。这个阶段培养的是判断力——知道什么样的画面是好的，才能在 AI 生成时写出准确的描述。',
    core: '构图法则 / 运镜方式 / 三点布光 / 景深控制',
    tools: ['手机', '微单相机', '稳定器'],
    practice: '同一场景的 5 种景别与 3 种光位',
    deliverable: '拍摄素材与成片',
    deliverableDesc: '（含分镜脚本与实拍执行）',
    pass: ['构图有意图', '运镜平稳', '曝光与色温准确']
  },
  {
    num: '03',
    title: '提示词工程',
    subtitle: '提示词 · 控图逻辑 · 风格调教 · 48 课时',
    desc: '“会用工具”和“能控图”的分水岭。核心是控图逻辑：提示词标准化、风格调教、局部修改、图生图迭代。2026 年的共识是 Prompt 正在从堆词走向结构化控制，一次只改一个变量，才能做出可复现的输出。',
    core: 'CRISPE 框架 / 结构化 Prompt / 图生图迭代 / 风格一致性',
    tools: ['ComfyUI', 'Midjourney', 'LibTV'],
    practice: '同一角色的 10 张风格统一图',
    deliverable: '风格统一的 AI 图集',
    deliverableDesc: '（不少于 12 张，角色 / 场景 / 色调一致）',
    pass: ['提示词可复现', '风格可控', '局部修改精准']
  },
  {
    num: '04',
    title: 'AI 漫剧全流程',
    subtitle: '剧本 · 分镜 · 配音 · 合成 · 264 课时',
    desc: 'AIGC 最核心的交付能力训练。从剧本创作、分镜设计、出图、配音、剪辑到合成，完整走一遍。264 课时的体量意味着这是整个路径的能力验证主干，而不是一个“体验课”。',
    core: '剧本结构 / 分镜语言 / 角色一致性 / 多模态合成',
    tools: ['RunningHub', 'LibTV', '剪映', '可灵 / 即梦'],
    practice: '1 部 3–5 分钟 AI 漫剧',
    deliverable: '完整 AI 漫剧成片',
    deliverableDesc: '（含剧本、分镜表、角色设定、配音与成片）',
    pass: ['叙事完整', '角色不崩', '音画节奏到位']
  },
  {
    num: '05',
    title: '商业实战',
    subtitle: '需求对接 · 商业交付 · 甲方标准 · 项目制',
    desc: '按甲方标准交付作品，练的是“交付能力”而不是“学习能力”。这个阶段引入真实或模拟商单：需求模糊、时间有限、修改意见具体，你需要学会报价、排期、修改和结项。',
    core: '需求拆解 / 报价策略 / 修改管理 / 交付规范',
    tools: ['全套工具栈', '真实项目'],
    practice: '1 个完整模拟商单（含报价单与验收）',
    deliverable: '商业级作品',
    deliverableDesc: '（按甲方标准交付，含项目文档）',
    pass: ['需求理解准确', '交付一次通过', '沟通留痕规范']
  },
  {
    num: '06',
    title: '作品集与就业',
    subtitle: '作品集整理 · 求职 · 面试 · 持续输出',
    desc: '把前面所有交付物组织成一个有叙事线的作品集。不是文件的堆叠，而是“问题—方案—结果”的展示。同时完成简历包装、模拟面试和岗位对接。',
    core: '作品集叙事 / 案例包装 / 面试表达 / 个人品牌',
    tools: ['作品集模板', '简历优化', '模拟面试'],
    practice: '3 个案例的完整包装 + 1 次模拟面试',
    deliverable: '完整就业作品集',
    deliverableDesc: '（3–5 个案例，含过程与结果）',
    pass: ['案例可讲清楚', '作品集有主线', '面试能扛追问']
  }
]

export default function PathsPage() {
  return (
    <main className="page-container">
      {/* 头部规范 */}
      <div className="ui-badge"><span className="ui-badge-dot"></span>LEARNING PATHS</div>
      <h1 className="ui-title">
        <span style={{ fontFamily: 'Orbitron, monospace' }}>6</span> 个阶段， <span className="ui-title-gradient">每一步都有交付物</span>
      </h1>
      <p className="ui-subtitle">
        2026 年做 AIGC 学习，最大的误区是“学工具”。企业看的是交付能力：你能否独立完成一条商业短视频、一部 AI 漫剧、一套完整作品集。这条路径以交付为锚点，拆解每个阶段的具体任务。
      </p>

      {/* 阶段列表 */}
      <div style={{ marginTop: '40px' }}>
        {pathsData.map((path, index) => (
          <div key={index} className={styles.stage}>
            {/* 左侧大数字 */}
            <div className={styles.stageNumber}>{path.num}</div>
            
            {/* 右侧内容 */}
            <div className={styles.stageContent}>
              <h2 className={styles.stageTitle}>{path.title}</h2>
              <div className={styles.stageSubtitle}>{path.subtitle}</div>
              <p className={styles.stageDesc}>{path.desc}</p>

              {/* 三列信息 */}
              <div className={styles.infoGrid}>
                <div className={styles.infoCard}>
                  <h4>核心能力</h4>
                  <p>{path.core}</p>
                </div>
                <div className={styles.infoCard}>
                  <h4>工具栈</h4>
                  <div className={styles.toolsList}>
                    {path.tools.map((tool, i) => (
                      <span key={i} className={styles.toolChip}>{tool}</span>
                    ))}
                  </div>
                </div>
                <div className={styles.infoCard}>
                  <h4>关键练习</h4>
                  <p>{path.practice}</p>
                </div>
              </div>

              {/* 交付物 */}
              <div className={styles.deliverable}>
                阶段交付物： <b>{path.deliverable}</b> {path.deliverableDesc}
              </div>

              {/* 通关标签 */}
              <div className={styles.passBar}>
                {path.pass.map((item, i) => (
                  <span key={i} className={styles.passChip}>通关：{item}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 底部按钮 */}
      <div className={styles.ctaGroup}>
        <Link href="/modules" className={styles.btnPrimary}>下一步：查看课程模块 →</Link>
      </div>
    </main>
  )
}