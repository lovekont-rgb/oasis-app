'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCourse, updateCourse, deleteCourseAction } from './actions'

export default function CoursesClient({ initialCourses }: { initialCourses: any[] }) {
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()
  
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<any>({}) // 用于回显数据

  const handleEditClick = (course: any) => {
    setEditingId(course.id)
    // 将数组转为换行文本用于表单回显
    const videosString = (course.video_list || []).map((v: any) => `${v.title} | ${v.duration} | ${v.url}`).join('\n')
    setFormData({
      ...course,
      syllabus: course.syllabus.join('\n'),
      chips: course.chips.join(', '),
      video_list: videosString
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setFormData({})
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    
    try {
      const result = editingId 
        ? await updateCourse(editingId, data)
        : await createCourse(data)

      if (result.success) {
        alert(editingId ? '更新成功！' : '发布成功！')
        formRef.current?.reset()
        handleCancelEdit()
        router.refresh()
      } else {
        alert('操作失败: ' + result.error)
      }
    } catch (err: any) {
      alert('异常: ' + err.message)
    }
  }

  const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white', marginBottom: '12px' }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
      
      {/* 左侧：表单 (支持新增和编辑) */}
      <div className="ui-card" style={{ height: 'fit-content' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--cyan)' }}>
          {editingId ? '编辑课程信息' : '发布新课程'}
        </h3>
        <form ref={formRef} onSubmit={handleSubmit} key={editingId || 'new'}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input name="title" defaultValue={formData.title} placeholder="课程名称" required style={{ ...inputStyle, flex: 1 }} />
            <input name="icon" defaultValue={formData.icon} placeholder="图标" required style={{ ...inputStyle, width: '80px', textAlign: 'center' }} />
          </div>
          <input name="meta" defaultValue={formData.meta} placeholder="课时/标签 (例如: 48 课时 · 必修)" required style={inputStyle} />
          <textarea name="description" defaultValue={formData.description} placeholder="简短介绍..." required rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
          <textarea name="detailed_description" defaultValue={formData.detailed_description} placeholder="详情页的详细介绍文案..." rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
          
          <label style={{ fontSize: '12px', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>课程大纲（每行一条）</label>
          <textarea name="syllabus" defaultValue={formData.syllabus} placeholder="大纲 1&#10;大纲 2" required rows={4} style={{ ...inputStyle, resize: 'vertical' }} />

          <label style={{ fontSize: '12px', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>视频列表（每行一条，格式：标题 | 时长 | 链接）</label>
          <textarea name="video_list" defaultValue={formData.video_list} placeholder="01. 认识AI | 12:30 | #&#10;02. 基础操作 | 18:20 | #" rows={4} style={{ ...inputStyle, resize: 'vertical' }} />

          <input name="prereq" defaultValue={formData.prereq} placeholder="先修要求" required style={inputStyle} />
          <input name="chips" defaultValue={formData.chips} placeholder="标签 (用逗号隔开)" required style={inputStyle} />

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" style={{ flex: 1, padding: '12px', background: 'var(--cyan)', color: '#05070d', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', border: 'none' }}>
              {editingId ? '保存修改' : '确认发布'}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancelEdit} style={{ padding: '12px', background: 'transparent', border: '1px solid var(--border-subtle)', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>
                取消
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 右侧：数据列表 */}
      <div className="ui-card">
        <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>已发布课程 ({initialCourses.length})</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '800px', overflowY: 'auto', paddingRight: '8px' }}>
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
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleEditClick(course)} style={{ background: 'transparent', border: '1px solid var(--cyan)', color: 'var(--cyan)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                  编辑
                </button>
                <form action={deleteCourseAction}>
                  <input type="hidden" name="id" value={course.id} />
                  <button type="submit" style={{ background: 'transparent', border: '1px solid #ff4444', color: '#ff4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                    删除
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}