import { Link } from 'react-router-dom'

const AP = "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif"

export default function NotFound() {
  return (
    <div style={{
      width: '100vw', height: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(circle at 50% 40%, #ffffff 0%, #e5e5ea 100%)',
      flexDirection: 'column', gap: '0', fontFamily: AP,
      paddingTop: '52px', boxSizing: 'border-box',
    }}>
      <div style={{
        textAlign: 'center',
        backgroundColor: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        padding: '56px 64px', borderRadius: '28px',
        boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 0 8px 48px rgba(0,0,0,0.07)',
        border: '1px solid rgba(200,210,230,0.45)',
        maxWidth: '480px', width: '90%',
      }}>
        <p style={{ fontSize: '4.5rem', marginBottom: '0', lineHeight: 1 }}>🔮</p>
        <h1 style={{
          fontSize: '6rem', fontWeight: 900, letterSpacing: '-0.06em',
          color: '#1d1d1f', lineHeight: 1, margin: '16px 0 8px',
        }}>404</h1>
        <p style={{
          fontSize: '1.1rem', fontWeight: 600, color: '#1d1d1f', marginBottom: '10px',
        }}>Page introuvable</p>
        <p style={{
          fontSize: '0.95rem', color: '#6e6e73', lineHeight: 1.6, marginBottom: '32px',
        }}>
          Cette page n'existe pas ou a été déplacée.<br />
          Pas de panique, revenez à l'accueil.
        </p>

        <Link
          to="/"
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #0071e3, #0a84ff)',
            color: '#fff', padding: '13px 28px', borderRadius: '30px',
            textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem',
            letterSpacing: '-0.01em',
            boxShadow: '0 4px 18px rgba(0,113,227,0.32)',
          }}
        >
          ← Retour à l'accueil
        </Link>

        <div style={{ marginTop: '24px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <Link to="/projects" style={{ fontSize: '0.85rem', color: '#0071e3', textDecoration: 'none', fontWeight: 500 }}>
            Projets
          </Link>
          <Link to="/about" style={{ fontSize: '0.85rem', color: '#0071e3', textDecoration: 'none', fontWeight: 500 }}>
            À propos
          </Link>
          <Link to="/contact" style={{ fontSize: '0.85rem', color: '#0071e3', textDecoration: 'none', fontWeight: 500 }}>
            Contact
          </Link>
        </div>
      </div>
    </div>
  )
}
