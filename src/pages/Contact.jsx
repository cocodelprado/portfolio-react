import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, Html } from '@react-three/drei'
import { QRCodeSVG } from 'qrcode.react'
import * as THREE from 'three'

/* ─── Styles globaux ─── */
const GlobalStyles = () => {
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      * { box-sizing: border-box; margin: 0; padding: 0; }

      @keyframes slideIn {
        from { opacity: 0; transform: translateX(-24px); }
        to   { opacity: 1; transform: translateX(0); }
      }
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes toastIn {
        from { opacity: 0; transform: translateY(16px) scale(0.96); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
      }

      .glass-panel  { animation: slideIn 0.6s cubic-bezier(0.22,1,0.36,1) both; }
      .form-section { animation: fadeUp 0.5s ease both; }

      /* Champs */
      .c-input, .c-select, .c-textarea {
        width: 100%;
        padding: 11px 14px;
        border-radius: 12px;
        border: 1.5px solid rgba(0,0,0,0.1);
        background: rgba(255,255,255,0.85);
        font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
        font-size: 0.9rem;
        color: #1d1d1f;
        outline: none;
        transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s;
        -webkit-appearance: none;
        appearance: none;
      }
      .c-input:focus, .c-select:focus, .c-textarea:focus {
        border-color: #0071e3;
        box-shadow: 0 0 0 3px rgba(0,113,227,0.12);
        background: #fff;
      }
      .c-input.error, .c-select.error, .c-textarea.error {
        border-color: #ff3b30;
        box-shadow: 0 0 0 3px rgba(255,59,48,0.1);
      }
      .c-textarea { resize: vertical; min-height: 110px; line-height: 1.5; }
      .c-select { cursor: pointer; }

      .field-error {
        font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
        font-size: 0.75rem;
        color: #ff3b30;
        margin-top: 4px;
        display: block;
        animation: fadeUp 0.2s ease;
      }

      /* Bouton submit */
      .submit-btn {
        width: 100%;
        padding: 13px 24px;
        border-radius: 30px;
        border: none;
        background: linear-gradient(135deg, #0071e3, #0a84ff);
        color: #fff;
        font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
        font-size: 0.95rem;
        font-weight: 600;
        letter-spacing: -0.01em;
        cursor: pointer;
        box-shadow: 0 4px 18px rgba(0,113,227,0.32);
        transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease, opacity 0.2s;
      }
      .submit-btn:hover:not(:disabled) {
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 8px 24px rgba(0,113,227,0.4);
      }
      .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

      /* Toast */
      .toast {
        padding: 12px 16px;
        border-radius: 14px;
        font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
        font-size: 0.88rem;
        font-weight: 500;
        animation: toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1);
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .toast.success { background: #e8faf0; color: #1a7f4b; border: 1px solid #a8e6c3; }
      .toast.error   { background: #fff0ef; color: #c0392b; border: 1px solid #f5b8b3; }

      /* QR section */
      .qr-card {
        background: rgba(255,255,255,0.75);
        border-radius: 18px;
        border: 1px solid rgba(200,210,230,0.45);
        padding: 18px;
        display: flex;
        align-items: center;
        gap: 16px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        flex-shrink: 0;
      }

      .vcf-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 14px;
        border-radius: 20px;
        border: 1.5px solid rgba(0,113,227,0.3);
        background: transparent;
        color: #0071e3;
        font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
        font-size: 0.78rem;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
        transition: background 0.2s, border-color 0.2s, transform 0.2s;
      }
      .vcf-btn:hover {
        background: rgba(0,113,227,0.07);
        border-color: #0071e3;
        transform: scale(1.03);
      }

      .contact-scroll::-webkit-scrollbar { width: 3px; }
      .contact-scroll::-webkit-scrollbar-track { background: transparent; }
      .contact-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 4px; }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])
  return null
}

/* ══════════════════════════════
   SCÈNE 3D — Enveloppes orbitales
   (thème communication / contact)
══════════════════════════════ */

/* Enveloppe stylisée en primitives */
function Envelope({ position, rotation, scale = 1, color = '#0071e3' }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y += 0.004
    ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.4 + position[0]) * 0.08
  })
  return (
    <group ref={ref} position={position} rotation={rotation} scale={scale}>
      {/* Corps */}
      <mesh castShadow>
        <boxGeometry args={[1.4, 0.9, 0.06]} />
        <meshStandardMaterial color="#f5f7ff" metalness={0.1} roughness={0.5} />
      </mesh>
      {/* Rabat haut (triangle) */}
      <mesh position={[0, 0.28, 0.04]}>
        <coneGeometry args={[0.72, 0.55, 4, 1]} />
        <meshStandardMaterial color={color} metalness={0.2} roughness={0.4} transparent opacity={0.9} />
      </mesh>
      {/* Ligne diagonale gauche */}
      <mesh position={[-0.36, -0.1, 0.04]} rotation={[0, 0, -0.62]}>
        <boxGeometry args={[0.85, 0.022, 0.01]} />
        <meshStandardMaterial color={color} transparent opacity={0.5} />
      </mesh>
      {/* Ligne diagonale droite */}
      <mesh position={[0.36, -0.1, 0.04]} rotation={[0, 0, 0.62]}>
        <boxGeometry args={[0.85, 0.022, 0.01]} />
        <meshStandardMaterial color={color} transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

/* Particule orbitale */
function OrbitalDot({ radius, speed, offset, color, size = 0.06 }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime() * speed + offset
    ref.current.position.x = Math.cos(t) * radius
    ref.current.position.y = Math.sin(t * 0.5) * 0.6
    ref.current.position.z = Math.sin(t) * radius
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 10, 10]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.6} toneMapped={false} />
    </mesh>
  )
}

/* Anneau orbital */
function Ring({ radius, rotation }) {
  return (
    <mesh rotation={rotation}>
      <torusGeometry args={[radius, 0.007, 8, 90]} />
      <meshStandardMaterial color="#0071e3" transparent opacity={0.15} />
    </mesh>
  )
}

function ContactScene() {
  return (
    <Float floatIntensity={0.3} rotationIntensity={0.05} speed={1.1}>
      <group>
        {/* Enveloppe centrale */}
        <Envelope position={[0, 0.1, 0]} rotation={[0.1, 0.3, 0.05]} scale={1.3} color="#0071e3" />

        {/* Petites enveloppes orbitantes */}
        <group>
          <OrbitingEnvelope radius={2.4} speed={0.28} offset={0}           color="#34aadc" s={0.55} />
          <OrbitingEnvelope radius={2.8} speed={0.18} offset={Math.PI}     color="#0071e3" s={0.45} />
          <OrbitingEnvelope radius={2.2} speed={0.38} offset={Math.PI / 2} color="#5ac8fa" s={0.4}  />
        </group>

        {/* Anneaux */}
        <Ring radius={2.0} rotation={[Math.PI / 2, 0, 0]} />
        <Ring radius={2.7} rotation={[Math.PI / 3, 0.5, 0]} />

        {/* Particules */}
        <OrbitalDot radius={2.0} speed={0.55} offset={1.2}        color="#0071e3" />
        <OrbitalDot radius={2.0} speed={0.55} offset={1.2 + Math.PI} color="#34aadc" />
        <OrbitalDot radius={2.7} speed={0.35} offset={2.5}        color="#00c896" size={0.05} />
        <OrbitalDot radius={2.7} speed={0.35} offset={5.5}        color="#5ac8fa" size={0.04} />
      </group>
    </Float>
  )
}

/* Enveloppe en orbite autour du centre */
function OrbitingEnvelope({ radius, speed, offset, color, s }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime() * speed + offset
    ref.current.position.x = Math.cos(t) * radius
    ref.current.position.y = Math.sin(t * 0.4) * 0.5
    ref.current.position.z = Math.sin(t) * radius
    ref.current.rotation.y += 0.006
  })
  return (
    <group ref={ref}>
      <Envelope position={[0, 0, 0]} rotation={[0, 0, 0]} scale={s} color={color} />
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
      <div style={{ color: '#1d1d1f', fontFamily: 'monospace', fontSize: '18px', letterSpacing: '5px', fontWeight: 'bold' }}>
        {dots}
      </div>
    </Html>
  )
}

/* ══════════════════════════════
   FORMULAIRE — Validation custom
══════════════════════════════ */
const FORMSPREE_URL = import.meta.env.VITE_FORMSPREE_URL || 'https://formspree.io/f/YOUR_ID'

function useContactForm() {
  const [values, setValues]   = useState({ prenom: '', nom: '', email: '', sujet: '', message: '' })
  const [errors, setErrors]   = useState({})
  const [status, setStatus]   = useState('idle') // idle | loading | success | error

  const validate = (vals) => {
    const e = {}
    if (!vals.prenom.trim())                    e.prenom  = 'Le prénom est requis.'
    if (!vals.nom.trim())                       e.nom     = 'Le nom est requis.'
    if (!vals.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Adresse e-mail invalide.'
    if (!vals.sujet)                            e.sujet   = 'Veuillez choisir un sujet.'
    if (vals.message.trim().length < 20)        e.message = 'Le message doit contenir au moins 20 caractères.'
    return e
  }

  const handleChange = (field) => (e) => {
    const v = { ...values, [field]: e.target.value }
    setValues(v)
    if (errors[field]) {
      const newErrs = { ...errors }
      delete newErrs[field]
      setErrors(newErrs)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate(values)
    if (Object.keys(errs).length) { setErrors(errs); return }

    setStatus('loading')
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...values, name: `${values.prenom} ${values.nom}` }),
      })
      if (res.ok) {
        setStatus('success')
        setValues({ prenom: '', nom: '', email: '', sujet: '', message: '' })
        setErrors({})
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return { values, errors, status, setStatus, handleChange, handleSubmit }
}

/* ═══════════════════════
   PAGE CONTACT PRINCIPALE
═══════════════════════ */
export default function Contact() {
  const { values, errors, status, setStatus, handleChange, handleSubmit } = useContactForm()
  const vcardUrl = `${window.location.origin}/contact.vcf`

  const AP = "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif"

  return (
    <>
      <GlobalStyles />
      <div style={{
        width: '100vw', height: '100vh', position: 'relative',
        overflow: 'hidden', background: '#ffffff',
      }}>

        {/* ── Scène 3D fond blanc unifié ── */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: '100%', height: '100%', zIndex: 1 }}>
          <Canvas camera={{ position: [0, 0, 7], fov: 42 }} gl={{ antialias: true, alpha: false }}>
            <color attach="background" args={['#ffffff']} />
            <ambientLight intensity={0.9} />
            <pointLight position={[5, 5, 5]}  intensity={0.7} color="#ffffff" />
            <pointLight position={[-4, -2, 4]} intensity={0.4} color="#d0e4ff" />
            <Environment preset="studio" />
            <React.Suspense fallback={<Loader />}>
              <ContactScene />
            </React.Suspense>
          </Canvas>
        </div>

        {/* ── Panneau Contact ── */}
        <div style={{
          position: 'absolute', top: 0, left: 0,
          width: '100%', height: '100%', zIndex: 2,
          display: 'flex', alignItems: 'center',
          paddingLeft: '5%', paddingTop: '48px', paddingBottom: '48px',
          pointerEvents: 'none',
        }}>
          <div className="glass-panel" style={{
            maxWidth: '620px', width: '100%',
            maxHeight: 'calc(100vh - 150px)',
            pointerEvents: 'auto',
            backgroundColor: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            padding: '36px 36px 32px',
            borderRadius: '26px',
            boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 0 8px 48px rgba(0,0,0,0.08)',
            border: '1px solid rgba(200,210,230,0.5)',
            display: 'flex', flexDirection: 'column', gap: 0,
          }}>

            {/* En-tête */}
            <div style={{ marginBottom: '22px', flexShrink: 0 }}>
              <span style={{
                fontFamily: AP, fontSize: '0.72rem', fontWeight: '600',
                color: '#0071e3', letterSpacing: '1.8px', textTransform: 'uppercase',
                display: 'block', marginBottom: '8px',
              }}>Portfolio · Corentin Commino</span>
              <h1 style={{
                fontFamily: AP, fontSize: '2.8rem', fontWeight: 800,
                letterSpacing: '-0.04em', color: '#1d1d1f', lineHeight: 1.05, marginBottom: '10px',
              }}>Me Contacter.</h1>
              <p style={{ fontFamily: AP, fontSize: '0.96rem', lineHeight: '1.6', color: '#6e6e73' }}>
                Une opportunité, une question ou une collaboration ? Écrivez-moi.
              </p>
            </div>

            {/* Zone scrollable */}
            <div className="contact-scroll" style={{ overflowY: 'auto', flex: 1, paddingRight: '4px' }}>

              {/* Toast succès / erreur */}
              {status === 'success' && (
                <div className="toast success" style={{ marginBottom: '18px' }}>
                  <span>✅</span>
                  <span>Message envoyé ! Je vous réponds dès que possible.</span>
                </div>
              )}
              {status === 'error' && (
                <div className="toast error" style={{ marginBottom: '18px' }}>
                  <span>⚠️</span>
                  <span>Erreur réseau. Veuillez réessayer.</span>
                  <button onClick={() => setStatus('idle')} style={{
                    marginLeft: 'auto', background: 'none', border: 'none',
                    color: '#c0392b', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem',
                    fontFamily: AP,
                  }}>Réessayer</button>
                </div>
              )}

              {/* Formulaire */}
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-section" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                  {/* Ligne Prénom / Nom */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontFamily: AP, fontSize: '0.78rem', fontWeight: '600', color: '#1d1d1f', display: 'block', marginBottom: '6px' }}>
                        Prénom
                      </label>
                      <input
                        className={`c-input${errors.prenom ? ' error' : ''}`}
                        type="text"
                        placeholder="Corentin"
                        value={values.prenom}
                        onChange={handleChange('prenom')}
                        autoComplete="given-name"
                      />
                      {errors.prenom && <span className="field-error">{errors.prenom}</span>}
                    </div>
                    <div>
                      <label style={{ fontFamily: AP, fontSize: '0.78rem', fontWeight: '600', color: '#1d1d1f', display: 'block', marginBottom: '6px' }}>
                        Nom
                      </label>
                      <input
                        className={`c-input${errors.nom ? ' error' : ''}`}
                        type="text"
                        placeholder="Commino"
                        value={values.nom}
                        onChange={handleChange('nom')}
                        autoComplete="family-name"
                      />
                      {errors.nom && <span className="field-error">{errors.nom}</span>}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label style={{ fontFamily: AP, fontSize: '0.78rem', fontWeight: '600', color: '#1d1d1f', display: 'block', marginBottom: '6px' }}>
                      Adresse e-mail
                    </label>
                    <input
                      className={`c-input${errors.email ? ' error' : ''}`}
                      type="email"
                      placeholder="vous@exemple.com"
                      value={values.email}
                      onChange={handleChange('email')}
                      autoComplete="email"
                    />
                    {errors.email && <span className="field-error">{errors.email}</span>}
                  </div>

                  {/* Sujet */}
                  <div>
                    <label style={{ fontFamily: AP, fontSize: '0.78rem', fontWeight: '600', color: '#1d1d1f', display: 'block', marginBottom: '6px' }}>
                      Sujet
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        className={`c-select${errors.sujet ? ' error' : ''}`}
                        value={values.sujet}
                        onChange={handleChange('sujet')}
                      >
                        <option value="">Choisir un sujet…</option>
                        <option value="Opportunité">💼 Opportunité professionnelle</option>
                        <option value="Question">❓ Question</option>
                        <option value="Collaboration">🤝 Collaboration</option>
                        <option value="Autre">💬 Autre</option>
                      </select>
                      <span style={{
                        position: 'absolute', right: '14px', top: '50%',
                        transform: 'translateY(-50%)', pointerEvents: 'none',
                        color: '#aeaeb2', fontSize: '0.8rem',
                      }}>▾</span>
                    </div>
                    {errors.sujet && <span className="field-error">{errors.sujet}</span>}
                  </div>

                  {/* Message */}
                  <div>
                    <label style={{ fontFamily: AP, fontSize: '0.78rem', fontWeight: '600', color: '#1d1d1f', display: 'block', marginBottom: '6px' }}>
                      Message
                      <span style={{ color: '#aeaeb2', fontWeight: 400, marginLeft: '6px' }}>
                        ({values.message.length}/20 min)
                      </span>
                    </label>
                    <textarea
                      className={`c-textarea${errors.message ? ' error' : ''}`}
                      placeholder="Décrivez votre demande…"
                      value={values.message}
                      onChange={handleChange('message')}
                    />
                    {errors.message && <span className="field-error">{errors.message}</span>}
                  </div>

                  {/* Bouton submit */}
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? '⏳ Envoi en cours…' : '✉️ Envoyer le message'}
                  </button>

                </div>
              </form>

              {/* Séparateur */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                margin: '22px 0 18px',
              }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.07)' }} />
                <span style={{ fontFamily: AP, fontSize: '0.75rem', color: '#aeaeb2', fontWeight: '500' }}>
                  ou directement
                </span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.07)' }} />
              </div>

              {/* QR Code vCard */}
              <div className="qr-card">
                <div style={{ flexShrink: 0, borderRadius: '10px', overflow: 'hidden', padding: '6px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <QRCodeSVG
                    value={vcardUrl}
                    size={88}
                    fgColor="#1d1d1f"
                    bgColor="#ffffff"
                    level="H"
                    includeMargin={false}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: AP, fontSize: '0.88rem', fontWeight: 700, color: '#1d1d1f', marginBottom: '4px' }}>
                    Enregistrer mon contact
                  </p>
                  <p style={{ fontFamily: AP, fontSize: '0.78rem', color: '#6e6e73', lineHeight: 1.5, marginBottom: '10px' }}>
                    Scannez pour ajouter ma fiche contact directement dans votre téléphone.
                  </p>
                  <a href="/contact.vcf" download="Corentin_Commino.vcf" className="vcf-btn">
                    ⬇ Télécharger la vCard
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}