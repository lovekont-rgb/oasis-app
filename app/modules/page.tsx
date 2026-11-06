import Link from 'next/link'
import styles from './modules.module.css'

export const instant = false

// 将图片里的数据整理成数组，方便渲染
const modulesData = [
  {
    title: '提示词工程',
    icon: '⌘',
    meta: '48 课时 · 核心必修',
    desc: '从“会说话”到“能控图”。建立可复用、可测试、可迭代的提示词工作流。',
    syllabus: [
      'Prompt 解剖：角色、任务、约束、输出格式',
      'CRISPE 框架与结构化提示词',
      'Zero / Few-Shot 与 CoT 思维链',
      '迭代控制：一次只改一个变量',
      '系统提示词与多轮对话设计'
    ],
    prereq: '无 · 适合所有方向',
    chips: ['CRISPE', 'CoT', 'System Prompt']
  },
  {
    title: 'ComfyUI 工作流',
    icon: '◈',
    meta: '64 课时 · 图像主线',
    desc: '节点式生成的核心工具。把“抽卡”变成可复现、可调整、可交付的工作流。',
    syllabus: [
      '节点与数据流：加载、采样、解码、保存',
      '文生图基础工作流搭建',
      'ControlNet 与构图控制',
      'LoRA 加载与风格调教',
      '局部重绘与批量出图'
    ],
    prereq: '提示词工程',
    chips: ['ComfyUI', 'ControlNet', 'LoRA']
  },
  {
    title: 'LoRA 训练与风格定制',
    icon: '✦',
    meta: '40 课时 · 进阶',
    desc: '训练专属风格或角色 LoRA，让生成结果具备真正的辨识度和一致性。',
    syllabus: [
      '数据集准备：清洗、打标、触发词',
      'FLUX / SD 系列 LoRA 训练参数',
      '角色一致性与多人场景稳定化',
      'LoRA 在 ComfyUI 工作流中的集成'
    ],
    prereq: 'ComfyUI 工作流',
    chips: ['LoRA', 'FLUX', '数据集工程']
  },
  {
    title: 'AI 视频生成',
    icon: '▶',
    meta: '56 课时 · 视频主线',
    desc: '掌握可灵、即梦、Runway 的各自特长，按内容类型选择工具，而不是全部堆上去。',
    syllabus: [
      '文生视频与图生视频基础',
      '可灵：首尾帧、角色绑定、物理感镜头',
      '即梦：中文友好、模板与主体迁移',
      'Runway：运动笔刷、遮罩、局部控制',
      '剪辑合成与音画同步'
    ],
    prereq: '剪辑基础 + 提示词工程',
    chips: ['可灵', '即梦', 'Runway', '剪映']
  },
  {
    title: 'AI 漫剧全流程',
    icon: '▣',
    meta: '80 课时 · 交付主线',
    desc: '从剧本到成片的完整链路。这是检验前面所有模块是否真正掌握的“大作业”。',
    syllabus: [
      '剧本结构与分镜语言',
      '角色设定与一致性控制',
      '批量出图与场景生成',
      '配音、音效与剪辑合成',
      '成片输出与发布规范'
    ],
    prereq: 'ComfyUI + AI 视频',
    chips: ['RunningHub', 'LibTV', '剪映']
  },
  {
    title: 'Agent 与自动化',
    icon: '⚙',
    meta: '60 课时 · 工程向',
    desc: '从低代码工作流到代码框架，构建能真正“做事”的 AI 系统。覆盖 Coze / Dify / LangChain / LangGraph 四条路线。',
    syllabus: [
      'Agent 核心概念：规划、记忆、工具、反思',
      'Coze / Dify：低代码 Agent 与工作流',
      'LangChain / LangGraph：代码级控制',
      'RAG 知识库与 MCP 工具协议',
      'Multi-Agent 协作系统'
    ],
    prereq: '基础 Python（非必须但强烈建议）',
    chips: ['Coze', 'Dify', 'LangChain', 'MCP']
  }
]

export default function ModulesPage() {
  return (
    <main className="page-container">
      {/* 头部规范 */}
      <div className="ui-badge"><span className="ui-badge-dot"></span>COURSE MODULES</div>
      <h1 className="ui-title">
        按能力组织， <span className="ui-title-gradient">不按工具堆砌</span>
      </h1>
      <p className="ui-subtitle">
        每个模块包含大纲、课时、先修要求和配套项目。课时为参考值，实际学习节奏因人而异。建议按“学习路径”的阶段顺序推进，但模块之间可以交叉参考。
      </p>

      {/* 课程卡片网格 (使用统一的 ui-grid-2 和 ui-card) */}
      <div className="ui-grid-2">
        {modulesData.map((mod, index) => (
          <div key={index} className="ui-card" style={{ display: 'flex', flexDirection: 'column' }}>
            
            <div className={styles.cardTop}>
              <h2>{mod.title}</h2>
              <div className={styles.iconBox}>{mod.icon}</div>
            </div>
            
            <div className={styles.meta}>{mod.meta}</div>
            <p className={styles.desc}>{mod.desc}</p>
            
            <ul className={styles.syllabus}>
              {mod.syllabus.map((item, i) => (
                <li key={i}>
                  <span className={styles.number}>{String(i + 1).padStart(2, '0')}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            
            <div className={styles.prereq}>先修：<b>{mod.prereq}</b></div>
            
            <div className={styles.chips}>
              {mod.chips.map((chip, i) => (
                <span key={i} className={styles.chip}>{chip}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 底部按钮 */}
      <div className={styles.ctaGroup}>
        <Link href="/prompts" className={styles.btnPrimary}>深入提示词工程 →</Link>
        <Link href="/projects" className={styles.btnGhost}>查看项目实战</Link>
      </div>
    </main>
  )
}