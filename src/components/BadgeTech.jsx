export default function BadgeTech({ name }) {
  return (
    <span style={{
      padding: '4px 10px',
      backgroundColor: '#1d1d1f',
      color: '#fff',
      borderRadius: '20px',
      fontSize: '0.72rem',
      fontWeight: '600',
      letterSpacing: '0.2px',
      whiteSpace: 'nowrap',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
    }}>
      {name}
    </span>
  )
}
