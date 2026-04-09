import React, { Suspense, useState, useEffect, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, OrbitControls, Html } from '@react-three/drei'
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
        padding: 18px; border-radius: 18px;
        border: 1px solid rgba(255,255,255,0.55);
        box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s ease, background 0.2s ease;
        animation: fadeUp 0.4s ease both; cursor: default;
      }
      .project-card:hover {
        transform: translateY(-5px) scale(1.015);
        box-shadow: 0 14px 36px rgba(0,0,0,0.08);
        background: rgba(255,255,255,0.95);
      }
      .filter-btn {
        padding: 7px 16px; border-radius: 30px; border: none;
        font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
        font-size: 0.8rem; font-weight: 500; cursor: pointer;
        transition: all 0.22s cubic-bezier(0.34,1.56,0.64,1); outline: none;
      }
      .filter-btn:hover { transform: scale(1.06); }
      .cv-btn {
        display: inline-block;
        background: linear-gradient(135deg, #0071e3 0%, #0a84ff 100%);
        color: white; padding: 13px 28px; border-radius: 30px; text-decoration: none;
        font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
        font-weight: 600; font-size: 0.95rem; letter-spacing: -0.01em;
        box-shadow: 0 4px 18px rgba(0,113,227,0.32);
        transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s ease;
      }
      .cv-btn:hover { transform: translateY(-3px) scale(1.03); box-shadow: 0 8px 26px rgba(0,113,227,0.42); }
      .voir-lien {
        font-size: 0.82rem; color: #0071e3; text-decoration: none; font-weight: 600;
        font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
        display: inline-flex; align-items: center; gap: 4px; opacity: 0.88;
        transition: opacity 0.18s, gap 0.18s;
      }
      .voir-lien:hover { opacity: 1; gap: 7px; }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])
  return null
}

function BadgeTech({ name }) {
  return (
    <span style={{
      padding: '4px 10px', backgroundColor: '#1d1d1f', color: '#fff',
      borderRadius: '20px', fontSize: '0.7rem', fontWeight: '600',
      letterSpacing: '0.2px', whiteSpace: 'nowrap',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
    }}>{name}</span>
  )
}

function BadgeEntreprise({ name }) {
  const isAssure = name === 'Assure-MER'
  return (
    <span style={{
      display: 'inline-block', padding: '3px 9px', borderRadius: '8px',
      fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.6px',
      textTransform: 'uppercase',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
      backgroundColor: isAssure ? '#dbeafe' : '#dcfce7',
      color: isAssure ? '#1d4ed8' : '#15803d',
    }}>{name}</span>
  )
}

/* ══════════════════════════════
   SCÈNE 3D : Globe réseau élégant
══════════════════════════════ */

/* Points sur une sphère (distribution de Fibonacci) */
function NetworkGlobe() {
  const groupRef = useRef()
  const linesRef = useRef()

  const { positions, connections } = useMemo(() => {
    const N = 60
    const pts = []
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const theta = golden * i
      pts.push(new THREE.Vector3(
        Math.cos(theta) * r * 2.2,
        y * 2.2,
        Math.sin(theta) * r * 2.2
      ))
    }

    // Connexions entre points proches
    const conns = []
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        if (pts[i].distanceTo(pts[j]) < 1.35) {
          conns.push([i, j])
        }
      }
    }
    return { positions: pts, connections: conns }
  }, [])

  // Géométrie des lignes
  const lineGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const verts = []
    connections.forEach(([i, j]) => {
      verts.push(positions[i].x, positions[i].y, positions[i].z)
      verts.push(positions[j].x, positions[j].y, positions[j].z)
    })
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
    return geo
  }, [positions, connections])

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.18
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.08) * 0.12
    }
  })

  return (
    <group ref={groupRef}>
      {/* Lignes de connexion */}
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial
          color="#0071e3"
          transparent
          opacity={0.18}
        />
      </lineSegments>

      {/* Nœuds */}
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.055, 8, 8]} />
          <meshStandardMaterial
            color={i % 7 === 0 ? '#0071e3' : i % 5 === 0 ? '#34aadc' : '#c8d8f0'}
            emissive={i % 7 === 0 ? '#0071e3' : '#aabfe0'}
            emissiveIntensity={i % 7 === 0 ? 0.8 : 0.2}
            roughness={0.3}
            metalness={0.4}
          />
        </mesh>
      ))}

      {/* Sphère centrale translucide */}
      <mesh>
        <sphereGeometry args={[2.18, 48, 48]} />
        <meshStandardMaterial
          color="#e8f0ff"
          transparent
          opacity={0.06}
          roughness={0.1}
          metalness={0.2}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}

/* Particules flottantes autour du globe */
function FloatingParticles() {
  const refs = useRef([])
  const data = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      radius: 2.8 + Math.random() * 0.8,
      speed:  0.25 + Math.random() * 0.25,
      offset: (i / 8) * Math.PI * 2,
      yAmp:   0.4 + Math.random() * 0.4,
      color:  ['#0071e3','#34aadc','#00c896','#5ac8fa'][i % 4],
      size:   0.045 + Math.random() * 0.04,
    })), [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    refs.current.forEach((mesh, i) => {
      if (!mesh) return
      const d = data[i]
      mesh.position.x = Math.cos(t * d.speed + d.offset) * d.radius
      mesh.position.y = Math.sin(t * d.speed * 0.6 + d.offset) * d.yAmp
      mesh.position.z = Math.sin(t * d.speed + d.offset) * d.radius
    })
  })

  return (
    <>
      {data.map((d, i) => (
        <mesh key={i} ref={el => refs.current[i] = el}>
          <sphereGeometry args={[d.size, 8, 8]} />
          <meshStandardMaterial
            color={d.color}
            emissive={d.color}
            emissiveIntensity={1.8}
            toneMapped={false}
          />
        </mesh>
      ))}
    </>
  )
}

function ITScene() {
  return (
    <Float floatIntensity={0.25} rotationIntensity={0.04} speed={1.0}>
      <NetworkGlobe />
      <FloatingParticles />
    </Float>
  )
}

function Loader() {
  const [dots, setDots] = useState('')
  useEffect(() => {
    const iv = setInterval(() => setDots(p => p.length >= 3 ? '' : p + '.'), 400)
    return () => clearInterval(iv)
  }, [])
  return (
    <Html center>
      <div style={{ color: '#1d1d1f', fontFamily: 'monospace', fontSize: '18px', letterSpacing: '5px', fontWeight: 'bold' }}>
        {dots}
      </div>
    </Html>
  )
}

export default function Projects() {
  const [filter, setFilter] = useState('Tous')
  const [animKey, setAnimKey] = useState(0)

  const projects = [
    { entreprise: 'Assure-MER', mission: 'Mission 1', title: 'Renouvellement des postes de travail', description: "Équipement nomade écologique pour le télétravail : étude comparative, écolabel et gestion des licences.", techs: ['Windows 11', 'Écolabel', 'Licences'], link: 'https://848e6f89-4cff-4f31-b0f5-37e7da2515ca.filesusr.com/ugd/06c53b_d7a7514c369d4e6e911166d426acd962.pdf' },
    { entreprise: 'Assure-MER', mission: 'Mission 2', title: 'Masterisation WDS / PXE', description: "Déploiement du rôle WDS pour masteriser les postes via PXE avec procédure complète.", techs: ['WDS', 'PXE', 'Windows Server'], link: 'https://848e6f89-4cff-4f31-b0f5-37e7da2515ca.filesusr.com/ugd/06c53b_ffa2d0a929a74ef0981cfc701b866436.pdf' },
    { entreprise: 'Assure-MER', mission: 'Mission 3', title: 'Solution de sauvegarde', description: "Comparaison de solutions, essai Windows Server Backup, registre de traitement RGPD.", techs: ['WSB', 'RGPD', 'Sauvegarde'], link: 'https://848e6f89-4cff-4f31-b0f5-37e7da2515ca.filesusr.com/ugd/558313_8682299652ec4bb085d074d9318995c2.pdf' },
    { entreprise: 'GREENTECH', mission: 'Mission 1', title: 'Serveur Active Directory', description: "AD centralisé avec GPO, DHCP et DNS pour gérer utilisateurs et ressources réseau.", techs: ['Active Directory', 'GPO', 'DHCP', 'DNS'], link: 'https://848e6f89-4cff-4f31-b0f5-37e7da2515ca.filesusr.com/ugd/558313_f74ada2329e0477ba12a9b7213830ce2.pdf' },
    { entreprise: 'GREENTECH', mission: 'Mission 2', title: "Centre d'assistance GLPI", description: "Déploiement GLPI pour la gestion structurée des incidents et tickets IT.", techs: ['GLPI', 'ITSM', 'Helpdesk'], link: 'https://848e6f89-4cff-4f31-b0f5-37e7da2515ca.filesusr.com/ugd/558313_4e4f5ba649d94e16965d8cfe96b28104.pdf' },
    { entreprise: 'GREENTECH', mission: 'Mission 3', title: 'Firewall Stormshield', description: "Pare-feu Stormshield avec règles de filtrage et contrôle optimal des flux réseau.", techs: ['Stormshield', 'Firewall', 'Filtrage'], link: 'https://848e6f89-4cff-4f31-b0f5-37e7da2515ca.filesusr.com/ugd/558313_67968f0348da4aba88a673606940225e.pdf' },
    { entreprise: 'GREENTECH', mission: 'Mission 4', title: 'Serveur de messagerie HMail', description: "Messagerie interne HMail + Thunderbird pour confidentialité et administration centralisée.", techs: ['HMailServer', 'Thunderbird', 'SMTP'], link: 'https://848e6f89-4cff-4f31-b0f5-37e7da2515ca.filesusr.com/ugd/558313_4c356de43ba84c0999563ad5b7175711.pdf' },
    { entreprise: 'GREENTECH', mission: 'Mission 5', title: 'Serveur WEB DMZ + Zabbix', description: "Serveur web en zone DMZ et supervision Zabbix pour surveiller les performances en temps réel.", techs: ['Apache', 'DMZ', 'Zabbix'], link: 'https://848e6f89-4cff-4f31-b0f5-37e7da2515ca.filesusr.com/ugd/558313_4b10d00fc8ee4daaa05d8b5a3289eb69.pdf' },
    { entreprise: 'GREENTECH', mission: 'Mission 6', title: 'HAProxy + Load Balancing', description: "Répartition de charge et haute disponibilité sur 2 serveurs web via HAProxy.", techs: ['HAProxy', 'Load Balancing', 'Linux'], link: 'https://848e6f89-4cff-4f31-b0f5-37e7da2515ca.filesusr.com/ugd/558313_52b8d31b37c240869b99a4336b85cc33.pdf' },
    { entreprise: 'GREENTECH', mission: 'Mission 7', title: 'Serveur WSUS', description: "Centralisation et automatisation des mises à jour Windows pour l'ensemble du parc.", techs: ['WSUS', 'Windows Server', 'Patch'], link: 'https://848e6f89-4cff-4f31-b0f5-37e7da2515ca.filesusr.com/ugd/558313_ba3873460d624cddb1c117f69da63cac.pdf' },
    { entreprise: 'GREENTECH', mission: 'Mission 8', title: 'Borne WiFi ARUBA', description: "Configuration d'une borne Aruba pour une couverture WiFi optimale et sécurisée.", techs: ['Aruba', 'WiFi', 'Sécurité réseau'], link: 'https://848e6f89-4cff-4f31-b0f5-37e7da2515ca.filesusr.com/ugd/558313_49833c0b8d294705aa6a9fff70611895.pdf' },
  ]

  const filters = ['Tous', 'Assure-MER', 'GREENTECH']
  const filtered = filter === 'Tous' ? projects : projects.filter(p => p.entreprise === filter)
  const handleFilter = (f) => { setFilter(f); setAnimKey(k => k + 1) }

  return (
    <>
      <GlobalStyles />
      <div style={{
        width: '100vw', height: '100vh', position: 'relative',
        overflow: 'hidden',
        background: '#ffffff',   /* ← tout blanc, zéro dégradé */
      }}>

        {/* ── Scène 3D pleine page, fond blanc ── */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: '100%', height: '100%', zIndex: 1 }}>
          <Canvas camera={{ position: [0, 0, 7], fov: 42 }} gl={{ antialias: true, alpha: false }}>
            {/* Fond blanc natif WebGL → aucune démarcation possible */}
            <color attach="background" args={['#ffffff']} />

            <ambientLight intensity={0.9} />
            <pointLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
            <pointLight position={[-4, -2, 4]} intensity={0.4} color="#d0e4ff" />
            <Environment preset="studio" />

            <Suspense fallback={<Loader />}>
              <ITScene />
            </Suspense>

            <OrbitControls
              enablePan={false}
              enableZoom={false}
              autoRotate={false}
            />
          </Canvas>
        </div>

        {/* ── Panneau projets (inchangé) ── */}
        <div style={{
          position: 'absolute', top: 0, left: 0,
          width: '100%', height: '100%', zIndex: 2,
          display: 'flex', alignItems: 'center',
          paddingLeft: '5%', paddingTop: '48px', paddingBottom: '48px',
          pointerEvents: 'none',
        }}>
          <div className="glass-panel" style={{
            maxWidth: '640px', width: '100%',
            maxHeight: 'calc(100vh - 150px)',
            pointerEvents: 'auto',
            backgroundColor: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            padding: '36px 36px 32px',
            borderRadius: '26px',
            boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 0 8px 48px rgba(0,0,0,0.08)',
            border: '1px solid rgba(200,210,230,0.5)',
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
                <div key={`${project.title}-${i}`} className="project-card" style={{ animationDelay: `${i * 55}ms` }}>
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
