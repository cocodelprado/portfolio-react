import React, { Suspense, useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Float, OrbitControls, useGLTF, Html, Center } from '@react-three/drei'

/* ─── Styles globaux injectés ─── */
const GlobalStyles = () => {
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

      * { box-sizing: border-box; }

      .projects-scroll::-webkit-scrollbar { width: 4px; }
      .projects-scroll::-webkit-scrollbar-track { background: transparent; }
      .projects-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 4px; }

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      @keyframes gradientShift {
        0%   { background-position: 0% 50%; }
        50%  { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50%       { transform: translateY(-8px); }
      }

      .project-card {
        background: rgba(255,255,255,0.75);
        padding: 22px;
        border-radius: 20px;
        border: 1px solid rgba(255,255,255,0.5);
        box-shadow: 0 4px 20px rgba(0,0,0,0.04);
        cursor: default;
        transition: transform 0.3s cubic-bezier(.34,1.56,.64,1),
                    box-shadow 0.3s ease,
                    background 0.3s ease;
        animation: fadeUp 0.5s ease both;
      }

      .project-card:hover {
        transform: translateY(-6px) scale(1.01);
        box-shadow: 0 16px 40px rgba(0,0,0,0.09);
        background: rgba(255,255,255,0.95);
      }

      .filter-btn {
        padding: 8px 18px;
        border-radius: 30px;
        border: none;
        font-family: 'DM Sans', sans-serif;
        font-size: 0.82rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.25s cubic-bezier(.34,1.56,.64,1);
        outline: none;
      }

      .filter-btn:hover { transform: scale(1.05); }

      .cv-btn {
        display: inline-block;
        background: linear-gradient(135deg, #0071e3, #0a84ff);
        color: white;
        padding: 14px 30px;
        border-radius: 30px;
        text-decoration: none;
        font-family: 'DM Sans', sans-serif;
        font-weight: 600;
        font-size: 0.95rem;
        box-shadow: 0 6px 20px rgba(0,113,227,0.35);
        transition: transform 0.3s cubic-bezier(.34,1.56,.64,1), box-shadow 0.3s ease;
      }

      .cv-btn:hover {
        transform: translateY(-3px) scale(1.03);
        box-shadow: 0 10px 28px rgba(0,113,227,0.45);
      }

      .voir-lien {
        font-size: 0.82rem;
        color: #0071e3;
        text-decoration: none;
        font-weight: 600;
        font-family: 'DM Sans', sans-serif;
        opacity: 0.85;
        transition: opacity 0.2s, letter-spacing 0.2s;
        display: inline-block;
      }

      .voir-lien:hover { opacity: 1; letter-spacing: 0.3px; }

      .glass-card {
        animation: fadeUp 0.6s ease both;
      }

      .bg-animated {
        background: linear-gradient(135deg, #f0f0f5, #ffffff, #e8eaf0, #f5f5f7);
        background-size: 400% 400%;
        animation: gradientShift 12s ease infinite;
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])
  return null
}

/* ─── Badge tech ─── */
function BadgeTech({ name }) {
  return (
    <span style={{
      padding: '5px 11px',
      backgroundColor: '#1d1d1f',
      color: '#ffffff',
      borderRadius: '20px',
      fontSize: '0.72rem',
      fontWeight: '600',
      letterSpacing: '0.4px',
      whiteSpace: 'nowrap',
      fontFamily: "'DM Sans', sans-serif",
    }}>{name}</span>
  )
}

/* ─── Badge entreprise ─── */
function BadgeEntreprise({ name }) {
  const isAssure = name === 'Assure-MER'
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: '10px',
      fontSize: '0.68rem',
      fontWeight: '700',
      letterSpacing: '0.5px',
      fontFamily: "'DM Sans', sans-serif",
      backgroundColor: isAssure ? '#dbeafe' : '#dcfce7',
      color: isAssure ? '#1d4ed8' : '#15803d',
      textTransform: 'uppercase',
    }}>{name}</span>
  )
}

/* ─── Modèle 3D ─── */
function MyBodyModel() {
  const { scene } = useGLTF("https://res.cloudinary.com/drcx8ckvv/image/upload/v1775740398/bar_sign_board_pm3rmf.glb")
  return (
    <Center>
      <primitive object={scene} scale={0.1} position={[0, 0, 0]} />
    </Center>
  )
}

/* ─── Loader ─── */
function Loader() {
  const [dots, setDots] = useState('')
  useEffect(() => {
    const iv = setInterval(() => setDots(p => p.length >= 3 ? '' : p + '.'), 400)
    return () => clearInterval(iv)
  }, [])
  return (
    <Html center>
      <div style={{ color: '#1d1d1f', fontFamily: 'monospace', fontSize: '20px', letterSpacing: '5px', fontWeight: 'bold' }}>
        {dots}
      </div>
    </Html>
  )
}

/* ─── Composant principal ─── */
export default function Projects() {
  const [filter, setFilter] = useState('Tous')
  const [animKey, setAnimKey] = useState(0)

  const projects = [
    {
      entreprise: 'Assure-MER', mission: 'Mission 1',
      title: 'Renouvellement des postes de travail',
      description: "Équipement nomade écologique pour le télétravail : étude comparative, écolabel et gestion des licences.",
      techs: ['Windows 11', 'Écolabel', 'Licences'],
      link: 'https://848e6f89-4cff-4f31-b0f5-37e7da2515ca.filesusr.com/ugd/06c53b_d7a7514c369d4e6e911166d426acd962.pdf'
    },
    {
      entreprise: 'Assure-MER', mission: 'Mission 2',
      title: 'Masterisation WDS / PXE',
      description: "Déploiement du rôle WDS pour masteriser les postes via PXE avec procédure complète.",
      techs: ['WDS', 'PXE', 'Windows Server'],
      link: 'https://848e6f89-4cff-4f31-b0f5-37e7da2515ca.filesusr.com/ugd/06c53b_ffa2d0a929a74ef0981cfc701b866436.pdf'
    },
    {
      entreprise: 'Assure-MER', mission: 'Mission 3',
      title: 'Solution de sauvegarde',
      description: "Comparaison de solutions, essai Windows Server Backup, registre de traitement RGPD.",
      techs: ['WSB', 'RGPD', 'Sauvegarde'],
      link: 'https://848e6f89-4cff-4f31-b0f5-37e7da2515ca.filesusr.com/ugd/558313_8682299652ec4bb085d074d9318995c2.pdf'
    },
    {
      entreprise: 'GREENTECH', mission: 'Mission 1',
      title: 'Serveur Active Directory',
      description: "AD centralisé avec GPO, DHCP et DNS pour gérer utilisateurs et ressources.",
      techs: ['Active Directory', 'GPO', 'DHCP', 'DNS'],
      link: 'https://848e6f89-4cff-4f31-b0f5-37e7da2515ca.filesusr.com/ugd/558313_f74ada2329e0477ba12a9b7213830ce2.pdf'
    },
    {
      entreprise: 'GREENTECH', mission: 'Mission 2',
      title: "Centre d'assistance GLPI",
      description: "Déploiement GLPI pour la gestion structurée des incidents et tickets IT.",
      techs: ['GLPI', 'ITSM', 'Helpdesk'],
      link: 'https://848e6f89-4cff-4f31-b0f5-37e7da2515ca.filesusr.com/ugd/558313_4e4f5ba649d94e16965d8cfe96b28104.pdf'
    },
    {
      entreprise: 'GREENTECH', mission: 'Mission 3',
      title: 'Firewall Stormshield',
      description: "Pare-feu Stormshield avec règles de filtrage et contrôle optimal des flux réseau.",
      techs: ['Stormshield', 'Firewall', 'Filtrage'],
      link: 'https://848e6f89-4cff-4f31-b0f5-37e7da2515ca.filesusr.com/ugd/558313_67968f0348da4aba88a673606940225e.pdf'
    },
    {
      entreprise: 'GREENTECH', mission: 'Mission 4',
      title: 'Serveur de messagerie HMail',
      description: "Messagerie interne HMail + Thunderbird pour renforcer confidentialité et contrôle admin.",
      techs: ['HMailServer', 'Thunderbird', 'SMTP'],
      link: 'https://848e6f89-4cff-4f31-b0f5-37e7da2515ca.filesusr.com/ugd/558313_4c356de43ba84c0999563ad5b7175711.pdf'
    },
    {
      entreprise: 'GREENTECH', mission: 'Mission 5',
      title: 'Serveur WEB DMZ + Zabbix',
      description: "Serveur web en zone DMZ et supervision Zabbix pour monitorer les performances en temps réel.",
      techs: ['Apache', 'DMZ', 'Zabbix'],
      link: 'https://848e6f89-4cff-4f31-b0f5-37e7da2515ca.filesusr.com/ugd/558313_4b10d00fc8ee4daaa05d8b5a3289eb69.pdf'
    },
    {
      entreprise: 'GREENTECH', mission: 'Mission 6',
      title: 'HAProxy + Load Balancing',
      description: "Répartition de charge haute disponibilité sur 2 serveurs web via HAProxy.",
      techs: ['HAProxy', 'Load Balancing', 'Linux'],
      link: 'https://848e6f89-4cff-4f31-b0f5-37e7da2515ca.filesusr.com/ugd/558313_52b8d31b37c240869b99a4336b85cc33.pdf'
    },
    {
      entreprise: 'GREENTECH', mission: 'Mission 7',
      title: 'Serveur WSUS',
      description: "Centralisation et automatisation des mises à jour Windows pour tout le parc.",
      techs: ['WSUS', 'Windows Server', 'Patch'],
      link: 'https://848e6f89-4cff-4f31-b0f5-37e7da2515ca.filesusr.com/ugd/558313_ba3873460d624cddb1c117f69da63cac.pdf'
    },
    {
      entreprise: 'GREENTECH', mission: 'Mission 8',
      title: 'Borne WiFi ARUBA',
      description: "Configuration d'une borne Aruba pour une couverture WiFi optimale et sécurisée.",
      techs: ['Aruba', 'WiFi', 'Sécurité réseau'],
      link: 'https://848e6f89-4cff-4f31-b0f5-37e7da2515ca.filesusr.com/ugd/558313_49833c0b8d294705aa6a9fff70611895.pdf'
    },
  ]

  const filters = ['Tous', 'Assure-MER', 'GREENTECH']
  const filtered = filter === 'Tous' ? projects : projects.filter(p => p.entreprise === filter)

  const handleFilter = (f) => {
    setFilter(f)
    setAnimKey(k => k + 1) // reset animation
  }

  return (
    <>
      <GlobalStyles />
      <div className="bg-animated" style={{
        width: '100vw', height: '100vh',
        position: 'relative', overflow: 'hidden',
      }}>

        {/* ── Décoration : cercles flottants ── */}
        <div style={{
          position: 'absolute', width: '500px', height: '500px',
          borderRadius: '50%', top: '-150px', left: '-100px',
          background: 'radial-gradient(circle, rgba(0,113,227,0.06), transparent 70%)',
          animation: 'float 8s ease-in-out infinite',
          pointerEvents: 'none', zIndex: 0,
        }} />
        <div style={{
          position: 'absolute', width: '300px', height: '300px',
          borderRadius: '50%', bottom: '-80px', left: '300px',
          background: 'radial-gradient(circle, rgba(0,200,150,0.05), transparent 70%)',
          animation: 'float 10s ease-in-out infinite reverse',
          pointerEvents: 'none', zIndex: 0,
        }} />

        {/* ── Scène 3D ── */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: '55%', height: '100%', zIndex: 1 }}>
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <ambientLight intensity={1.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
            <Environment preset="studio" />
            <Float rotationIntensity={0.1} floatIntensity={0.3} speed={1}>
              <Suspense fallback={<Loader />}>
                <MyBodyModel />
              </Suspense>
            </Float>
            <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.6} />
          </Canvas>
        </div>

        {/* ── Panneau gauche ── */}
        <div style={{
          position: 'absolute', top: 0, left: 0,
          width: '100%', height: '100%', zIndex: 2,
          display: 'flex', alignItems: 'center',
          paddingLeft: '5%', pointerEvents: 'none',
        }}>
          <div className="glass-card" style={{
            maxWidth: '660px',
            pointerEvents: 'auto',
            backgroundColor: 'rgba(255,255,255,0.55)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            padding: '44px 44px 36px',
            borderRadius: '28px',
            boxShadow: '0 12px 48px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
            border: '1px solid rgba(255,255,255,0.6)',
          }}>

            {/* Titre */}
            <div style={{ marginBottom: '6px' }}>
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.78rem', fontWeight: '500',
                color: '#0071e3', letterSpacing: '2px',
                textTransform: 'uppercase',
              }}>Portfolio · Corentin Commino</span>
            </div>
            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '3rem', fontWeight: 800,
              margin: '0 0 12px', letterSpacing: '-0.04em', color: '#1d1d1f',
              lineHeight: 1.1,
            }}>
              Mes Projets.
            </h1>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '1rem', lineHeight: '1.65',
              color: '#6e6e73', marginBottom: '28px',
            }}>
              Réalisations en infrastructure & sécurité réseau,<br />réalisées en alternance.
            </p>

            {/* Filtres */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
              {filters.map(f => (
                <button
                  key={f}
                  className="filter-btn"
                  onClick={() => handleFilter(f)}
                  style={{
                    backgroundColor: filter === f ? '#1d1d1f' : 'rgba(255,255,255,0.6)',
                    color: filter === f ? '#fff' : '#424245',
                    boxShadow: filter === f
                      ? '0 4px 14px rgba(0,0,0,0.15)'
                      : '0 2px 8px rgba(0,0,0,0.05)',
                  }}
                >{f}</button>
              ))}
              <span style={{
                marginLeft: 'auto',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.78rem', color: '#aeaeb2',
                alignSelf: 'center',
              }}>
                {filtered.length} projet{filtered.length > 1 ? 's' : ''}
              </span>
            </div>

            {/* Grille */}
            <div
              className="projects-scroll"
              key={animKey}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '14px',
                marginBottom: '32px',
                maxHeight: '380px',
                overflowY: 'auto',
                paddingRight: '6px',
              }}
            >
              {filtered.map((project, i) => (
                <div
                  key={`${project.title}-${i}`}
                  className="project-card"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <BadgeEntreprise name={project.entreprise} />
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '0.68rem', color: '#aeaeb2',
                    margin: '6px 0 4px', fontWeight: '500',
                    letterSpacing: '0.3px',
                  }}>{project.mission}</p>
                  <h3 style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: '0.95rem', fontWeight: 700,
                    margin: '0 0 8px', color: '#1d1d1f', lineHeight: 1.3,
                  }}>{project.title}</h3>
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '0.82rem', color: '#6e6e73',
                    marginBottom: '12px', lineHeight: '1.5',
                  }}>{project.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '14px' }}>
                    {project.techs.map((t, ti) => <BadgeTech key={ti} name={t} />)}
                  </div>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="voir-lien">
                    Voir le dossier →
                  </a>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a href="/cv.pdf" download="CV_Corentin_Commino.pdf" className="cv-btn">
              📄 Télécharger mon CV
            </a>

          </div>
        </div>
      </div>
    </>
  )
}
