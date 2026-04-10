export default function Loader({ fullScreen = false, size = 32 }) {
  const style = {
    width:  size,
    height: size,
    border: `3px solid var(--border)`,
    borderTopColor: 'var(--accent)',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
    flexShrink: 0,
  };

  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg)', zIndex: 9999,
      }}>
        <div style={style} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 0' }}>
      <div style={style} />
    </div>
  );
}
