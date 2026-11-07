import Link from 'next/link'
import styles from './index.module.css'

export default function Home() {
  return (
    <main className="page-container" style={{ paddingTop: '20px' }}>
      
      {/* 1. 首屏 Hero 区 */}
      <section className={styles.hero}>
        <div className="ui-badge"><span className="ui-badge-dot"></span>OASIS · 2026 AIGC 实战学习平台</div>
        <h1 className={styles.heroTitle}>
          <span>从工具使用者</span>
          <span className="ui-title-gradient">到 AIGC 创作者</span>
          <span className={styles.outlineText}>不再止步于“会用”</span>
        </h1>
        <p className={styles.heroDesc}>
          OASIS 以 <strong>作品交付</strong> 为导向。覆盖提示词工程、AI 绘画、AI 视频、Agent 工作流与商业实战——每一个阶段，都有可验证的产出。创意无线增长。
        </p>
        <div className={styles.btnGroup}>
          <Link href="/paths" className={styles.btnPrimary}>浏览学习路径 →</Link>
          <Link href="/modules" className={styles.btnGhost}>查看课程模块</Link>
        </div>
        
        {/* 数据统计 */}
        <div className={styles.stats}>
          <div className={styles.statItem}><h3>120</h3><p>实战课程</p></div>
          <div className={styles.statItem}><h3>86</h3><p>AI 工具收录</p></div>
          <div className={styles.statItem}><h3>24,000</h3><p>学习者</p></div>
          <div className={styles.statItem}><h3>6</h3><p>阶段路径</p></div>
        </div>
      </section>

      {/* 2. 学习路径预览区 */}
      <section style={{ marginTop: '80px' }}>
        <div className="ui-badge"><span className="ui-badge-dot"></span>LEARNING PATHS</div>
        <h2 className="ui-title">不是学工具，是学 <span className="ui-title-gradient">交付能力</span></h2>
        <p className="ui-subtitle">6 个可验证阶段，每个阶段明确学习重点、工具栈与交付物。 <Link href="/paths" style={{ color: 'var(--cyan)' }}>查看完整路径 →</Link></p>
        
        <div className="ui-grid-3">
          {/* 直接渲染 6 个路径卡片 */}
          {[
            { n: '01', t: '剪辑基础', f: '剪辑 · 调色 · 节奏', c: ['剪映', 'PR', '达芬奇'], d: '独立剪辑作品' },
            { n: '02', t: '拍摄基础', f: '构图 · 运镜 · 灯光', c: ['手机', '相机', '云台'], d: '拍摄素材与成片' },
            { n: '03', t: '提示词工程', f: '提示词 · 控图逻辑 · 风格调教', c: ['ComfyUI', 'Midjourney', 'LibTV'], d: '风格统一的 AI 图集' },
            { n: '04', t: 'AI 漫剧全流程', f: '剧本 · 分镜 · 配音 · 合成', c: ['RunningHub', 'LibTV', '剪映'], d: '完整 AI 漫剧成片' },
            { n: '05', t: '商业实战', f: '需求对接 · 商业交付 · 甲方标准', c: ['全套工具栈', '真实项目'], d: '商业级作品' },
            { n: '06', t: '作品集与就业', f: '作品集整理 · 求职 · 面试', c: ['作品集', '就业指导'], d: '完整就业作品集' }
          ].map((item, i) => (
            <Link key={i} href="/paths" className={styles.pathCard}>
              <div className={styles.pathNum}>{item.n}</div>
              <h3 className={styles.pathTitle}>{item.t}</h3>
              <p className={styles.pathFocus}>{item.f}</p>
              <div className={styles.pathChips}>
                {item.c.map((chip, j) => <span key={j} className={styles.chip}>{chip}</span>)}
              </div>
              <div className={styles.pathDeliver}>交付物：<b>{item.d}</b></div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. 核心能力栈 (Bento 网格，完美填补了空白) */}
      <section style={{ marginTop: '80px' }}>
        <div className="ui-badge"><span className="ui-badge-dot"></span>COURSE MODULES</div>
        <h2 className="ui-title">覆盖 AIGC 核心 <span className="ui-title-gradient">能力栈</span></h2>
        <p className="ui-subtitle">按能力维度组织课程，而非按工具堆砌。 <Link href="/modules" style={{ color: 'var(--cyan)' }}>查看完整大纲 →</Link></p>
        
        <div className={styles.bentoGrid}>
          
          
          {/* 1. 提示词工程 (宽卡) */}
          <div className={`${styles.bentoItem} ${styles.span2}`}>
            <div>
              <div className={styles.bentoIcon}>⌘</div>
              <h3>提示词工程与控图逻辑</h3>
              <p>结构化 Prompt、图生图迭代、局部修改、风格一致性控制。从“会说话”到“能控图”。</p>
            </div>
            <div className={styles.pathChips} style={{ margin: 0 }}>
              <span className={styles.chip}>CRISPE</span><span className={styles.chip}>ControlNet</span><span className={styles.chip}>图生图</span>
            </div>
          </div>

          {/* 2. AI 视觉 (方卡) */}
          <div className={styles.bentoItem}>
            <div>
              <div className={styles.bentoIcon}>◈</div>
              <h3>AI 视觉创作</h3>
              <p>ComfyUI 节点工作流、Midjourney 风格探索、LoRA 训练与商业级出图。</p>
            </div>
            <div className={styles.pathChips} style={{ margin: 0 }}>
              <span className={styles.chip}>ComfyUI</span><span className={styles.chip}>LoRA</span><span className={styles.chip}>FLUX</span>
            </div>
          </div>

          {/* 3. AI 视频 (方卡) */}
          <div className={styles.bentoItem}>
            <div>
              <div className={styles.bentoIcon}>▶</div>
              <h3>AI 视频与漫剧</h3>
              <p>剧本、分镜、生成、配音、剪辑、合成——完整走通 AI 视频交付链路。</p>
            </div>
            <div className={styles.pathChips} style={{ margin: 0 }}>
              <span className={styles.chip}>可灵</span><span className={styles.chip}>即梦</span><span className={styles.chip}>Runway</span>
            </div>
          </div>

          {/* 4. Agent (方卡) */}
          <div className={styles.bentoItem}>
            <div>
              <div className={styles.bentoIcon}>⚙</div>
              <h3>Agent 与 Vibe Coding</h3>
              <p>用 AI 构建可运行的产品与自动化工作流，把重复流程沉淀为可复用能力。</p>
            </div>
            <div className={styles.pathChips} style={{ margin: 0 }}>
              <span className={styles.chip}>LangChain</span><span className={styles.chip}>Coze</span><span className={styles.chip}>MCP</span>
            </div>
          </div>

          {/* 5. 数据分析 (方卡) */}
          <div className={styles.bentoItem}>
            <div>
              <div className={styles.bentoIcon}>📊</div>
              <h3>数据自动化分析</h3>
              <p>从数据抓取到 RAG 知识库构建，用 AI Agent 替代繁琐的表格处理与数据分析。</p>
            </div>
            <div className={styles.pathChips} style={{ margin: 0 }}>
              <span className={styles.chip}>Dify</span><span className={styles.chip}>爬虫</span><span className={styles.chip}>RAG</span>
            </div>
          </div>

          {/* 6. 商业变现 (宽卡) */}
          <div className={`${styles.bentoItem} ${styles.span2}`}>
            <div>
              <div className={styles.bentoIcon}>✦</div>
              <h3>商业变现与作品集</h3>
              <p>需求分析、报价、交付标准、作品集叙事。让学习成果直接对接真实商业场景。</p>
            </div>
            <div className={styles.pathChips} style={{ margin: 0 }}>
              <span className={styles.chip} style={{ color: 'var(--violet)', borderColor: 'rgba(123,97,255,0.3)', background: 'rgba(123,97,255,0.1)' }}>商单拆解</span>
              <span className={styles.chip} style={{ color: 'var(--violet)', borderColor: 'rgba(123,97,255,0.3)', background: 'rgba(123,97,255,0.1)' }}>作品集 Review</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4. 精选工具预览 */}
      <section style={{ marginTop: '80px' }}>
        <div className="ui-badge"><span className="ui-badge-dot"></span>TOOL MATRIX</div>
        <h2 className="ui-title">精选 <span className="ui-title-gradient">86+</span> AIGC 工具</h2>
        <p className="ui-subtitle">按场景分类，标注免费 / 开源属性。 <Link href="/tools" style={{ color: 'var(--cyan)' }}>进入完整工具库 →</Link></p>
        
        <div className={styles.toolPreviewGrid}>
          <div className={styles.toolMini}><h4>ChatGPT</h4><p>通用对话与推理</p></div>
          <div className={styles.toolMini}><h4>ComfyUI</h4><p>节点式图像工作流</p></div>
          <div className={styles.toolMini}><h4>可灵 AI</h4><p>视频生成与运镜</p></div>
          <div className={styles.toolMini}><h4>Cursor</h4><p>AI 优先代码编辑器</p></div>
          <div className={styles.toolMini}><h4>Claude</h4><p>长文档与代码</p></div>
          <div className={styles.toolMini}><h4>Midjourney</h4><p>高质量视觉生成</p></div>
          <div className={styles.toolMini}><h4>即梦 AI</h4><p>图生视频上手快</p></div>
          <div className={styles.toolMini}><h4>Suno</h4><p>文本生成音乐</p></div>
        </div>
      </section>

      {/* 5. 底部 CTA */}
      <section className={styles.ctaBox}>
        <h2>开始构建你的 AIGC 作品集</h2>
        <p>选择一个阶段，做出第一个可验证的交付物。学习 AIGC 最好的方式，从来不是看完所有教程。<br/>创意无线增长，从第一个作品开始。</p>
        <Link href="/paths" className={styles.btnPrimary}>立即开始学习 →</Link>
      </section>

    </main>
  )
}