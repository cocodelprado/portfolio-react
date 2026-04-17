export default function SearchBar({ value, onChange, placeholder = 'Rechercher un projet ou une techno…' }) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <span style={{
        position: 'absolute', left: '12px', top: '50%',
        transform: 'translateY(-50%)', fontSize: '0.9rem',
        color: '#aeaeb2', pointerEvents: 'none',
      }}>🔍</span>
      <input
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '9px 14px 9px 36px',
          borderRadius: '12px',
          border: '1.5px solid rgba(0,0,0,0.1)',
          background: 'rgba(255,255,255,0.85)',
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
          fontSize: '0.88rem',
          color: '#1d1d1f',
          outline: 'none',
          boxSizing: 'border-box',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
        onFocus={e => {
          e.target.style.borderColor = '#0071e3'
          e.target.style.boxShadow = '0 0 0 3px rgba(0,113,227,0.12)'
          e.target.style.background = '#fff'
        }}
        onBlur={e => {
          e.target.style.borderColor = 'rgba(0,0,0,0.1)'
          e.target.style.boxShadow = 'none'
          e.target.style.background = 'rgba(255,255,255,0.85)'
        }}
      />
    </div>
  )
}
