import { Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'

const AP = "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif"

export default function Footer() {
  const vcardUrl = `${window.location.origin}/contact.vcf`
  const year = new Date().getFullYear()

  return (
    <footer style={{
      width: '100%',
      background: 'rgba(245,245,247,0.9)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderTop: '1px solid rgba(0,0,0,0.06)',
      padding: '32px 40px',
      boxSizing: 'border-box',
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px',
      }}>
        {/* Infos + nav */}
        <div>
          <p style={{ fontFamily: AP, fontWeight: 700, fontSize: '1rem', color: '#1d1d1f', marginBottom: '6px' }}>
            Corentin Commino.
          </p>
          <p style={{ fontFamily: AP, fontSize: '0.82rem', color: '#6e6e73', marginBottom: '12px' }}>
            Développeur Front-End React — Promo 2025
          </p>
          <nav style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {[['/', 'Accueil'], ['/about', 'À propos'], ['/projects', 'Projets'], ['/contact', 'Contact']].map(([to, label]) => (
              <Link key={to} to={to} style={{
                fontFamily: AP, fontSize: '0.82rem', color: '#6e6e73',
                textDecoration: 'none', transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.target.style.color = '#1d1d1f'}
                onMouseLeave={e => e.target.style.color = '#6e6e73'}
              >{label}</Link>
            ))}
          </nav>
        </div>

        {/* QR Code vCard */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{
            borderRadius: '10px', overflow: 'hidden', padding: '6px',
            background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}>
            <QRCodeSVG value={vcardUrl} size={72} fgColor="#1E3A5F" bgColor="#ffffff" level="H" includeMargin={false} />
          </div>
          <p style={{ fontFamily: AP, fontSize: '0.7rem', color: '#aeaeb2', textAlign: 'center' }}>
            Scannez pour me contacter
          </p>
          <a href="/contact.vcf" download="Corentin_Commino.vcf" style={{
            fontFamily: AP, fontSize: '0.72rem', color: '#0071e3',
            textDecoration: 'none', fontWeight: 600,
          }}>⬇ vCard</a>
        </div>
      </div>

      {/* Copyright */}
      <div style={{
        maxWidth: '1100px', margin: '20px auto 0',
        paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.05)',
        display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px',
      }}>
        <p style={{ fontFamily: AP, fontSize: '0.76rem', color: '#aeaeb2' }}>
          © {year} Corentin Commino — Portfolio React
        </p>
        <a
          href="https://github.com/cocodelprado"
          target="_blank" rel="noopener noreferrer"
          style={{ fontFamily: AP, fontSize: '0.76rem', color: '#aeaeb2', textDecoration: 'none' }}
        >
          GitHub →
        </a>
      </div>
    </footer>
  )
}
