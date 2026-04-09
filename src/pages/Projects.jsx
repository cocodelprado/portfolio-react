import React, { Suspense, useState, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, OrbitControls, Html, MeshDistortMaterial, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

/* ─── Styles globaux ─── */
const GlobalStyles = () => {
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      * { box-sizing: border-box; margin: 0; padding: 0; }
      .projects-scroll::-webkit-scrollbar { width: 3px; }
      .projects-scroll::-webkit-scrollbar-track { background: transparent; }
      .projects-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 4px; }

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes slideIn {
        from { opacity: 0; transform: translateX(-24px); }
        to   { opacity: 1; transform: translateX(0); }
      }

      .glass-panel { animation: slideIn 0.6s cubic-bezier(0.22,1,0.36,1) both; }

      .project-card {
        background: rgba(255,255,255,0.72);
        padding: 18px;
        border-radius: 18px;
        border: 1px solid rgba(255,255,255,0.55);
        box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s ease, background 0.2s ease;
        animation: fadeUp 0.4s ease both;
        cursor: default;
      }
      .project-card:hover {
        transform: translateY(-5px) scale(1.015);
        box-shadow: 0 14px 36px rgba(0,0,0,0.08);
        background: rgba(255,255,255,0.95);
      }

      .filter-btn {
        padding: 7px 16px;
        border-radius: 30px;
        border: none;
        font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
        font-size: 0.8rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.22s cubic-bezier(0.34,1.56,0.64,1);
        outline: none;
      }
      .filter-btn:hover { transform: scale(1.06); }

      .cv-btn {
        display: inline-block;
        background: linear-gradient(135deg, #0071e3 0%, #0a84ff 100%);
        color: white;
        padding: 13px 28px;
        border-radius: 30px;
        text-decoration: none;
        font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
        font-weight: 600;
        font-size: 0.95rem;
        letter-spacing: -0.01em;
        box-shadow: 0 4px 18px rgba(0,113,227,0.32);
        transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s ease;
      }
      .cv-btn:hover {
        transform: translateY(-3px) scale(1.03);
        box-shadow: 0 8px 26px rgba(0,113,227,0.42);
      }

      .voir-lien {
        font-size: 0.82rem;
        color: #0071e3;
        text-decoration: none;
        font-weight: 600;
        font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        opacity: 0.88;
        transition: opacity 0.18s, gap 0.18s;
      }
      .voir-lien:hover { opacity: 1; gap: 7px; }
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
      padding: '4px 10px',
      backgroundColor: '#1d1d1f',
      color: '#fff',
      borderRadius: '20px',
      fontSize: '0.7rem',
      fontWeight: '600',
      letterSpacing: '0.2px',
      whiteSpace: 'nowrap',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
    }}>{name}</span>
  )
}

/* ─── Badge entreprise ─── */
function BadgeEntreprise({ name }) {
  const isAssure = name === 'Assure-MER'
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 9px',
      borderRadius: '8px',
      fontSize: '0.65rem',
      fontWeight: '700',
      letterSpacing: '0.6px',
      textTransform: 'uppercase',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
      backgroundColor: isAssure ? '#dbeafe' : '#dcfce7',
      color: isAssure ? '#1d4ed8' : '#15803d',
    }}>{name}</span>
  )
}

/* ══════════════════════════════════════════
   SCÈNE 3D : Rack serveur + globe réseau
   (100% primitives Three.js, zéro URL externe)
══════════════════════════════════════════ */

/* Lame de serveur (un bloc dans le rack) */
function ServerBlade({ posY, color = '#e8e8ed', delay = 0 }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime() + delay
    ref.current.material.emissiveIntensity = 0.3 + Math.sin(t * 2) * 0.15
  })
  return (
    <group position={[0, posY, 0]}>
      {/* Corps */}
      <mesh ref={ref} castShadow>
        <boxGeometry args={[2.6, 0.18, 1.1]} />
        <meshStandardMaterial
          color={color}
          metalness={0.7}
          roughness={0.25}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Indicateur LED */}
      <mesh position={[1.1, 0, 0.42]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
      {/* Façade texturée */}
      <mesh position={[0, 0, 0.56]}>
        <boxGeometry args={[2.5, 0.12, 0.02]} />
        <meshStandardMaterial color="#2a2a2e" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

/* Rack serveur complet */
function ServerRack() {
  const blades = [
    { posY: 0.9,  color: '#e8e8ed', delay: 0   },
    { posY: 0.6,  color: '#d8e4f0', delay: 0.4 },
    { posY: 0.3,  color: '#e8e8ed', delay: 0.8 },
    { posY: 0.0,  color: '#d8e4f0', delay: 1.2 },
    { posY: -0.3, color: '#e8e8ed', delay: 0.2 },
    { posY: -0.6, color: '#d8e4f0', delay: 0.6 },
    { posY: -0.9, color: '#e8e8ed', delay: 1.0 },
  ]

  return (
    <group>
      {/* Châssis du rack */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.9, 2.4, 1.3]} />
        <meshStandardMaterial
          color="#1a1a1e"
          metalness={0.85}
          roughness={0.2}
        />
      </mesh>

      {/* Lames */}
      {blades.map((b, i) => (
        <ServerBlade key={i} {...b} />
      ))}

      {/* Rails verticaux */}
      {[-1.3, 1.3].map((x, i) => (
        <mesh key={i} position={[x, 0, 0.6]}>
          <boxGeometry args={[0.08, 2.4, 0.08]} />
          <meshStandardMaterial color="#444" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
    </group>
  )
}

/* Nœuds réseau orbitaux */
function NetworkNode({ radius, speed, offset, nodeColor = '#0071e3' }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + offset
    ref.current.position.x = Math.cos(t) * radius
    ref.current.position.y = Math.sin(t * 0.7) * 0.6
    ref.current.position.z = Math.sin(t) * radius
  })
  return (
    <mesh ref={ref} castShadow>
      <sphereGeometry args={[0.08, 12, 12]} />
      <meshStandardMaterial
        color={nodeColor}
        emissive={nodeColor}
        emissiveIntensity={1.5}
        toneMapped={false}
      />
    </mesh>
  )
}

/* Anneau orbital décoratif */
function OrbitRing({ radius, rotation = [0, 0, 0] }) {
  return (
    <mesh rotation={rotation}>
      <torusGeometry args={[radius, 0.008, 8, 80]} />
      <meshStandardMaterial
        color="#0071e3"
        transparent
        opacity={0.25}
        metalness={0.5}
      />
    </mesh>
  )
}

/* Scène complète */
function ITScene() {
  return (
    <group>
      {/* Rack centré, légèrement à gauche */}
      <Float floatIntensity={0.3} rotationIntensity={0.08} speed={1.2}>
        <group position={[-0.3, 0, 0]} rotation={[0, 0.3, 0]}>
          <ServerRack />

          {/* Anneaux orbitaux */}
          <OrbitRing radius={2.2} rotation={[Math.PI / 2, 0, 0]} />
          <OrbitRing radius={2.6} rotation={[Math.PI / 3, 0.4, 0]} />

          {/* Nœuds réseau */}
          <NetworkNode radius={2.2} speed={0.5} offset={0}        nodeColor="#0071e3" />
          <NetworkNode radius={2.2} speed={0.5} offset={Math.PI}  nodeColor="#34aadc" />
          <NetworkNode radius={2.6} speed={0.35} offset={1}       nodeColor="#00c896" />
          <NetworkNode radius={2.6} speed={0.35} offset={3.5}     nodeColor="#0071e3" />
          <NetworkNode radius={1.9} speed={0.7} offset={2}        nodeColor="#ff6b6b" />
        </group>
      </Float>
    </group>
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
      <div style={{
        color: '#1d1d1f', fontFamily: 'monospace',
        fontSize: '18px', letterSpacing: '5px', fontWeight: 'bold',
      }}>{dots}</div>
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
      description: "AD centralisé avec GPO, DHCP et DNS pour gérer utilisateurs et ressources réseau.",
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
      description: "Messagerie interne HMail + Thunderbird pour confidentialité et administration centralisée.",
      techs: ['HMailServer', 'Thunderbird', 'SMTP'],
      link: 'https://848e6f89-4cff-4f31-b0f5-37e7da2515ca.filesusr.com/ugd/558313_4c356de43ba84c0999563ad5b7175711.pdf'
    },
    {
      entreprise: 'GREENTECH', mission: 'Mission 5',
      title: 'Serveur WEB DMZ + Zabbix',
      description: "Serveur web en zone DMZ et supervision Zabbix pour surveiller les performances en temps réel.",
      techs: ['Apache', 'DMZ', 'Zabbix'],
      link: 'https://848e6f89-4cff-4f31-b0f5-37e7da2515ca.filesusr.com/ugd/558313_4b10d00fc8ee4daaa05d8b5a3289eb69.pdf'
    },
    {
      entreprise: 'GREENTECH', mission: 'Mission 6',
      title: 'HAProxy + Load Balancing',
      description: "Répartition de charge et haute disponibilité sur 2 serveurs web via HAProxy.",
      techs: ['HAProxy', 'Load Balancing', 'Linux'],
      link: 'https://848e6f89-4cff-4f31-b0f5-37e7da2515ca.filesusr.com/ugd/558313_52b8d31b37c240869b99a4336b85cc33.pdf'
    },
    {
      entreprise: 'GREENTECH', mission: 'Mission 7',
      title: 'Serveur WSUS',
      description: "Centralisation et automatisation des mises à jour Windows pour l'ensemble du parc.",
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
  const handleFilter = (f) => { setFilter(f); setAnimKey(k => k + 1) }

  return (
    <>
      <GlobalStyles />
      <div style={{
        width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden',
        background: 'radial-gradient(ellipse at 30% 50%, #ffffff 0%, #e5e5ea 100%)',
      }}>

        {/* Lumières décoratives */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          background: `
            radial-gradient(ellipse 600px 400px at 70% 30%, rgba(0,113,227,0.05), transparent),
            radial-gradient(ellipse 400px 300px at 20% 80%, rgba(0,200,130,0.04), transparent)
          `,
        }} />

        {/* ── Scène 3D ── */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: '55%', height: '100%', zIndex: 1 }}>
          <Canvas
            camera={{ position: [0, 0.5, 7], fov: 42 }}
            shadows
            gl={{ antialias: true }}
          >
            <color attach="background" args={['transparent']} />
            <ambientLight intensity={0.6} />
            <pointLight position={[4, 4, 4]} intensity={1.2} color="#ffffff" castShadow />
            <pointLight position={[-3, -2, 3]} intensity={0.5} color="#e8f0ff" />
            <pointLight position={[0, -3, 2]} intensity={0.3} color="#00ff88" />
            <Environment preset="studio" />

            <Suspense fallback={<Loader />}>
              <ITScene />
            </Suspense>

            <OrbitControls
              enablePan={false}
              enableZoom={false}
              autoRotate
              autoRotateSpeed={0.6}
              minPolarAngle={Math.PI / 3.5}
              maxPolarAngle={Math.PI / 2}
            />
          </Canvas>
        </div>

        {/* ── Panneau projets ── */}
        <div style={{
  position: 'absolute', top: 0, left: 0,
  width: '100%', height: '100%', zIndex: 2,
  display: 'flex', alignItems: 'center',
  paddingLeft: '5%', paddingTop: '48px', paddingBottom: '48px',
  pointerEvents: 'none',
          }}>

          <div className="glass-panel" style={{
            maxWidth: '640px', width: '100%',
            maxHeight: 'calc(100vh - 120px)',
            pointerEvents: 'auto',
            backgroundColor: 'rgba(255,255,255,0.58)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            padding: '36px 36px 32px',
            borderRadius: '26px',
            boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 0 10px 40px rgba(0,0,0,0.06)',
            border: '1px solid rgba(255,255,255,0.65)',
            display: 'flex', flexDirection: 'column',
          }}>

            {/* En-tête */}
            <div style={{ marginBottom: '20px', flexShrink: 0 }}>
              <span style={{
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
                fontSize: '0.72rem', fontWeight: '600', color: '#0071e3',
                letterSpacing: '1.8px', textTransform: 'uppercase',
                display: 'block', marginBottom: '8px',
              }}>Portfolio · Corentin Commino</span>
              <h1 style={{
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
                fontSize: '2.8rem', fontWeight: 800, letterSpacing: '-0.04em',
                color: '#1d1d1f', lineHeight: 1.05, marginBottom: '10px',
              }}>Mes Projets.</h1>
              <p style={{
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
                fontSize: '0.98rem', lineHeight: '1.6', color: '#6e6e73',
              }}>
                Réalisations en infrastructure & sécurité réseau, réalisées en alternance.
              </p>
            </div>

            {/* Filtres */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', flexShrink: 0 }}>
              {filters.map(f => (
                <button key={f} className="filter-btn" onClick={() => handleFilter(f)} style={{
                  backgroundColor: filter === f ? '#1d1d1f' : 'rgba(255,255,255,0.65)',
                  color: filter === f ? '#fff' : '#424245',
                  boxShadow: filter === f ? '0 2px 10px rgba(0,0,0,0.18)' : '0 1px 4px rgba(0,0,0,0.06)',
                }}>{f}</button>
              ))}
              <span style={{
                marginLeft: 'auto',
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
                fontSize: '0.75rem', color: '#aeaeb2', fontWeight: '500',
              }}>{filtered.length} projet{filtered.length > 1 ? 's' : ''}</span>
            </div>

            {/* Grille */}
            <div className="projects-scroll" key={animKey} style={{
              display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px', overflowY: 'auto', flex: 1,
              paddingRight: '4px', paddingBottom: '4px',
            }}>
              {filtered.map((project, i) => (
                <div key={`${project.title}-${i}`} className="project-card"
                  style={{ animationDelay: `${i * 55}ms` }}>
                  <div style={{ marginBottom: '5px' }}>
                    <BadgeEntreprise name={project.entreprise} />
                  </div>
                  <p style={{
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
                    fontSize: '0.65rem', color: '#aeaeb2', fontWeight: '600',
                    letterSpacing: '0.4px', textTransform: 'uppercase', marginBottom: '5px',
                  }}>{project.mission}</p>
                  <h3 style={{
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
                    fontSize: '0.9rem', fontWeight: 700, color: '#1d1d1f',
                    lineHeight: 1.3, marginBottom: '7px', letterSpacing: '-0.01em',
                  }}>{project.title}</h3>
                  <p style={{
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
                    fontSize: '0.8rem', color: '#6e6e73', lineHeight: '1.5', marginBottom: '10px',
                  }}>{project.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '12px' }}>
                    {project.techs.map((t, ti) => <BadgeTech key={ti} name={t} />)}
                  </div>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="voir-lien">
                    Voir le dossier <span>→</span>
                  </a>
                </div>
              ))}
            </div>

            {/* Bouton CV */}
            <div style={{ paddingTop: '22px', flexShrink: 0 }}>
              <a href="/cv.pdf" download="CV_Corentin_Commino.pdf" className="cv-btn">
                📄 Télécharger mon CV
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
