export default function DashboardLoading() {
  return (
    <div style={{ display: 'flex', height: '80vh', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid rgba(0, 212, 255, 0.2)', borderTopColor: 'var(--cyan)', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ color: 'var(--cyan)', fontFamily: 'Orbitron', fontSize: '13px' }}>极速加载中...</p>
      </div>
      <style dangerouslySetInnerHTML={{__html: `@keyframes spin { to { transform: rotate(360deg); } }`}} />
    </div>
  )
}