'use client'

export const instant = false // 👈 添加这一行

import { useState, useEffect, Suspense } from 'react'
// ... 其余代码保持不变
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// 1. 将原本的页面逻辑移入这个子组件中
function LearnContent() {
  const params = useParams()
  const courseId = params.id as string
  const supabase = createClient()

  const [course, setCourse] = useState<any>(null)
  const [currentLesson, setCurrentLesson] = useState<any>(null)
  const [openChapters, setOpenChapters] = useState<number[]>([0])

  useEffect(() => {
    supabase.from('courses').select('*').eq('id', courseId).single().then(({ data }) => {
      if (data) {
        setCourse(data)
        if (data.chapters && data.chapters.length > 0 && data.chapters[0].lessons.length > 0) {
          setCurrentLesson(data.chapters[0].lessons[0])
        }
      }
    })
  }, [courseId])

  if (!course) return <div style={{ padding: '100px', textAlign: 'center', color: 'white' }}>加载课程中...</div>

  const toggleChapter = (index: number) => {
    setOpenChapters(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index])
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 120px)', background: '#05070d', marginTop: '-20px' }}>
      {/* 左侧：课程目录 */}
      <aside style={{ width: '320px', borderRight: '1px solid var(--border-subtle)', background: '#080b14', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-subtle)' }}>
          <Link href={`/modules/${courseId}`} style={{ fontSize: '12px', color: 'var(--cyan)', textDecoration: 'none', marginBottom: '8px', display: 'block' }}>← 返回课程详情</Link>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>{course.title}</h2>
        </div>
        
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
                return (
                  <div 
                    key={lIdx}
                    onClick={() => setCurrentLesson(lesson)}
                    style={{ 
                      padding: '12px 24px 12px 40px', fontSize: '13px', cursor: 'pointer',
                      color: isActive ? 'var(--cyan)' : 'var(--text-secondary)',
                      background: isActive ? 'rgba(0, 212, 255, 0.1)' : 'transparent',
                      display: 'flex', gap: '8px', alignItems: 'center'
                    }}
                  >
                    <span style={{ fontSize: '10px' }}>{lesson.type === 'video' ? '▶' : '📄'}</span>
                    {lesson.title}
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
        
        <div style={{ padding: '20px 40px', borderTop: '1px solid var(--border-subtle)', background: '#080b14', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '16px', color: 'white' }}>{currentLesson?.title || '未选择课时'}</h3>
          <button style={{ padding: '8px 24px', background: 'var(--cyan)', color: '#05070d', borderRadius: '100px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
            标记为已完成
          </button>
        </div>
      </main>
    </div>
  )
}

// 2. 默认导出的页面组件，用 Suspense 包裹子组件
export default function LearnPage() {
  return (
    <Suspense fallback={<div style={{ padding: '100px', textAlign: 'center', color: 'white' }}>正在进入学习空间...</div>}>
      <LearnContent />
    </Suspense>
  )
}