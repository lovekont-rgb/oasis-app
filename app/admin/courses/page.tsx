import { createClient } from '@/lib/supabase/server'
import CoursesClient from './CoursesClient'

export const instant = false

export default async function AdminCoursesPage() {
  const supabase = await createClient()
  const { data: courses } = await supabase.from('courses').select('*').order('id')
  
  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>课程与资源管理</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>在这里发布新课程，或者管理现有课程大纲。</p>
      <CoursesClient initialCourses={courses || []} />
    </div>
  )
}