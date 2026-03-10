import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Float, OrbitControls, ContactShadows, useGLTF, Html } from '@react-three/drei'

// 🕴️ Le composant pour ton corps entier
function MyBodyModel() {
  // Remplace 'Watch.glb' par le nom tout en minuscules
const { scene } = useGLTF('/me.glb') 


  return (
    <primitive 
      object={scene} 
      scale={1} 
      
      /* 1. LA HAUTEUR DU PERSONNAGE */
      /* Je l'ai remonté de -2.5 à -1. S'il est encore trop bas, mets 0. 
         S'il est trop haut, essaie -1.5 */
      position={[0, -1, 0]} 
      
      rotation={[0, 0, 0]} 
    />
  )
}

// ⏳ Écran de chargement
function Loader() {
  return (
    <Html center>
      <div style={{ color: '#1d1d1f', fontFamily: 'sans-serif', fontSize: '12px', letterSpacing: '4px' }}>
        CHARGEMENT...
      </div>
    </Html>
  )
}

export default function Home() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: '#f5f5f7' }}>
      
      {/* 1. LA TYPOGRAPHIE AU FOND (zIndex: 1) */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1, 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* J'ai légèrement remonté le bloc texte pour laisser de la place à ton corps */}
        <div style={{ textAlign: 'center', transform: 'translateY(-80px)' }}>
          <h1 style={{ 
            fontSize: '15vw', 
            fontWeight: 900, 
            margin: '0',
            letterSpacing: '-0.02em',
            color: '#e5e5ea', 
            lineHeight: 0.8,
            whiteSpace: 'nowrap'
          }}>
            PORTFOLIO
          </h1>
          <h2 style={{ 
            fontSize: '3rem', 
            fontWeight: 700, 
            margin: '20px 0 0 0',
            letterSpacing: '-0.04em',
            color: '#1d1d1f'
          }}>
            L'Ingénierie Web.
          </h2>
        </div>
      </div>

      {/* 2. LA SCÈNE 3D AU PREMIER PLAN (zIndex: 2) */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2, touchAction: 'none' }}>
        <Canvas style={{ touchAction: 'none' }} camera={{ position: [0, 0, 8], fov: 45 }}>
          
          <ambientLight intensity={1.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
          <Environment preset="studio" />

          <Float rotationIntensity={0.1} floatIntensity={0.3} speed={1}>
            <Suspense fallback={<Loader />}>
              <MyBodyModel />
            </Suspense>
          </Float>

          {/* 2. LA CAMÉRA AUTO-ROTATIVE */}
          <OrbitControls 
            enablePan={false} 
            enableZoom={true} 
            minDistance={3}   
            maxDistance={3}  
            target={[0, 0, 0]} 
            autoRotate={true} /* L'astuce magique ! */
            autoRotateSpeed={1.5} /* Ajuste la vitesse : 1 est lent, 5 est rapide */
          />

          {/* 3. L'OMBRE REMONTÉE (Doit être à la même hauteur que le personnage) */}
          <ContactShadows 
            position={[0, -1, 0]} /* Remontée à -1 pour matcher les pieds */
            opacity={0.6} 
            scale={15} 
            blur={2} 
            far={3} 
            color="#000000" 
          />
        </Canvas>
      </div>

    </div>
  )
}
