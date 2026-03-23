import React, { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Float, OrbitControls, ContactShadows, useGLTF, Html } from '@react-three/drei'

// 💡 1. Le composant BadgeTech demandé par ton évaluation
function BadgeTech({ name }) {
  return (
    <span style={{
      padding: '8px 16px',
      backgroundColor: '#1d1d1f',
      color: '#ffffff',
      borderRadius: '20px',
      fontSize: '0.85rem',
      fontWeight: '600',
      letterSpacing: '0.5px'
    }}>
      {name}
    </span>
  )
}

// 🕴️ Ton scan 3D via Cloudinary
function MyBodyModel() {
  const urlCloudinary = "https://res.cloudinary.com/drcx8ckvv/image/upload/v1773223317/GlbSimon_qknh10.glb"
  const { scene } = useGLTF(urlCloudinary)

  return (
    <primitive 
      object={scene} 
      scale={8} 
      position={[0, -2.19, 0]} 
      rotation={[0, 0, 0]} 
    />
  )
}

// ⏳ Écran de chargement animé
function Loader() {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return ''
        if (prev === '..') return '...'
        if (prev === '.') return '..'
        return '.'
      })
    }, 400)
    return () => clearInterval(interval)
  }, [])

  return (
    <Html center>
      <div style={{ color: '#1d1d1f', fontFamily: 'sans-serif', fontSize: '20px', letterSpacing: '5px', width: '40px', textAlign: 'left', fontWeight: 'bold' }}>
        {dots}
      </div>
    </Html>
  )
}

export default function About() {
  // Ta liste de compétences pour les badges
  const skills = ['React.js', 'Three.js', 'JavaScript', 'Tailwind', 'Git', 'Vercel']

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: 'radial-gradient(circle at center, #ffffff 0%, #e5e5ea 100%)' }}>
      
      {/* 1. SCÈNE 3D EN ARRIÈRE-PLAN (zIndex: 1) */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <ambientLight intensity={1.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
          <Environment preset="studio" />

          <Float rotationIntensity={0.1} floatIntensity={0.3} speed={1}>
            <Suspense fallback={<Loader />}>
              <MyBodyModel />
            </Suspense>
          </Float>

          <OrbitControls enablePan={false} enableZoom={true} minDistance={12} maxDistance={12} autoRotate={true} autoRotateSpeed={2} />

          {/* Ombre recalée exactement sous tes pieds (-2.19) */}
          <ContactShadows position={[0, -2.19, 0]} opacity={0.6} scale={15} blur={2} far={3} color="#000000" />
        </Canvas>
      </div>

      {/* 2. CONTENU "À PROPOS" AU PREMIER PLAN (zIndex: 2) */}
      <div style={{
        position: 'absolute',
        top: 0, 
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 2, 
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '10%', // Aligné à gauche pour laisser le modèle 3D respirer à droite
        pointerEvents: 'none' // Laisse les clics passer à travers pour pouvoir tourner le modèle 3D
      }}>
        
        {/* CARTE EN VERRE (Glassmorphism) */}
        <div style={{ 
          maxWidth: '550px', 
          pointerEvents: 'auto', // Réactive les clics spécifiquement pour la carte (pour le bouton CV)
          backgroundColor: 'rgba(255, 255, 255, 0.6)', 
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          padding: '40px',
          borderRadius: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
          fontFamily: 'sans-serif'
        }}>
          
          <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: '0 0 20px 0', letterSpacing: '-0.04em', color: '#1d1d1f' }}>
            À propos de moi.
          </h1>
          
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#424245', marginBottom: '30px' }}>
            Salut, je suis Simon Marc. Développeur Front-End passionné par la création d'interfaces modernes et d'expériences web immersives. J'adore mêler code et design pour donner vie à des projets interactifs (comme ce portfolio en 3D !).
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 15px 0', color: '#1d1d1f' }}>
            Mes compétences techniques
          </h2>
          
          {/* Affichage des BadgeTech */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '40px' }}>
            {skills.map((skill, index) => (
              <BadgeTech key={index} name={skill} />
            ))}
          </div>

          {/* 💡 2. Le bouton de téléchargement du CV */}
          <a 
            href="/cv.pdf" 
            download="CV_Simon_Marc.pdf"
            style={{
              display: 'inline-block',
              backgroundColor: '#0071e3', 
              color: 'white',
              padding: '14px 28px',
              borderRadius: '30px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1rem',
              boxShadow: '0 4px 14px rgba(0, 113, 227, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            📄 Télécharger mon CV
          </a>

        </div>
      </div>

    </div>
  )
}