import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)', 
      padding: '60px 0 30px',
      background: 'var(--bg-void)', 
      fontSize: '14px', 
      marginTop: '60px'
    }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* 上半部分：品牌与链接 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px', marginBottom: '40px' }}>
          <div style={{ maxWidth: '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, var(--violet), var(--cyan))', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 900 }}>O</div>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--text-primary)' }}>OASIS</span>
              <span style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'Orbitron, monospace' }}>创意无线增长</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '13px' }}>
              OASIS — 创意无线增长。以交付能力为导向的 AIGC 学习平台。黑色是画布，科技蓝是信号。
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '80px', flexWrap: 'wrap' }}>
            <div>
              <h5 style={{ color: 'var(--cyan)', marginBottom: '16px', fontFamily: 'Orbitron, monospace', fontSize: '12px' }}>学习</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text-secondary)' }}>
                <Link href="/paths">学习路径</Link>
                <Link href="/modules">课程模块</Link>
                <Link href="/prompts">提示词工程</Link>
              </div>
            </div>
            <div>
              <h5 style={{ color: 'var(--cyan)', marginBottom: '16px', fontFamily: 'Orbitron, monospace', fontSize: '12px' }}>资源</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text-secondary)' }}>
                <Link href="/tools">工具矩阵</Link>
                <Link href="/projects">项目实战</Link>
                <Link href="/community">社区资源</Link>
              </div>
            </div>
            <div>
              <h5 style={{ color: 'var(--cyan)', marginBottom: '16px', fontFamily: 'Orbitron, monospace', fontSize: '12px' }}>关于</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text-secondary)' }}>
                {/* 👈 这里已经修改好了 */}
                <Link href="/about">关于我们</Link>
                <Link href="/contact">联系我们</Link>
                <Link href="/privacy">隐私政策</Link>
              </div>
            </div>
          </div>
        </div>

        {/* 下半部分：版权声明 */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', color: 'var(--text-dim)', fontSize: '12px' }}>
          <span>© 2026 OASIS · 创意无线增长. 学习，然后交付。</span>
          <span>Designed with 科技蓝 · 黑色酷炫</span>
        </div>
      </div>
    </footer>
  )
}