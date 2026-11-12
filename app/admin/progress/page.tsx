import { createClient } from '@/lib/supabase/server'
import { deleteProgressAction } from './actions'

export const instant = false

export default async function AdminProgressPage() {
  const supabase = await createClient()
  
  // 拉取进度记录，顺便带上课程名字
  const { data: progress } = await supabase
    .from('learning_progress')
    .select('*, courses(title)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>学习进度看板</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>查看学员的学习记录。当前处于设备ID测试阶段，未来将替换为真实用户ID。</p>

      <div className="ui-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(0,212,255,0.05)', color: 'var(--cyan)', fontSize: '13px' }}>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)' }}>设备/用户 ID</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)' }}>学习课程</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)' }}>完成课时</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)' }}>完成时间</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)', textAlign: 'right' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {progress?.map((record) => (
              <tr key={record.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '14px' }}>
                <td style={{ padding: '16px', color: 'var(--text-dim)', fontFamily: 'monospace' }}>{record.user_id}</td>
                <td style={{ padding: '16px', fontWeight: 'bold' }}>{record.courses?.title || '未知课程'}</td>
                <td style={{ padding: '16px', color: 'var(--cyan)' }}>{record.lesson_title}</td>
                <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{new Date(record.created_at).toLocaleString()}</td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <form action={deleteProgressAction}>
                    <input type="hidden" name="id" value={record.id} />
                    <button type="submit" style={{ background: 'transparent', border: '1px solid #ff4444', color: '#ff4444', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>重置</button>
                  </form>
                </td>
              </tr>
            ))}
            {(!progress || progress.length === 0) && (
              <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>暂无学习记录。</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}