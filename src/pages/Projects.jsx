import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, MeshTransmissionMaterial, Float } from '@react-three/drei'

function GlassStructure() {
  const meshRef = useRef()

  // Rotation lente et élégante
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.y = t * 0.1
    meshRef.current.rotation.x = t * 0.05
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        {/* Géométrie pure : un cube parfait */}
        <boxGeometry args={[2, 2, 2]} />
        
        {/* Matériau de transmission (effet verre dépoli d'Apple) */}
        <MeshTransmissionMaterial 
          transmission={1} 
          roughness={0.05} 
          thickness={1} 
          chromaticAberration={0.05}
          anisotropy={0.1}
          distortion={0}
          samples={8}
          backside={true}
        />
      </mesh>
    </Float>
  )
}

export default function Home() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#ffffff', position: 'relative' }}>
      <Canvas>
        {/* Orthographe corrigée : PerspectiveCamera */}
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />
        
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <pointLight position={[-10, -10, -10]} color="#0066cc" intensity={1} />
        
        <GlassStructure />
        
        <OrbitControls enableZoom={false} autoRotate={false} />
      </Canvas>

      {/* Interface minimaliste superposée */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        pointerEvents: 'none',
        width: '100%'
      }}>
        <h1 style={{ 
          fontSize: '4rem', 
          fontWeight: 700, 
          color: '#1d1d1f', 
          letterSpacing: '-0.03em',
          margin: 0 
        }}>
          L'essence.
        </h1>
        <p style={{ color: '#86868b', fontSize: '1.2rem', marginTop: '10px' }}>
          Design translucide et technologie.
        </p>
      </div>
    </div>
  )
}
