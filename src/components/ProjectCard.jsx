import BadgeTech from './BadgeTech'

const AP = "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif"

export default function ProjectCard({ project, style = {} }) {
  const { title, description, techs = [], type, company, liveUrl, githubUrl, stars, updatedAt } = project

  const typeColors = {
    Web:    { bg: '#e0f0ff', color: '#0058a3' },
    Mobile: { bg: '#f0e8ff', color: '#6a1fc2' },
    Design: { bg: '#fff0e0', color: '#a35800' },
    Stage:  { bg: '#e8faf0', color: '#15803d' },
  }
  const badge = typeColors[type] || { bg: '#f0f0f5', color: '#424245' }

  const formattedDate = updatedAt
    ? new Date(updatedAt).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
    : null

  return (
    <div
      className="project-card"
      style={{ display: 'flex', flexDirection: 'column', ...style }}
    >
      {/* Badges type + company */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
        {type && (
          <span style={{
            padding: '3px 9px', borderRadius: '8px',
            fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.6px',
            textTransform: 'uppercase', fontFamily: AP,
            backgroundColor: badge.bg, color: badge.color,
          }}>{type}</span>
        )}
        {company && (
          <span style={{
            padding: '3px 9px', borderRadius: '8px',
            fontSize: '0.65rem', fontWeight: '600', letterSpacing: '0.4px',
            fontFamily: AP,
            backgroundColor: 'rgba(0,0,0,0.05)', color: '#6e6e73',
          }}>{company}</span>
        )}
      </div>

      {/* Titre */}
      <h3 style={{
        fontFamily: AP, fontSize: '0.92rem', fontWeight: 700,
        color: '#1d1d1f', lineHeight: 1.3, marginBottom: '6px',
        letterSpacing: '-0.01em', flex: 'none',
      }}>{title}</h3>

      {/* Description */}
      <p style={{
        fontFamily: AP, fontSize: '0.8rem', color: '#6e6e73',
        lineHeight: '1.5', marginBottom: '10px', flex: 1,
      }}>{description || 'Pas de description disponible.'}</p>

      {/* Techs */}
      {techs.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '12px' }}>
          {techs.map((t, i) => <BadgeTech key={i} name={t} />)}
        </div>
      )}

      {/* Footer de la carte */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {liveUrl && (
          <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="voir-lien">
            {githubUrl ? 'GitHub →' : 'Voir →'}
          </a>
        )}
        {githubUrl && liveUrl !== githubUrl && (
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="voir-lien">
            GitHub →
          </a>
        )}
        {stars != null && (
          <span style={{ fontFamily: AP, fontSize: '0.75rem', color: '#aeaeb2', marginLeft: 'auto' }}>
            ⭐ {stars}
          </span>
        )}
        {formattedDate && !stars && (
          <span style={{ fontFamily: AP, fontSize: '0.75rem', color: '#aeaeb2', marginLeft: 'auto' }}>
            {formattedDate}
          </span>
        )}
      </div>
    </div>
  )
}
