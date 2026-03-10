import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Float, OrbitControls, ContactShadows, useGLTF, Html } from '@react-three/drei'

// 🕴️ Le composant qui charge TON scan 3D via Cloudinary
function MyBodyModel() {
  const urlCloudinary = "https://res.cloudinary.com/drcx8ckvv/image/upload/v1773162374/Watch12_gdnkux.glb"
  const { scene } = useGLTF(urlCloudinary)

  return (
    <primitive 
      object={scene} 
      scale={3.25} 
      position={[0, -4.75, 0]} 
      rotation={[0, 0, 0]} 
    />
  )
}

function Loader() {
  return (
    <Html center>
      <div style={{ color: '#1d1d1f', fontFamily: 'sans-serif', fontSize: '10px', letterSpacing: '5px' }}>
        J'arrive
      </div>
    </Html>
  )
}

export default function Home() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: '#f5f5f7' }}>
      
      {/* 1. TYPOGRAPHIE EN ARRIÈRE-PLAN */}
      <div style={{
        position: 'absolute',
        top: 0, // Ajuste ce chiffre pour monter/descendre l'ensemble des textes
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1, 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none'
      }}>
        <div style={{ textAlign: 'center' }}>
          {/* NOM EN PREMIER */}
          <h2 style={{ 
            fontSize: '3rem', 
            fontWeight: 700, 
            margin: '0',
            letterSpacing: '-0.04em',
            color: '#1d1d1f'
          }}>
            Corentin Commino.
          </h2>

          {/* PORTFOLIO EN DESSOUS */}
          <h1 style={{ 
            fontSize: '15vw', 
            fontWeight: 900, 
            margin: '40px 0 0 0', // Marge négative pour coller les textes si besoin
            letterSpacing: '-0.02em',
            color: '#e5e5ea', 
            lineHeight: 0.8,
            whiteSpace: 'nowrap'
          }}>
            PORTFOLIO
          </h1>
        </div>
      </div>

      {/* 2. SCÈNE 3D AU PREMIER PLAN */}
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

          <OrbitControls 
            enablePan={false} 
            enableZoom={true} 
            minDistance={12}   
            maxDistance={12}  
            target={[0, 0, 0]} 
            autoRotate={true}
            autoRotateSpeed={6}
          />

          {/* Ombre recalée à -4.75 pour toucher tes pieds */}
          <ContactShadows 
            position={[0, -4.75, 0]} 
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
