import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // 获取当前登录用户
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 获取用户角色档案
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const role = profile?.role || 'student'

  return (
    <main className="page-container">
      <div className="ui-badge"><span className="ui-badge-dot"></span>WORKSPACE</div>
      <h1 className="ui-title">
        欢迎回来， <span className="ui-title-gradient">{user.email?.split('@')[0]}</span>
      </h1>
      <p className="ui-subtitle">当前身份：<strong style={{ color: 'var(--cyan)' }}>{role === 'student' ? '学生' : role === 'teacher' ? '教师' : '管理员'}</strong></p>

      <div className="ui-grid-2" style={{ marginTop: '40px' }}>
        
        {/* 学生端视图 */}
        {role === 'student' && (
          <>
            <div className="ui-card">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>我的学习进度</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>目前你还没有开始课程。去学习路径开始你的第一节课吧。</p>
              <a href="/paths" style={{ display: 'inline-block', marginTop: '16px', color: 'var(--cyan)' }}>去学习 →</a>
            </div>
            <div className="ui-card">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>我的作品集</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>提交你的第一个 AI 实战项目。</p>
            </div>
          </>
        )}

        {/* 教师端视图 */}
        {role === 'teacher' && (
          <>
            <div className="ui-card">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>课程与资源管理</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>在这里上传视频、发布课程、更新工具库。</p>
            </div>
            <div className="ui-card">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>学员作业批改</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>有 5 份新作业待批改。</p>
            </div>
          </>
        )}

        {/* 管理员视图 */}
        {role === 'admin' && (
          <>
            <div className="ui-card">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>全局数据看板</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>平台总注册用户、今日活跃度与收益统计。</p>
            </div>
            <div className="ui-card">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>用户与角色管理</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>审核新用户，给老师分配权限。</p>
            </div>
          </>
        )}

      </div>
    </main>
  )
}