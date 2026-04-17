import { useState } from 'react'

const AP = "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif"
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

export default function ContactForm() {
  const { values, errors, status, setStatus, handleChange, handleSubmit } = useContactForm()

  return (
    <div>
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
    </div>
  )
}
