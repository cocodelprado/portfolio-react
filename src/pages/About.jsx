import React, { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Float, OrbitControls, ContactShadows, useGLTF, Html } from '@react-three/drei'
import BadgeTech from '../components/BadgeTech'

function MyBodyModel() {
  const urlCloudinary = 'https://res.cloudinary.com/drcx8ckvv/image/upload/v1774261941/commodore_amiga_500__computer_l6xl5j.glb'
  const { scene } = useGLTF(urlCloudinary)
  return <primitive object={scene} scale={1} position={[0, -1, 0]} rotation={[-12.2, 0, 0]} />
}

function Loader() {
  const [dots, setDots] = useState('')
  useEffect(() => {
    const iv = setInterval(() => setDots(p => p.length >= 3 ? '' : p + '.'), 400)
    return () => clearInterval(iv)
  }, [])
  return (
    <Html center>
      <div style={{ color: '#1d1d1f', fontFamily: 'sans-serif', fontSize: '20px', letterSpacing: '5px', width: '40px', textAlign: 'left', fontWeight: 'bold' }}>
        {dots}
      </div>
    </Html>
  )
}

const AP = "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif"

export default function About() {
  const skills = ['React.js', 'Three.js', 'JavaScript', 'Tailwind', 'Git', 'Vercel']

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: 'radial-gradient(circle at center, #ffffff 0%, #e5e5ea 100%)' }}>

      {/* Modèle 3D — droite */}
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
          <OrbitControls enablePan={false} enableZoom={true} minDistance={12} maxDistance={12} autoRotate={true} autoRotateSpeed={2} />
          <ContactShadows position={[0, -2.19, 0]} opacity={0.6} scale={15} blur={2} far={3} color="#000000" />
        </Canvas>
      </div>

      {/* Contenu — gauche */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        zIndex: 2, display: 'flex', alignItems: 'center',
        paddingLeft: '10%', pointerEvents: 'none',
      }}>
        <div style={{
          maxWidth: '550px', pointerEvents: 'auto',
          backgroundColor: 'rgba(255,255,255,0.72)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          padding: '40px', borderRadius: '24px',
          boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 0 8px 48px rgba(0,0,0,0.06)',
          border: '1px solid rgba(200,210,230,0.45)',
          fontFamily: AP,
        }}>
          <span style={{
            fontFamily: AP, fontSize: '0.72rem', fontWeight: '600',
            color: '#0071e3', letterSpacing: '1.8px', textTransform: 'uppercase',
            display: 'block', marginBottom: '10px',
          }}>Portfolio · Corentin Commino</span>

          <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: '0 0 20px 0', letterSpacing: '-0.04em', color: '#1d1d1f' }}>
            À propos de moi.
          </h1>

          <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#424245', marginBottom: '30px', fontFamily: AP }}>
            Salut, je suis <strong>Corentin Commino</strong>. Développeur Front-End passionné par la création d'interfaces modernes et d'expériences web immersives. J'adore mêler code et design pour donner vie à des projets interactifs (comme ce portfolio en 3D !).
          </p>

          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 14px 0', color: '#1d1d1f', fontFamily: AP }}>
            Compétences techniques
          </h2>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '36px' }}>
            {skills.map((skill, index) => (
              <BadgeTech key={index} name={skill} />
            ))}
          </div>

          <a
            href="/cv.pdf"
            download="CV_Corentin_Commino.pdf"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #0071e3, #0a84ff)',
              color: 'white', padding: '14px 28px', borderRadius: '30px',
              textDecoration: 'none', fontWeight: '600', fontSize: '1rem',
              fontFamily: AP, letterSpacing: '-0.01em',
              boxShadow: '0 4px 18px rgba(0,113,227,0.32)',
              transition: 'transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s ease',
            }}
            onMouseEnter={e => { e.target.style.transform = 'translateY(-3px) scale(1.03)'; e.target.style.boxShadow = '0 8px 26px rgba(0,113,227,0.42)' }}
            onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = '0 4px 18px rgba(0,113,227,0.32)' }}
          >
            Télécharger mon CV
          </a>
        </div>
      </div>
    </div>
  )
}
