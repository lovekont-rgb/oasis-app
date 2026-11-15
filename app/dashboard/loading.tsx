export default function DashboardLoading() {
  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-void)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <div style={{ 
          width: '40px', height: '40px', borderRadius: '50%', 
          border: '3px solid rgba(0, 212, 255, 0.2)', 
          borderTopColor: 'var(--cyan)', 
          animation: 'spin 1s linear infinite' 
        }}></div>
        <p style={{ color: 'var(--cyan)', fontFamily: 'Orbitron', letterSpacing: '0.1em', fontSize: '14px' }}>
          极速加载中...
        </p>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { to { transform: rotate(360deg); } }
      `}} />
    </div>
  )
}