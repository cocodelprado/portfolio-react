import React, { Suspense, useState, useEffect, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'

import ProjectCard from '../components/ProjectCard'
import SearchBar from '../components/SearchBar'
import localProjects from '../data/projects.json'

/* ─── Config ─── */
const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || 'cocodelprado'
const GITHUB_TOKEN    = import.meta.env.VITE_GITHUB_TOKEN    || ''

/* ─── Styles injectés ─── */
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
      @keyframes shimmer {
        0%   { background-position: -400px 0; }
        100% { background-position: 400px 0; }
      }
      @keyframes subSlide {
        from { opacity: 0; transform: translateY(-6px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      .glass-panel { animation: slideIn 0.6s cubic-bezier(0.22,1,0.36,1) both; }

      .project-card {
        background: rgba(255,255,255,0.82);
        padding: 18px; border-radius: 18px;
        border: 1px solid rgba(255,255,255,0.55);
        box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1),
                    box-shadow 0.28s ease,
                    background 0.2s ease,
                    border-color 0.2s;
        animation: fadeUp 0.4s ease both;
        cursor: default;
      }
      .project-card:hover {
        transform: translateY(-5px) scale(1.015);
        box-shadow: 0 14px 36px rgba(0,0,0,0.1);
        background: rgba(255,255,255,0.98);
        border-color: rgba(0,113,227,0.25);
      }

      .filter-btn {
        padding: 7px 16px; border-radius: 30px; border: none;
        font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
        font-size: 0.8rem; font-weight: 500; cursor: pointer;
        transition: all 0.22s cubic-bezier(0.34,1.56,0.64,1);
        outline: none; white-space: nowrap;
      }
      .filter-btn:hover { transform: scale(1.06); }

      .sub-btn {
        padding: 5px 13px; border-radius: 20px; border: none;
        font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
        font-size: 0.74rem; font-weight: 500; cursor: pointer;
        transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
        outline: none; white-space: nowrap;
        animation: subSlide 0.25s ease both;
      }
      .sub-btn:hover { transform: scale(1.05); }

      .cv-btn {
        display: inline-block;
        background: linear-gradient(135deg, #0071e3 0%, #0a84ff 100%);
        color: white; padding: 13px 28px; border-radius: 30px;
        text-decoration: none;
        font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
        font-weight: 600; font-size: 0.95rem; letter-spacing: -0.01em;
        box-shadow: 0 4px 18px rgba(0,113,227,0.32);
        transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s ease;
      }
      .cv-btn:hover {
        transform: translateY(-3px) scale(1.03);
        box-shadow: 0 8px 26px rgba(0,113,227,0.42);
      }

      .voir-lien {
        font-size: 0.82rem; color: #0071e3; text-decoration: none; font-weight: 600;
        font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
        display: inline-flex; align-items: center; gap: 4px; opacity: 0.88;
        transition: opacity 0.18s, gap 0.18s;
      }
      .voir-lien:hover { opacity: 1; gap: 7px; }

      .skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
        background-size: 400px 100%;
        animation: shimmer 1.4s infinite;
        border-radius: 10px;
      }

      .projects-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
      }
      @media (max-width: 1300px) {
        .projects-grid { grid-template-columns: repeat(2, 1fr); }
      }
      @media (max-width: 640px) {
        .projects-grid { grid-template-columns: 1fr; }
        .glass-panel-wrapper { padding-left: 0 !important; padding-right: 0 !important; }
        .glass-panel { max-width: 100% !important; border-radius: 0 !important; min-height: 100vh !important; }
        .canvas-wrapper { display: none !important; }
        .filters-row { flex-wrap: wrap !important; }
      }
      @media (max-width: 900px) {
        .projects-grid { grid-template-columns: repeat(2, 1fr); }
        .canvas-wrapper { width: 35% !important; }
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])
  return null
}

/* ══════════════════════════
   SCÈNE 3D : Globe réseau
══════════════════════════ */
function NetworkGlobe() {
  const groupRef = useRef()

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
    const conns = []
    for (let i = 0; i < pts.length; i++)
      for (let j = i + 1; j < pts.length; j++)
        if (pts[i].distanceTo(pts[j]) < 1.35) conns.push([i, j])
    return { positions: pts, connections: conns }
  }, [])

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
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color="#0071e3" transparent opacity={0.18} />
      </lineSegments>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.055, 8, 8]} />
          <meshStandardMaterial
            color={i % 7 === 0 ? '#0071e3' : i % 5 === 0 ? '#34aadc' : '#c8d8f0'}
            emissive={i % 7 === 0 ? '#0071e3' : '#aabfe0'}
            emissiveIntensity={i % 7 === 0 ? 0.8 : 0.2}
            roughness={0.3} metalness={0.4}
          />
        </mesh>
      ))}
      <mesh>
        <sphereGeometry args={[2.18, 48, 48]} />
        <meshStandardMaterial
          color="#e8f0ff" transparent opacity={0.06}
          roughness={0.1} metalness={0.2}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}

function Loader3D() {
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
      }}>
        {dots}
      </div>
    </Html>
  )
}

/* ─── Hook GitHub API ─── */
function useGitHubRepos() {
  const [repos, setRepos]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetchRepos = async () => {
    setLoading(true)
    setError(null)
    try {
      const headers = { Accept: 'application/vnd.github.v3+json' }
      if (GITHUB_TOKEN) headers['Authorization'] = `token ${GITHUB_TOKEN}`

      const res = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=30&sort=updated`,
        { headers }
      )
      if (!res.ok) throw new Error(`GitHub API erreur ${res.status}`)
      const data = await res.json()

      // ✅ On garde TOUS les repos publics non-forks — pas de filtre anti-doublon ici
      const mapped = data
        .filter(r => !r.fork)
        .map(r => ({
          id:          `gh-${r.id}`,
          title:       r.name,
          description: r.description || 'Pas de description disponible.',
          techs:       r.language ? [r.language] : [],
          type:        'Github',   // ← catégorie dédiée
          subType:     null,
          liveUrl:     r.homepage || r.html_url,
          githubUrl:   r.html_url,
          stars:       r.stargazers_count,
          updatedAt:   r.updated_at,
          source:      'github',
        }))

      setRepos(mapped)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRepos() }, [])
  return { repos, loading, error, retry: fetchRepos }
}

/* ─── Merge : JSON local + GitHub (séparés, pas de déduplication) ─── */
function mergeProjects(githubRepos, jsonProjects) {
  return [
    ...jsonProjects.map(p => ({ ...p, source: p.source || 'json' })),
    ...githubRepos,
  ]
}

/* ─── Skeleton ─── */
function SkeletonCard() {
  return (
    <div style={{
      padding: '18px', borderRadius: '18px',
      background: 'rgba(255,255,255,0.6)',
      border: '1px solid rgba(255,255,255,0.4)',
    }}>
      <div className="skeleton" style={{ height: '18px', width: '60%', marginBottom: '10px' }} />
      <div className="skeleton" style={{ height: '14px', width: '100%', marginBottom: '6px' }} />
      <div className="skeleton" style={{ height: '14px', width: '80%', marginBottom: '14px' }} />
      <div style={{ display: 'flex', gap: '6px' }}>
        <div className="skeleton" style={{ height: '22px', width: '55px', borderRadius: '20px' }} />
        <div className="skeleton" style={{ height: '22px', width: '70px', borderRadius: '20px' }} />
      </div>
    </div>
  )
}

const AP = "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif"

const CATEGORIES = [
  { label: 'Tous',    value: 'Tous',   sub: null },
  { label: 'École',   value: 'Ecole',  sub: ['BTS', 'L3'] },
  { label: 'Perso',   value: 'Perso',  sub: null },
  { label: '⭐ GitHub', value: 'Github', sub: null },
]

const SORTS = [
  { value: 'recent', label: 'Plus récents' },
  { value: 'alpha',  label: 'A → Z' },
]

/* ════════════════════════════
   PAGE PROJECTS PRINCIPALE
════════════════════════════ */
export default function Projects() {
  const { repos, loading, error, retry } = useGitHubRepos()

  const [search, setSearch]     = useState('')
  const [category, setCategory] = useState('Tous')
  const [subCat, setSubCat]     = useState(null)
  const [sort, setSort]         = useState('recent')
  const [animKey, setAnimKey]   = useState(0)

  const allProjects = useMemo(
    () => mergeProjects(repos, localProjects),
    [repos]
  )

  const activeCat = CATEGORIES.find(c => c.value === category)

  const displayed = useMemo(() => {
    let list = allProjects

    if (category !== 'Tous') {
      if (category === 'Ecole' && subCat) {
        list = list.filter(p => p.subType === subCat)
      } else if (category === 'Ecole') {
        list = list.filter(p => p.type === 'Ecole')
      } else {
        list = list.filter(p => p.type === category)
      }
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.techs || []).some(t => t.toLowerCase().includes(q))
      )
    }

    if (sort === 'recent') {
      list = [...list].sort((a, b) => {
        if (!a.updatedAt && !b.updatedAt) return 0
        if (!a.updatedAt) return 1
        if (!b.updatedAt) return -1
        return new Date(b.updatedAt) - new Date(a.updatedAt)
      })
    } else {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title, 'fr'))
    }

    return list
  }, [allProjects, search, category, subCat, sort])

  const handleCategory = (cat) => { setCategory(cat); setSubCat(null); setAnimKey(k => k + 1) }
  const handleSubCat   = (sub) => { setSubCat(prev => prev === sub ? null : sub); setAnimKey(k => k + 1) }

  // Compteur GitHub pour le badge
  const githubCount = repos.length

  return (
    <>
      <GlobalStyles />
      <div style={{
        width: '100vw', height: '100vh',
        position: 'relative', overflow: 'hidden',
        background: '#ffffff',
      }}>

        {/* ── Globe 3D ── */}
        <div className="canvas-wrapper" style={{
          position: 'absolute', top: 0, right: 0,
          width: '48%', height: '100%', zIndex: 1,
        }}>
          <Canvas camera={{ position: [0, 0, 7], fov: 42 }} gl={{ antialias: true, alpha: false }}>
            <color attach="background" args={['#ffffff']} />
            <ambientLight intensity={0.9} />
            <pointLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
            <pointLight position={[-4, -2, 4]} intensity={0.4} color="#d0e4ff" />
            <Environment preset="studio" />
            <Suspense fallback={<Loader3D />}>
              <Float floatIntensity={0.25} rotationIntensity={0.04} speed={1.0}>
                <NetworkGlobe />
              </Float>
            </Suspense>
            <OrbitControls enablePan={false} enableZoom={false} autoRotate={false} />
          </Canvas>
        </div>

        {/* ── Panneau principal ── */}
        <div
          className="glass-panel-wrapper"
          style={{
            position: 'absolute', top: 0, left: 0,
            width: '100%', height: '100%', zIndex: 2,
            display: 'flex', alignItems: 'center',
            paddingLeft: '4%', paddingTop: '60px', paddingBottom: '32px',
            pointerEvents: 'none',
          }}
        >
          <div className="glass-panel" style={{
            maxWidth: '720px', width: '100%',
            maxHeight: 'calc(100vh - 92px)',
            pointerEvents: 'auto',
            backgroundColor: 'rgba(255,255,255,0.78)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            padding: '32px 32px 28px',
            borderRadius: '26px',
            boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 0 8px 48px rgba(0,0,0,0.08)',
            border: '1px solid rgba(200,210,230,0.5)',
            display: 'flex', flexDirection: 'column',
          }}>

            {/* En-tête */}
            <div style={{ marginBottom: '16px', flexShrink: 0 }}>
              <span style={{
                fontFamily: AP, fontSize: '0.72rem', fontWeight: '600',
                color: '#0071e3', letterSpacing: '1.8px', textTransform: 'uppercase',
                display: 'block', marginBottom: '6px',
              }}>
                Portfolio · Corentin Commino
              </span>
              <h1 style={{
                fontFamily: AP, fontSize: '2.6rem', fontWeight: 800,
                letterSpacing: '-0.04em', color: '#1d1d1f',
                lineHeight: 1.05, marginBottom: '8px',
              }}>
                Mes Projets.
              </h1>
              <p style={{ fontFamily: AP, fontSize: '0.95rem', lineHeight: '1.6', color: '#6e6e73' }}>
                Réalisations web (GitHub) et missions en infrastructure & réseau.
              </p>
            </div>

            {/* Barre de recherche */}
            <div style={{ marginBottom: '12px', flexShrink: 0 }}>
              <SearchBar value={search} onChange={setSearch} />
            </div>

            {/* Filtres principaux */}
            <div
              className="filters-row"
              style={{
                display: 'flex', alignItems: 'center',
                gap: '8px', marginBottom: activeCat?.sub ? '8px' : '14px',
                flexShrink: 0, flexWrap: 'wrap',
              }}
            >
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  className="filter-btn"
                  onClick={() => handleCategory(cat.value)}
                  style={{
                    backgroundColor: category === cat.value ? '#1d1d1f' : 'rgba(255,255,255,0.65)',
                    color: category === cat.value ? '#fff' : '#424245',
                    boxShadow: category === cat.value
                      ? '0 2px 10px rgba(0,0,0,0.18)'
                      : '0 1px 4px rgba(0,0,0,0.06)',
                    outline: cat.value === 'Ecole' && subCat ? '2px solid #0071e3' : 'none',
                    position: 'relative',
                  }}
                >
                  {cat.label}
                  {cat.sub && <span style={{ marginLeft: '4px', fontSize: '0.65rem', opacity: 0.7 }}>▾</span>}
                  {/* Badge compteur GitHub */}
                  {cat.value === 'Github' && githubCount > 0 && !loading && (
                    <span style={{
                      position: 'absolute',
                      top: '-6px', right: '-6px',
                      background: '#0071e3',
                      color: '#fff',
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      borderRadius: '20px',
                      padding: '1px 5px',
                      lineHeight: '1.4',
                    }}>
                      {githubCount}
                    </span>
                  )}
                </button>
              ))}

              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  style={{
                    padding: '6px 10px', borderRadius: '10px',
                    border: '1.5px solid rgba(0,0,0,0.1)',
                    background: 'rgba(255,255,255,0.85)',
                    fontFamily: AP, fontSize: '0.78rem',
                    color: '#1d1d1f', outline: 'none', cursor: 'pointer',
                  }}
                >
                  {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                <span style={{
                  fontFamily: AP, fontSize: '0.75rem',
                  color: '#aeaeb2', fontWeight: '500', whiteSpace: 'nowrap',
                }}>
                  {displayed.length} projet{displayed.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Sous-catégories École */}
            {activeCat?.sub && (
              <div style={{
                display: 'flex', gap: '6px',
                marginBottom: '14px', flexShrink: 0, paddingLeft: '4px',
              }}>
                <div style={{
                  width: '2px', borderRadius: '2px',
                  background: 'linear-gradient(to bottom, #0071e3, #34aadc)',
                  marginRight: '4px', flexShrink: 0,
                }} />
                {activeCat.sub.map((sub, i) => (
                  <button
                    key={sub}
                    className="sub-btn"
                    onClick={() => handleSubCat(sub)}
                    style={{
                      animationDelay: `${i * 60}ms`,
                      backgroundColor: subCat === sub ? '#0071e3' : 'rgba(0,113,227,0.08)',
                      color: subCat === sub ? '#fff' : '#0071e3',
                      boxShadow: subCat === sub ? '0 2px 10px rgba(0,113,227,0.3)' : 'none',
                    }}
                  >
                    {sub}
                  </button>
                ))}
                {subCat && (
                  <button
                    className="sub-btn"
                    onClick={() => { setSubCat(null); setAnimKey(k => k + 1) }}
                    style={{ backgroundColor: 'transparent', color: '#aeaeb2', fontSize: '0.7rem' }}
                  >
                    ✕ Tout l'École
                  </button>
                )}
              </div>
            )}

            {/* Bannière GitHub chargement */}
            {category === 'Github' && loading && (
              <div style={{
                padding: '10px 14px', borderRadius: '12px',
                background: 'rgba(0,113,227,0.06)',
                border: '1px solid rgba(0,113,227,0.15)',
                marginBottom: '12px', flexShrink: 0,
                fontFamily: AP, fontSize: '0.82rem', color: '#0071e3',
              }}>
                ⏳ Chargement de tes repos GitHub...
              </div>
            )}

            {/* Zone scrollable */}
            <div
              className="projects-scroll"
              style={{ overflowY: 'auto', flex: 1, paddingRight: '4px', paddingBottom: '4px' }}
            >
              {loading && category !== 'Github' && (
                <div className="projects-grid" key="loading">
                  {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              )}

              {loading && category === 'Github' && (
                <div className="projects-grid" key="loading-gh">
                  {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              )}

              {!loading && error && (
                <div style={{
                  padding: '20px', borderRadius: '16px',
                  background: '#fff0ef', border: '1px solid #f5b8b3',
                  marginBottom: '16px', fontFamily: AP,
                }}>
                  <p style={{ fontSize: '0.88rem', color: '#c0392b', marginBottom: '10px' }}>
                    ⚠️ Impossible de charger les repos GitHub : {error}
                  </p>
                  <button onClick={retry} style={{
                    padding: '7px 16px', borderRadius: '20px', border: 'none',
                    background: '#c0392b', color: '#fff',
                    fontFamily: AP, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                  }}>
                    🔄 Réessayer
                  </button>
                </div>
              )}

              {!loading && (
                displayed.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', fontFamily: AP }}>
                    <p style={{ fontSize: '2rem', marginBottom: '8px' }}>
                      {category === 'Github' ? '🐙' : '🔍'}
                    </p>
                    <p style={{ fontSize: '0.95rem', color: '#6e6e73', marginBottom: '8px' }}>
                      {category === 'Github'
                        ? 'Aucun repo public trouvé sur GitHub.'
                        : 'Aucun projet ne correspond à votre recherche.'
                      }
                    </p>
                    {category === 'Github' && (
                      <button onClick={retry} style={{
                        marginTop: '8px', padding: '8px 18px',
                        borderRadius: '20px', border: 'none',
                        background: '#0071e3', color: '#fff',
                        fontFamily: AP, fontSize: '0.82rem', cursor: 'pointer',
                      }}>
                        🔄 Recharger
                      </button>
                    )}
                    {category !== 'Github' && (
                      <button
                        onClick={() => { setSearch(''); setCategory('Tous'); setSubCat(null) }}
                        style={{
                          marginTop: '14px', padding: '8px 18px',
                          borderRadius: '20px', border: 'none',
                          background: '#1d1d1f', color: '#fff',
                          fontFamily: AP, fontSize: '0.82rem', cursor: 'pointer',
                        }}
                      >
                        Réinitialiser les filtres
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="projects-grid" key={`${animKey}-${category}-${subCat}-${sort}`}>
                    {displayed.map((project, i) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        style={{ animationDelay: `${i * 45}ms` }}
                      />
                    ))}
                  </div>
                )
              )}
            </div>

            {/* Bouton CV */}
            <div style={{ paddingTop: '20px', flexShrink: 0 }}>
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