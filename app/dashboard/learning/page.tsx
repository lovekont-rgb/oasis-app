import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const instant = false

export default async function MyLearningPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  // 1. 获取该用户所有的学习打卡记录（按时间降序）
  const { data: progressRecords } = await supabase
    .from('learning_progress')
    .select('course_id, lesson_title, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // 如果没有任何记录，展示空状态
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

  // 2. 提取去重后的课程 ID 列表
  const uniqueCourseIds = Array.from(new Set(progressRecords.map(r => r.course_id)))

  // 3. 获取这些课程的基础信息（需要 chapters 用来计算总课时）
  const { data: courses } = await supabase
    .from('courses')
    .select('id, title, chapters')
    .in('id', uniqueCourseIds)

  // 4. 在服务端进行数据聚合计算
  const courseMap = new Map()
  
  // 先初始化课程信息
  courses?.forEach(course => {
    // 计算该课程的总课时数（遍历 chapters 数组里的 lessons 长度）
    const totalLessons = course.chapters?.reduce((acc: number, chap: any) => acc + (chap.lessons?.length || 0), 0) || 0
    
    courseMap.set(course.id, {
      ...course,
      completedCount: 0,
      lastLearnedAt: '',
      totalLessons: totalLessons
    })
  })

  // 遍历打卡记录，统计每门课完成的数量和最后学习时间
  progressRecords.forEach(record => {
    const courseData = courseMap.get(record.course_id)
    if (courseData) {
      courseData.completedCount += 1
      // 因为记录是按时间降序排列的，所以第一条就是最新时间
      if (!courseData.lastLearnedAt) {
        courseData.lastLearnedAt = record.created_at
      }
    }
  })

  // 转为数组准备渲染
  const learningList = Array.from(courseMap.values())

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 className="ui-title" style={{ fontSize: '2rem', marginBottom: '8px' }}>我的学习</h1>
          <p style={{ color: 'var(--text-secondary)' }}>继续保持，每一次打卡都是通往创作者的阶梯。</p>
        </div>
        <Link href="/paths" style={{ fontSize: '14px', color: 'var(--cyan)', textDecoration: 'none' }}>去发现更多课程 →</Link>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {learningList.map(item => {
          // 计算进度百分比
          const progressPercent = item.totalLessons === 0 ? 0 : Math.round((item.completedCount / item.totalLessons) * 100)
          const isCompleted = progressPercent === 100

          return (
            <div key={item.id} className="ui-card" style={{ padding: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '32px', flexWrap: 'wrap' }}>
              
              {/* 左侧：课程信息与进度条 */}
              <div style={{ flex: '1 1 350px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-dim)', marginBottom: '20px' }}>
                  最后学习时间：{new Date(item.lastLearnedAt).toLocaleString()}
                </p>
                
                {/* 进度条 UI */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ flex: 1, height: '8px', background: 'var(--border-subtle)', borderRadius: '100px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${progressPercent}%`, 
                      height: '100%', 
                      background: isCompleted ? 'var(--green)' : 'linear-gradient(90deg, var(--cyan), #4ae0ff)', 
                      borderRadius: '100px',
                      transition: 'width 0.5s ease-out',
                      boxShadow: isCompleted ? 'none' : '0 0 10px var(--cyan)'
                    }}></div>
                  </div>
                  <span style={{ fontSize: '14px', color: isCompleted ? 'var(--green)' : 'var(--cyan)', fontWeight: 'bold', fontFamily: 'Orbitron', minWidth: '90px' }}>
                    {item.completedCount} / {item.totalLessons} 课时
                  </span>
                </div>
              </div>

              {/* 右侧：操作按钮 */}
              <div>
                <Link href={`/learn/${item.id}`} style={{ 
                  display: 'inline-block', padding: '12px 28px', borderRadius: '100px', 
                  background: isCompleted ? 'rgba(60, 220, 140, 0.1)' : 'var(--cyan)', 
                  color: isCompleted ? 'var(--green)' : '#05070d', 
                  border: isCompleted ? '1px solid var(--green)' : 'none',
                  fontWeight: 'bold', textDecoration: 'none', transition: '0.3s',
                  boxShadow: isCompleted ? 'none' : '0 0 20px rgba(0, 212, 255, 0.2)'
                }}>
                  {isCompleted ? '✓ 已完成，去复习' : '继续学习 →'}
                </Link>
              </div>

            </div>
          )
        })}
      </div>
    </div>
  )
}