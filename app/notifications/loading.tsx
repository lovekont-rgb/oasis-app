export default function Loading() {
  return (
    <main className="page-container">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          padding: '120px 0',
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: '3px solid var(--border-subtle)',
            borderTopColor: 'var(--cyan)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <div
          style={{
            fontFamily: 'Orbitron, sans-serif',
            color: 'var(--cyan)',
            letterSpacing: '0.15em',
            fontSize: 12,
          }}
        >
          MESSAGES LOADING…
        </div>
      </div>
    </main>
  );
}