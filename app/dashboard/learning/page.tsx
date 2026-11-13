import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const instant = false

export default async function MyLearningPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  // 1. 获取该用户所有的学习打卡记录
  const { data: progressRecords } = await supabase
    .from('learning_progress')
    .select('course_id, lesson_title, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // 空状态处理
  if (!progressRecords || progressRecords.length === 0) {
    return (
      <div>
        <h1 className="ui-title" style={{ fontSize: '2rem', marginBottom: '32px' }}>我的学习</h1>
        <div className="ui-card" style={{ padding: '80px 20px', textAlign: 'center', borderStyle: 'dashed' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>📚</div>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>还没有学习记录</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>去挑选一门感兴趣的课程，开启你的 AIGC 学习之旅吧。</p>
          <Link href="/paths" style={{ padding: '12px 32px', background: 'var(--cyan)', color: '#05070d', borderRadius: '100px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block' }}>
            去探索学习路径 →
          </Link>
        </div>
      </div>
    )
  }

  const uniqueCourseIds = Array.from(new Set(progressRecords.map(r => r.course_id)))

  const { data: courses } = await supabase
    .from('courses')
    .select('id, title, chapters')
    .in('id', uniqueCourseIds)

  const learningData = uniqueCourseIds.map(courseId => {
    const course = courses?.find(c => c.id === courseId)
    if (!course) return null

    const courseRecords = progressRecords.filter(r => r.course_id === courseId)
    const completedLessonTitles = new Set(courseRecords.map(r => r.lesson_title))
    const lastLearnedAt = courseRecords[0]?.created_at

    const totalLessons = course.chapters?.reduce((acc: number, chap: any) => acc + (chap.lessons?.length || 0), 0) || 0
    const completedCount = courseRecords.length

    return {
      id: course.id,
      title: course.title,
      chapters: course.chapters || [],
      completedLessonTitles,
      lastLearnedAt,
      totalLessons,
      completedCount
    }
  }).filter(Boolean)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
        <div>
          <h1 className="ui-title" style={{ fontSize: '2rem', marginBottom: '8px' }}>我的学习</h1>
          <p style={{ color: 'var(--text-secondary)' }}>继续保持，每一次打卡都是通往创作者的阶梯。</p>
        </div>
        <Link href="/paths" style={{ fontSize: '14px', color: 'var(--cyan)', textDecoration: 'none' }}>去发现更多课程 →</Link>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {learningData.map((course: any) => {
          const progressPercent = course.totalLessons === 0 ? 0 : Math.round((course.completedCount / course.totalLessons) * 100)
          const isAllCompleted = progressPercent === 100

          return (
            <div key={course.id} className="ui-card" style={{ padding: '0', overflow: 'hidden' }}>
              
              {/* 章节详情进度 */}
              <div style={{ padding: '32px', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border-subtle)' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {course.title}
                </h2>
                <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '24px' }}>
                  最后学习：{new Date(course.lastLearnedAt).toLocaleString()}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {course.chapters.map((chapter: any, cIdx: number) => (
                    <div key={cIdx} style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px', overflow: 'hidden' }}>
                      <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-subtle)' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--cyan)', margin: 0 }}>
                          {chapter.chapterTitle}
                        </h4>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {chapter.lessons?.map((lesson: any, lIdx: number) => {
                          const isCompleted = course.completedLessonTitles.has(lesson.title)
                          // 👇 精准定位的跳转链接
                          const lessonLink = `/learn/${course.id}?c=${cIdx}&l=${lIdx}`
                          
                          return (
                            <div key={lIdx} style={{ 
                              padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
                              borderBottom: lIdx !== chapter.lessons.length - 1 ? '1px dashed var(--border-subtle)' : 'none'
                            }}>
                              {/* 左侧：打勾状态与标题 */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ 
                                  width: '16px', height: '16px', borderRadius: '50%', 
                                  display: 'grid', placeItems: 'center', fontSize: '10px',
                                  background: isCompleted ? 'rgba(60,220,140,0.2)' : 'rgba(255,255,255,0.05)',
                                  color: isCompleted ? 'var(--green)' : 'transparent',
                                  border: isCompleted ? '1px solid var(--green)' : '1px solid var(--border-subtle)'
                                }}>
                                  {isCompleted && '✓'}
                                </span>
                                <span style={{ fontSize: '13px', color: isCompleted ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                  {lesson.title}
                                </span>
                              </div>

                              {/* 👇 右侧：新增的跳转按钮 */}
                              <Link href={lessonLink} style={{
                                fontSize: '12px', fontWeight: 'bold', textDecoration: 'none',
                                padding: '4px 12px', borderRadius: '100px',
                                transition: '0.3s',
                                // 已完成是灰青色，未完成是亮青色
                                color: isCompleted ? 'var(--text-dim)' : 'var(--cyan)',
                                border: isCompleted ? '1px solid var(--border-subtle)' : '1px solid var(--cyan)',
                                background: isCompleted ? 'transparent' : 'rgba(0, 212, 255, 0.05)',
                                whiteSpace: 'nowrap'
                              }}>
                                {isCompleted ? '再看一遍' : '继续学习'}
                              </Link>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 整体学习情况总结 */}
              <div style={{ padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '32px', flexWrap: 'wrap', background: 'rgba(0,212,255,0.02)' }}>
                <div style={{ flex: '1 1 300px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>课程总进度</span>
                    <span style={{ color: isAllCompleted ? 'var(--green)' : 'var(--cyan)', fontWeight: 'bold', fontFamily: 'Orbitron' }}>
                      {course.completedCount} / {course.totalLessons} 课时 ({progressPercent}%)
                    </span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--border-subtle)', borderRadius: '100px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${progressPercent}%`, 
                      height: '100%', 
                      background: isAllCompleted ? 'var(--green)' : 'linear-gradient(90deg, var(--cyan), #4ae0ff)', 
                      borderRadius: '100px',
                      transition: 'width 0.5s ease-out',
                      boxShadow: isAllCompleted ? 'none' : '0 0 10px var(--cyan)'
                    }}></div>
                  </div>
                </div>

                <div>
                  <Link href={`/learn/${course.id}`} style={{ 
                    display: 'inline-block', padding: '10px 24px', borderRadius: '100px', 
                    background: isAllCompleted ? 'rgba(60, 220, 140, 0.1)' : 'var(--cyan)', 
                    color: isAllCompleted ? 'var(--green)' : '#05070d', 
                    border: isAllCompleted ? '1px solid var(--green)' : 'none',
                    fontWeight: 'bold', textDecoration: 'none', transition: '0.3s',
                    boxShadow: isAllCompleted ? 'none' : '0 0 20px rgba(0, 212, 255, 0.2)',
                    fontSize: '14px'
                  }}>
                    {isAllCompleted ? '✓ 已完成，去复习' : '进入课程 →'}
                  </Link>
                </div>
              </div>

            </div>
          )
        })}
      </div>
    </div>
  )
}