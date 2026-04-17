import { QRCodeSVG } from 'qrcode.react'

const AP = "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif"

export default function QRCodeWidget({ size = 100 }) {
  const vcardUrl = `${window.location.origin}/contact.vcf`

  return (
    <div className="qr-card">
      <div style={{
        flexShrink: 0, borderRadius: '10px', overflow: 'hidden',
        padding: '5px', background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}>
        <QRCodeSVG
          value={vcardUrl}
          size={size}
          fgColor="#1E3A5F"
          bgColor="#ffffff"
          level="H"
          includeMargin={false}
        />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: AP, fontSize: '0.86rem', fontWeight: 700, color: '#1d1d1f', marginBottom: '4px' }}>
          Enregistrer mon contact
        </p>
        <p style={{ fontFamily: AP, fontSize: '0.76rem', color: '#6e6e73', lineHeight: 1.5, marginBottom: '10px' }}>
          Scannez pour ajouter ma fiche contact directement dans votre téléphone.
        </p>
        <a href="/contact.vcf" download="Corentin_Commino.vcf" className="vcf-btn">
          ⬇ Télécharger la vCard
        </a>
      </div>
    </div>
  )
}
