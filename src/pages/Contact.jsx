import React, { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Float, OrbitControls, useGLTF, Html, Center } from '@react-three/drei'
import { QRCodeSVG } from 'qrcode.react'

/* ─── Modèle 3D ─── */
const MODEL_URL = 'https://res.cloudinary.com/drcx8ckvv/image/upload/v1775757753/phone_booth_b24xdv.glb'

function PhoneBooth() {
  const { scene } = useGLTF(MODEL_URL)
  return (
    <Center>
      <Float floatIntensity={0.25} rotationIntensity={0.04} speed={1.0}>
        <primitive object={scene} scale={1.6} position={[-8, 2, 0]} />
      </Float>
    </Center>
  )
}
useGLTF.preload(MODEL_URL)

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

      .glass-panel { animation: slideIn 0.6s cubic-bezier(0.22,1,0.36,1) both; }

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
      .c-input.err, .c-select.err, .c-textarea.err {
        border-color: #ff3b30;
        box-shadow: 0 0 0 3px rgba(255,59,48,0.1);
      }
      .c-textarea { resize: vertical; min-height: 100px; line-height: 1.5; }

      .field-err {
        font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
        font-size: 0.74rem;
        color: #ff3b30;
        margin-top: 4px;
        display: block;
        animation: fadeUp 0.2s ease;
      }

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

      .toast {
        padding: 12px 16px;
        border-radius: 14px;
        font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
        font-size: 0.86rem;
        font-weight: 500;
        animation: toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1);
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 16px;
      }
      .toast.ok { background: #e8faf0; color: #1a7f4b; border: 1px solid #a8e6c3; }
      .toast.ko { background: #fff0ef; color: #c0392b; border: 1px solid #f5b8b3; }

      .qr-card {
        background: rgba(255,255,255,0.75);
        border-radius: 18px;
        border: 1px solid rgba(200,210,230,0.45);
        padding: 16px 18px;
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
        padding: 7px 13px;
        border-radius: 20px;
        border: 1.5px solid rgba(0,113,227,0.3);
        background: transparent;
        color: #0071e3;
        font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
        font-size: 0.76rem;
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

      label {
        font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
        font-size: 0.78rem;
        font-weight: 600;
        color: #1d1d1f;
        display: block;
        margin-bottom: 6px;
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])
  return null
}

/* ─── Hook formulaire ─── */
const FORMSPREE_URL = import.meta.env.VITE_FORMSPREE_URL || 'https://formspree.io/f/YOUR_ID'

function useContactForm() {
  const [values, setValues] = useState({ prenom: '', nom: '', email: '', sujet: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const validate = v => {
    const e = {}
    if (!v.prenom.trim())                             e.prenom  = 'Le prénom est requis.'
    if (!v.nom.trim())                                e.nom     = 'Le nom est requis.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email   = 'Adresse e-mail invalide.'
    if (!v.sujet)                                     e.sujet   = 'Veuillez choisir un sujet.'
    if (v.message.trim().length < 20)                 e.message = 'Minimum 20 caractères requis.'
    return e
  }

  const handleChange = field => e => {
    const v = { ...values, [field]: e.target.value }
    setValues(v)
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
  }

  const handleSubmit = async e => {
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
      } else { setStatus('error') }
    } catch { setStatus('error') }
  }

  return { values, errors, status, setStatus, handleChange, handleSubmit }
}

/* ══════════════════════════
   PAGE CONTACT PRINCIPALE
══════════════════════════ */
const AP = "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif"

export default function Contact() {
  const { values, errors, status, setStatus, handleChange, handleSubmit } = useContactForm()
  const vcardUrl = `${window.location.origin}/contact.vcf`

  return (
    <>
      <GlobalStyles />
      <div style={{
        width: '100vw', height: '100vh',
        position: 'relative', overflow: 'hidden',
        background: '#ffffff',
      }}>

        {/* ── Scène 3D ── */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Canvas camera={{ position: [11, -2, 9], fov: 90 }} gl={{ antialias: true, alpha: false }}>
            <color attach="background" args={['#ffffff']} />
            <ambientLight intensity={1.2} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
            <pointLight position={[-4, 2, 4]} intensity={0.6} color="#ffe8e8" />
            <Environment preset="city" />
            <React.Suspense fallback={<Loader />}>
              <PhoneBooth />
            </React.Suspense>
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

        {/* ── Panneau Contact ── */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          display: 'flex', alignItems: 'center',
          paddingLeft: '5%', paddingTop: '48px', paddingBottom: '48px',
          pointerEvents: 'none',
        }}>
          <div className="glass-panel" style={{
            maxWidth: '600px', width: '100%',
            maxHeight: 'calc(100vh - 96px)',
            pointerEvents: 'auto',
            backgroundColor: 'rgba(255,255,255,0.78)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            padding: '36px 36px 30px',
            borderRadius: '26px',
            boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 0 8px 48px rgba(0,0,0,0.08)',
            border: '1px solid rgba(200,210,230,0.5)',
            display: 'flex', flexDirection: 'column',
          }}>

            {/* En-tête */}
            <div style={{ marginBottom: '20px', flexShrink: 0 }}>
              <span style={{
                fontFamily: AP, fontSize: '0.72rem', fontWeight: '600',
                color: '#0071e3', letterSpacing: '1.8px', textTransform: 'uppercase',
                display: 'block', marginBottom: '8px',
              }}>
                Portfolio · Corentin Commino
              </span>
              <h1 style={{
                fontFamily: AP, fontSize: '2.6rem', fontWeight: 800,
                letterSpacing: '-0.04em', color: '#1d1d1f', lineHeight: 1.05, marginBottom: '8px',
              }}>
                Me Contacter.
              </h1>
              <p style={{ fontFamily: AP, fontSize: '0.95rem', lineHeight: '1.6', color: '#6e6e73' }}>
                Une opportunité, une question ou une collaboration ? Écrivez-moi.
              </p>
            </div>

            {/* Zone scrollable */}
            <div className="contact-scroll" style={{ overflowY: 'auto', flex: 1, paddingRight: '4px' }}>

              {/* Toasts */}
              {status === 'success' && (
                <div className="toast ok">
                  <span>✅</span>
                  <span>Message envoyé ! Je vous réponds dès que possible.</span>
                </div>
              )}
              {status === 'error' && (
                <div className="toast ko">
                  <span>⚠️</span>
                  <span>Erreur réseau. Veuillez réessayer.</span>
                  <button onClick={() => setStatus('idle')} style={{
                    marginLeft: 'auto', background: 'none', border: 'none',
                    color: '#c0392b', cursor: 'pointer', fontWeight: 600,
                    fontSize: '0.82rem', fontFamily: AP,
                  }}>
                    Réessayer
                  </button>
                </div>
              )}

              {/* Formulaire */}
              <form onSubmit={handleSubmit} noValidate>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>

                  {/* Prénom / Nom */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label>Prénom</label>
                      <input
                        className={`c-input${errors.prenom ? ' err' : ''}`}
                        type="text" placeholder="Corentin"
                        value={values.prenom} onChange={handleChange('prenom')}
                        autoComplete="given-name"
                      />
                      {errors.prenom && <span className="field-err">{errors.prenom}</span>}
                    </div>
                    <div>
                      <label>Nom</label>
                      <input
                        className={`c-input${errors.nom ? ' err' : ''}`}
                        type="text" placeholder="Commino"
                        value={values.nom} onChange={handleChange('nom')}
                        autoComplete="family-name"
                      />
                      {errors.nom && <span className="field-err">{errors.nom}</span>}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label>Adresse e-mail</label>
                    <input
                      className={`c-input${errors.email ? ' err' : ''}`}
                      type="email" placeholder="vous@exemple.com"
                      value={values.email} onChange={handleChange('email')}
                      autoComplete="email"
                    />
                    {errors.email && <span className="field-err">{errors.email}</span>}
                  </div>

                  {/* Sujet */}
                  <div>
                    <label>Sujet</label>
                    <div style={{ position: 'relative' }}>
                      <select
                        className={`c-select${errors.sujet ? ' err' : ''}`}
                        value={values.sujet} onChange={handleChange('sujet')}
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
                    {errors.sujet && <span className="field-err">{errors.sujet}</span>}
                  </div>

                  {/* Message */}
                  <div>
                    <label>
                      Message{' '}
                      <span style={{
                        color: values.message.length >= 20 ? '#1a7f4b' : '#aeaeb2',
                        fontWeight: 400,
                      }}>
                        ({values.message.length}/20 min)
                      </span>
                    </label>
                    <textarea
                      className={`c-textarea${errors.message ? ' err' : ''}`}
                      placeholder="Décrivez votre demande…"
                      value={values.message} onChange={handleChange('message')}
                    />
                    {errors.message && <span className="field-err">{errors.message}</span>}
                  </div>

                  {/* Submit */}
                  <button type="submit" className="submit-btn" disabled={status === 'loading'}>
                    {status === 'loading' ? '⏳ Envoi en cours…' : '✉️ Envoyer le message'}
                  </button>

                </div>
              </form>

              {/* Séparateur */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0 16px' }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.07)' }} />
                <span style={{ fontFamily: AP, fontSize: '0.74rem', color: '#aeaeb2', fontWeight: 500 }}>
                  ou directement
                </span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.07)' }} />
              </div>

              {/* QR Code vCard */}
              <div className="qr-card">
                <div style={{
                  flexShrink: 0, borderRadius: '10px', overflow: 'hidden',
                  padding: '5px', background: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}>
                  <QRCodeSVG
                    value={vcardUrl}
                    size={84}
                    fgColor="#1d1d1f"
                    bgColor="#ffffff"
                    level="H"
                    includeMargin={false}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: AP, fontSize: '0.86rem', fontWeight: 700, color: '#1d1d1f', marginBottom: '4px' }}>
                    Enregistrer mon contact
                  </p>
                  <p style={{ fontFamily: AP, fontSize: '0.76rem', color: '#6e6e73', lineHeight: 1.5, marginBottom: '10px' }}>
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
