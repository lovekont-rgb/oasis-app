import { createClient } from '@/lib/supabase/server'
import ToolsClient from './ToolsClient'
import styles from './tools.module.css'

export default async function ToolsPage() {
  const supabase = await createClient()
  
  // 去数据库拿数据
  const { data: tools, error } = await supabase.from('tools').select('*').order('name')

  return (
    <main className="page-container">
      <div className="ui-badge"><span className="ui-badge-dot"></span>TOOL MATRIX</div>
      <h1 className="ui-title">
        工具是 <span className="ui-title-gradient">货架</span>，<br className={styles.responsiveBr} />不是清单
      </h1>
      <p className="ui-subtitle">
        按场景分类收录，标注免费 / 付费 / 开源属性。不用全装——先固定一条基线，遇到具体问题时再引入对应工具。
      </p>
      
      {/* 如果数据库真的报错了，把它显示出来；正常的话显示数据 */}
      {error ? (
        <div style={{ padding: '40px', background: 'rgba(255,68,68,0.1)', border: '1px solid #ff4444', borderRadius: '12px' }}>
          <h3 style={{ color: '#ff4444', marginBottom: '10px' }}>数据库读取失败</h3>
          <p style={{ color: '#ff8888' }}>错误信息：{error.message}</p>
          <p style={{ color: '#ff8888', marginTop: '10px', fontSize: '12px' }}>请去 Supabase 检查表名是否正确，或者权限是否开放。</p>
        </div>
      ) : (
        <ToolsClient initialTools={tools || []} />
      )}
    </main>
  )
}