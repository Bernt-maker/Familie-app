import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }
    })
    if (error) setError('Noe gikk galt. Prøv igjen.')
    else setSent(true)
    setLoading(false)
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-emoji">👨‍👩‍👧‍👦</div>
        <h1 className="login-title">Familie-app</h1>
        <p className="login-sub">Skriv inn e-postadressen din, så sender vi deg en innloggingslenke</p>

        {sent ? (
          <div className="login-sent">
            <div style={{ fontSize: 48, marginBottom: 12 }}>📬</div>
            <p>Vi har sendt en innloggingslenke til <strong>{email}</strong>.</p>
            <p style={{ marginTop: 8, opacity: 0.7, fontSize: 14 }}>Sjekk e-posten og trykk på lenken.</p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="login-form">
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
              {loading ? 'Sender…' : 'Send innloggingslenke'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
