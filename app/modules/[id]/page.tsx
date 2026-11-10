import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export const instant = false

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // 获取路由参数
  const resolvedParams = await params
  const courseId = resolvedParams.id

  const supabase = await createClient()
  const { data: course } = await supabase.from('courses').select('*').eq('id', courseId).single()

  if (!course) {
    notFound() // 如果课程不存在，显示 404
  }

  // 使用新的多级目录数据
  const chapters = course.chapters || []

  return (
    <main className="page-container">
      
      {/* 面包屑导航 */}
      <div style={{ marginBottom: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
        <Link href="/modules" style={{ color: 'var(--cyan)' }}>课程模块</Link> / {course.title}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px', alignItems: 'start' }}>
        
        {/* 左侧主内容区 */}
        <div>
          {/* 头部信息 */}
          <div className="ui-badge"><span className="ui-badge-dot"></span>COURSE DETAILS</div>
          <h1 className="ui-title" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(0,212,255,0.1)', display: 'grid', placeItems: 'center', color: 'var(--cyan)', fontSize: '32px' }}>
              {course.icon}
            </span>
            {course.title}
          </h1>
          <p className="ui-subtitle" style={{ maxWidth: '100%', marginBottom: '32px' }}>
            {course.description}
          </p>

          {/* 详细介绍 */}
          <div className="ui-card" style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>课程详细介绍</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '15px' }}>
              {course.detailed_description || '暂无详细介绍。'}
            </p>
          </div>

          {/* 课程目录（多级结构） */}
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)' }}>课程目录</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {chapters.length > 0 ? (
              chapters.map((chapter: any, cIdx: number) => (
                <div key={cIdx}>
                  {/* 大章标题 */}
                  <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--cyan)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: 4, height: 16, background: 'var(--cyan)', borderRadius: '2px' }}></span>
                    {chapter.chapterTitle}
                  </h4>
                  
                                    {/* 小节列表 */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: '12px' }}>
                    {chapter.lessons?.map((lesson: any, lIdx: number) => (
                      <div key={lIdx} className="ui-card" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ color: 'var(--cyan)', fontSize: '14px' }}>
                            {lesson.type === 'video' ? '▶' : '📄'}
                          </span>
                          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{lesson.title}</span>
                        </div>
                        
                        {/* 👇 新增的按钮，传入了 cIdx(大章索引) 和 lIdx(小节索引) */}
                        <Link 
                          href={`/learn/${course.id}?c=${cIdx}&l=${lIdx}`}
                          style={{ 
                            padding: '6px 16px', borderRadius: '100px', 
                            background: 'rgba(0, 212, 255, 0.1)', color: 'var(--cyan)', 
                            border: '1px solid rgba(0, 212, 255, 0.3)', 
                            textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap',
                            transition: '0.3s'
                          }}
                        >
                          学习本节课程
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-dim)' }}>课程目录正在准备中，敬请期待...</p>
            )}
          </div>
        </div>

        {/* 右侧侧边栏 */}
        <div style={{ position: 'sticky', top: '100px' }}>
          
          {/* 大纲 */}
          <div className="ui-card" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>核心大纲</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {course.syllabus?.map((item: string, i: number) => (
                <li key={i} style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', gap: '10px' }}>
                  <span style={{ color: 'var(--cyan)', fontFamily: 'Orbitron' }}>{String(i+1).padStart(2, '0')}</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* 先修与标签 */}
          <div className="ui-card">
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-dim)', display: 'block', marginBottom: '8px' }}>先修要求</span>
              <p style={{ fontSize: '15px', fontWeight: 600 }}>{course.prereq}</p>
            </div>
            <div>
              <span style={{ fontSize: '13px', color: 'var(--text-dim)', display: 'block', marginBottom: '8px' }}>相关技术栈</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {course.chips?.map((chip: string, i: number) => (
                  <span key={i} style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '100px', background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.2)', color: 'var(--cyan)' }}>
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 👈 修改了这里的文案 */}
          <Link href={`/learn/${course.id}`} style={{ display: 'block', textAlign: 'center', textDecoration: 'none', width: '100%', marginTop: '24px', padding: '16px', borderRadius: '100px', background: 'linear-gradient(120deg, var(--cyan), #4ae0ff)', color: '#05070d', fontWeight: 800, fontSize: '16px', border: 'none', cursor: 'pointer', boxShadow: '0 0 30px rgba(0,212,255,0.3)' }}>
            开始学习本课程
          </Link>
        </div>

      </div>
    </main>
  )
}