'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCourse, updateCourse, deleteCourseAction } from './actions'
import { createClient } from '@/lib/supabase/client' // 👈 引入客户端

export default function CoursesClient({ initialCourses }: { initialCourses: any[] }) {
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()
  const supabase = createClient()
  
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<any>({})
  const [chapters, setChapters] = useState<any[]>([]) // 存多级目录状态
  const [uploading, setUploading] = useState(false)

  const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-void)', color: 'white', marginBottom: '12px' }

  const handleEditClick = (course: any) => {
    setEditingId(course.id)
    setFormData({
      ...course,
      syllabus: course.syllabus.join('\n'),
      chips: course.chips.join(', '),
    })
    setChapters(course.chapters || [])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setFormData({})
    setChapters([])
    formRef.current?.reset()
  }

  // 上传文件到 Supabase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, chapterIndex: number, lessonIndex: number, type: 'video' | 'doc') => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    
    // 上传到 course-assets 桶
    const { data, error } = await supabase.storage.from('course-assets').upload(fileName, file)
    
    if (error) {
      alert('上传失败: ' + error.message)
    } else {
      // 获取公开访问的 URL
      const { data: { publicUrl } } = supabase.storage.from('course-assets').getPublicUrl(fileName)
      
      const newChapters = [...chapters]
      newChapters[chapterIndex].lessons[lessonIndex].url = publicUrl
      newChapters[chapterIndex].lessons[lessonIndex].type = type
      setChapters(newChapters)
      alert('上传成功！')
    }
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    data.append('chapters', JSON.stringify(chapters)) // 将目录转为 JSON 字符串
    
    try {
      const result = editingId ? await updateCourse(editingId, data) : await createCourse(data)
      if (result.success) {
        alert('操作成功！')
        handleCancelEdit()
        router.refresh()
      } else {
        alert('失败: ' + result.error)
      }
    } catch (err: any) {
      alert('异常: ' + err.message)
    }
  }

  // 添加新章节
  const addChapter = () => setChapters([...chapters, { chapterTitle: '新章节', lessons: [] }])
  // 添加新课时
  const addLesson = (cIdx: number) => {
    const newChapters = [...chapters]
    newChapters[cIdx].lessons.push({ title: '新课时', type: 'video', url: '' })
    setChapters(newChapters)
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
      {/* 左侧表单 */}
      <div className="ui-card" style={{ height: 'fit-content', maxHeight: '90vh', overflowY: 'auto' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--cyan)' }}>
          {editingId ? '编辑课程' : '发布新课程'}
        </h3>
        <form ref={formRef} onSubmit={handleSubmit} key={editingId || 'new'}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input name="title" defaultValue={formData.title} placeholder="课程名称" required style={{ ...inputStyle, flex: 1 }} />
            <input name="icon" defaultValue={formData.icon} placeholder="图标" required style={{ ...inputStyle, width: '80px', textAlign: 'center' }} />
          </div>
          <input name="meta" defaultValue={formData.meta} placeholder="课时/标签" required style={inputStyle} />
          <textarea name="description" defaultValue={formData.description} placeholder="简短介绍..." required rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
          <textarea name="detailed_description" defaultValue={formData.detailed_description} placeholder="详细介绍..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          <textarea name="syllabus" defaultValue={formData.syllabus} placeholder="核心大纲 (每行一条)" required rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          
          {/* 目录构建器 */}
          <div style={{ border: '1px solid var(--border-subtle)', padding: '16px', borderRadius: '8px', marginBottom: '16px', background: 'rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h4 style={{ fontWeight: 'bold' }}>课程目录构建器</h4>
              <button type="button" onClick={addChapter} style={{ background: 'var(--cyan)', color: 'black', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>+ 添加大章</button>
            </div>
            
            {chapters.map((chap, cIdx) => (
              <div key={cIdx} style={{ marginBottom: '16px', padding: '12px', border: '1px dashed var(--border-subtle)', borderRadius: '6px' }}>
                <input 
                  value={chap.chapterTitle} 
                  onChange={(e) => { const n = [...chapters]; n[cIdx].chapterTitle = e.target.value; setChapters(n); }}
                  placeholder="大章标题" 
                  style={{ ...inputStyle, fontWeight: 'bold', marginBottom: '8px' }} 
                />
                
                {chap.lessons.map((lesson: any, lIdx: number) => (
                  <div key={lIdx} style={{ marginLeft: '16px', marginBottom: '8px', padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                    <input 
                      value={lesson.title} 
                      onChange={(e) => { const n = [...chapters]; n[cIdx].lessons[lIdx].title = e.target.value; setChapters(n); }}
                      placeholder="课时标题" 
                      style={{ ...inputStyle, marginBottom: '4px', fontSize: '12px' }} 
                    />
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input type="file" accept={lesson.type === 'video' ? 'video/*' : '.pdf,.doc,.docx'} onChange={(e) => handleFileUpload(e, cIdx, lIdx, lesson.type)} style={{ fontSize: '11px', flex: 1 }} />
                      <span style={{ fontSize: '11px', color: 'var(--cyan)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {lesson.url ? '已上传 ✓' : '未上传'}
                      </span>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => addLesson(cIdx)} style={{ marginLeft: '16px', background: 'transparent', border: '1px solid var(--border-subtle)', color: 'white', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>+ 添加课时</button>
              </div>
            ))}
          </div>

          <input name="prereq" defaultValue={formData.prereq} placeholder="先修要求" required style={inputStyle} />
          <input name="chips" defaultValue={formData.chips} placeholder="标签 (逗号隔开)" required style={inputStyle} />

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" disabled={uploading} style={{ flex: 1, padding: '12px', background: 'var(--cyan)', color: '#05070d', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', border: 'none' }}>
              {uploading ? '正在上传文件...' : (editingId ? '保存修改' : '确认发布')}
            </button>
            {editingId && <button type="button" onClick={handleCancelEdit} style={{ padding: '12px', background: 'transparent', border: '1px solid var(--border-subtle)', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>取消</button>}
          </div>
        </form>
      </div>

      {/* 右侧列表 (和之前一样，略过重复代码) */}
      <div className="ui-card">
        <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>已发布课程 ({initialCourses.length})</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '800px', overflowY: 'auto' }}>
          {initialCourses.map((course) => (
            <div key={course.id} style={{ padding: '16px', background: 'var(--bg-void)', border: '1px solid var(--border-subtle)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div><h4 style={{ fontWeight: 'bold' }}>{course.title}</h4></div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleEditClick(course)} style={{ background: 'transparent', border: '1px solid var(--cyan)', color: 'var(--cyan)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>编辑</button>
                <form action={deleteCourseAction}><input type="hidden" name="id" value={course.id} /><button type="submit" style={{ border: '1px solid #ff4444', color: '#ff4444', padding: '6px 12px', borderRadius: '6px', background: 'transparent', cursor: 'pointer' }}>删除</button></form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}