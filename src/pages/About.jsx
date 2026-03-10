import React from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars, MeshTransmissionMaterial, Float } from '@react-three/drei'

export default function About() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#00050a', position: 'relative' }}>
      <div className="hud-overlay">
        <div className="hud-corner top-left">SYSTEM: STABLE <br/> ENGINE: IDLE</div>
        <div className="hud-corner bottom-right">LOC: SECTOR_BIO <br/> STATUS: SCANNING...</div>
      </div>

      <Canvas camera={{ position: [0, 0, 8] }}>
        {/* Étoiles très lentes et calmes */}
        <Stars radius={100} depth={50} count={2000} factor={2} saturation={0} fade speed={0.2} />
        
        {/* La "Nébuleuse" de ton CV : une forme translucide Apple style */}
        <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh>
            <torusGeometry args={[2, 0.6, 16, 100]} />
            <MeshTransmissionMaterial transmission={1} roughness={0.1} thickness={1} chromaticAberration={0.1} color="#00f2ff" />
          </mesh>
        </Float>
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#00f2ff" />
      </Canvas>

      <div style={{ position: 'absolute', top: '20%', right: '10%', color: '#fff', textAlign: 'right', maxWidth: '400px' }}>
        <h2 style={{ fontSize: '3rem', color: '#00f2ff' }}>L'Exploration.</h2>
        <p style={{ fontSize: '1.2rem', lineHeight: '1.6', color: '#86868b' }}>
          Passionné par la mécanique des moteurs et la précision du code, je navigue entre deux mondes.
        </p>
      </div>
    </div>
  )
}
