'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { markLessonComplete } from './actions'

export default function LearnClient({ courseId, course, initialChapter = 0, initialLesson = 0 }: { courseId: string, course: any, initialChapter?: number, initialLesson?: number }) {
  const [currentLesson, setCurrentLesson] = useState<any>(
    course.chapters?.[initialChapter]?.lessons?.[initialLesson] || course.chapters?.[0]?.lessons?.[0] || null
  )
  const [openChapters, setOpenChapters] = useState<number[]>([initialChapter])
  
  // 👇 新增：进度状态管理
  const [userId, setUserId] = useState<string>('')
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)

  // 1. 初始化设备ID并读取进度
  useEffect(() => {
    // 获取或生成设备唯一标识
    let uid = localStorage.getItem('oasis_device_id')
    if (!uid) {
      uid = `device_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      localStorage.setItem('oasis_device_id', uid)
    }
    setUserId(uid)

    // 从数据库中读取当前用户在本课程的进度
    const fetchProgress = async () => {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { data } = await supabase.from('learning_progress')
        .select('lesson_title')
        .eq('user_id', uid)
        .eq('course_id', Number(courseId))
      
      if (data) {
        setCompletedLessons(data.map(d => d.lesson_title))
      }
    }
    fetchProgress()
  }, [courseId])

  // 2. 计算总进度
  const totalLessons = course.chapters?.reduce((acc: number, chap: any) => acc + (chap.lessons?.length || 0), 0) || 0
  const progressPercent = totalLessons === 0 ? 0 : Math.round((completedLessons.length / totalLessons) * 100)

  const toggleChapter = (index: number) => {
    setOpenChapters(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index])
  }

  // 3. 点击标记已完成
  const handleMarkComplete = async () => {
    if (!currentLesson || !userId || completedLessons.includes(currentLesson.title)) return
    setIsSaving(true)
    const res = await markLessonComplete( Number(courseId), currentLesson.title)
    if (res.success) {
      setCompletedLessons([...completedLessons, currentLesson.title])
    }
    setIsSaving(false)
  }

  const isCurrentCompleted = completedLessons.includes(currentLesson?.title)

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 120px)', background: '#05070d', marginTop: '-20px' }}>
      {/* 左侧：课程目录 */}
      <aside style={{ width: '320px', borderRight: '1px solid var(--border-subtle)', background: '#080b14', display: 'flex', flexDirection: 'column' }}>
        
        {/* 顶部课程信息与进度条 */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-subtle)' }}>
          <Link href={`/modules/${courseId}`} style={{ fontSize: '12px', color: 'var(--cyan)', textDecoration: 'none', marginBottom: '8px', display: 'block' }}>← 返回课程详情</Link>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>{course.title}</h2>
          
          {/* 进度条 UI */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <span>学习进度</span>
            <span style={{ color: 'var(--cyan)' }}>{completedLessons.length} / {totalLessons} 课时 ({progressPercent}%)</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'var(--border-subtle)', borderRadius: '100px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, var(--cyan), #4ae0ff)', borderRadius: '100px', transition: 'width 0.5s' }}></div>
          </div>
        </div>
        
        {/* 目录列表 */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {course.chapters?.map((chapter: any, cIdx: number) => (
            <div key={cIdx}>
              <div 
                onClick={() => toggleChapter(cIdx)}
                style={{ padding: '16px 24px', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', color: 'white', fontWeight: 'bold', fontSize: '14px' }}
              >
                {chapter.chapterTitle}
                <span>{openChapters.includes(cIdx) ? '−' : '+'}</span>
              </div>
              
              {openChapters.includes(cIdx) && chapter.lessons.map((lesson: any, lIdx: number) => {
                const isActive = currentLesson?.title === lesson.title
                const isDone = completedLessons.includes(lesson.title)
                return (
                  <div 
                    key={lIdx}
                    onClick={() => setCurrentLesson(lesson)}
                    style={{ 
                      padding: '12px 24px 12px 40px', fontSize: '13px', cursor: 'pointer',
                      color: isActive ? 'var(--cyan)' : 'var(--text-secondary)',
                      background: isActive ? 'rgba(0, 212, 255, 0.1)' : 'transparent',
                      display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px' }}>{lesson.type === 'video' ? '▶' : '📄'}</span>
                      {lesson.title}
                    </div>
                    {/* 打勾标识 */}
                    {isDone && <span style={{ color: 'var(--green)', fontSize: '12px' }}>✓</span>}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </aside>

      {/* 右侧：播放器/文档区 */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, background: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          {currentLesson ? (
            currentLesson.type === 'video' ? (
              <video 
                src={currentLesson.url} 
                controls 
                style={{ width: '100%', maxHeight: '100%', objectFit: 'contain' }} 
              />
            ) : (
              <div style={{ textAlign: 'center', color: 'white' }}>
                <div style={{ fontSize: '64px', marginBottom: '20px' }}>📄</div>
                <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>{currentLesson.title}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>本课时为文档/讲义资料，请在浏览器新窗口打开查看。</p>
                <a href={currentLesson.url} target="_blank" rel="noreferrer" style={{ padding: '12px 32px', background: 'var(--cyan)', color: '#05070d', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }}>
                  打开文档链接 ↗
                </a>
              </div>
            )
          ) : (
            <div style={{ color: 'white' }}>请从左侧目录选择一个课时开始学习</div>
          )}
        </div>
        
        {/* 底部控制栏 */}
        <div style={{ padding: '20px 40px', borderTop: '1px solid var(--border-subtle)', background: '#080b14', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '16px', color: 'white' }}>{currentLesson?.title || '未选择课时'}</h3>
          
          {/* 👇 真正可用的按钮 */}
          <button 
            onClick={handleMarkComplete}
            disabled={isCurrentCompleted || isSaving}
            style={{ 
              padding: '8px 24px', 
              background: isCurrentCompleted ? 'rgba(60,220,140,0.1)' : 'var(--cyan)', 
              color: isCurrentCompleted ? 'var(--green)' : '#05070d', 
              border: isCurrentCompleted ? '1px solid var(--green)' : 'none',
              borderRadius: '100px', fontWeight: 'bold', cursor: isCurrentCompleted ? 'default' : 'pointer',
              transition: '0.3s'
            }}
          >
            {isSaving ? '保存中...' : isCurrentCompleted ? '✓ 已完成学习' : '标记为已完成'}
          </button>
        </div>
      </main>
    </div>
  )
}