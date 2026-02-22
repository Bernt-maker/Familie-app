import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState('email') // 'email' | 'code'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSendCode(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false }
    })
    if (error) {
      setError('Kunne ikke sende kode. Sjekk at e-postadressen er riktig.')
    } else {
      setStep('code')
    }
    setLoading(false)
  }

  async function handleVerifyCode(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'email'
    })
    if (error) {
      setError('Feil kode. Prøv igjen eller be om ny kode.')
    }
    setLoading(false)
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-emoji">👨‍👩‍👧‍👦</div>
        <h1 className="login-title">Familie-app</h1>

        {step === 'email' && (
          <>
            <p className="login-sub">
              Skriv inn e-postadressen din, så sender vi deg en engangskode
            </p>
            <form onSubmit={handleSendCode} className="login-form">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="din@epost.no"
                required
                className="login-input"
              />
              {error && <p className="login-error">{error}</p>}
              <button type="submit" disabled={loading} className="login-btn">
                {loading ? 'Sender…' : 'Send kode'}
              </button>
            </form>
          </>
        )}

        {step === 'code' && (
          <>
            <p className="login-sub">
              Vi har sendt en 6-sifret kode til <strong>{email}</strong>. Sjekk innboksen.
            </p>
            <form onSubmit={handleVerifyCode} className="login-form">
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
                placeholder="12345678"
                required
                className="login-input login-input-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={8}
              />
              {error && <p className="login-error">{error}</p>}
              <button type="submit" disabled={loading || code.length < 8} className="login-btn">
                {loading ? 'Sjekker…' : 'Logg inn'}
              </button>
              <button
                type="button"
                className="login-btn-secondary"
                onClick={() => { setStep('email'); setCode(''); setError('') }}
              >
                ← Bruk annen e-post
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
