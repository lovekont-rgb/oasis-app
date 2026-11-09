'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCourse, deleteCourseAction } from './actions'

export default function CoursesClient({ initialCourses }: { initialCourses: any[] }) {
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    try {
      const result = await createCourse(formData)
      if (result.success) {
        alert('课程发布成功！')
        formRef.current?.reset()
        router.refresh()
      } else {
        alert('发布失败: ' + result.error)
      }
    } catch (err: any) {
      alert('请求异常: ' + err.message)
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
      
      {/* 左侧：新增表单 */}
      <div className="ui-card" style={{ height: 'fit-content' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--cyan)' }}>发布新课程</h3>
        <form ref={formRef} action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>课程名称</label>
              <input name="title" required placeholder="例如：AI 绘画" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white' }} />
            </div>
            <div style={{ width: '80px' }}>
              <label style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>图标 (字符)</label>
              <input name="icon" required placeholder="⌘" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white', textAlign: 'center' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>课时/标签</label>
            <input name="meta" required placeholder="例如：48 课时 · 核心必修" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white' }} />
          </div>

          <div>
            <label style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>课程简介</label>
            <textarea name="description" required rows={3} placeholder="简单描述一下课程内容..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white' }}></textarea>
          </div>

          <div>
            <label style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>大纲 (每行一条)</label>
            <textarea name="syllabus" required rows={5} placeholder="Prompt 解剖...&#10;CRISPE 框架..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white' }}></textarea>
          </div>

          <div>
            <label style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>先修要求</label>
            <input name="prereq" required placeholder="例如：无 / 需掌握基础 Python" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white' }} />
          </div>

          <div>
            <label style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>标签 (用逗号隔开)</label>
            <input name="chips" required placeholder="例如：ComfyUI, LoRA, FLUX" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white' }} />
          </div>

          <button type="submit" style={{ padding: '12px', background: 'var(--cyan)', color: '#05070d', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', border: 'none', marginTop: '8px' }}>
            确认发布
          </button>
        </form>
      </div>

      {/* 右侧：数据列表 */}
      <div className="ui-card">
        <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>已发布课程 ({initialCourses.length})</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '600px', overflowY: 'auto', paddingRight: '8px' }}>
          {initialCourses.map((course) => (
            <div key={course.id} style={{ padding: '16px', background: 'var(--bg-void)', border: '1px solid var(--border-subtle)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(0,212,255,0.1)', display: 'grid', placeItems: 'center', color: 'var(--cyan)' }}>
                  {course.icon}
                </div>
                <div>
                  <h4 style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '4px' }}>{course.title}</h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{course.meta}</span>
                </div>
              </div>
              
              <form action={deleteCourseAction}>
                <input type="hidden" name="id" value={course.id} />
                <button type="submit" style={{ background: 'transparent', border: '1px solid #ff4444', color: '#ff4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', transition: '0.2s' }}>
                  下架
                </button>
              </form>
            </div>
          ))}
          {initialCourses.length === 0 && <p style={{ color: 'var(--text-dim)' }}>暂无课程。</p>}
        </div>
      </div>

    </div>
  )
}