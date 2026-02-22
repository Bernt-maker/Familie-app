import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Login from './components/Login'
import GrandmaView from './components/GrandmaView'
import FamilyView from './components/FamilyView'
import './index.css'

export default function App() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchProfile(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) fetchProfile(session.user.id)
      else { setProfile(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    setProfile(data)
    setLoading(false)
  }

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-name">Familie-app</div>
      <div className="loading-dot">●</div>
    </div>
  )

  if (!session) return <Login />

  if (!profile) return (
    <div className="loading-screen">
      <p>Finner ikke brukerprofil. Kontakt Bernt.</p>
    </div>
  )

  return profile.role === 'grandma'
    ? <GrandmaView profile={profile} />
    : <FamilyView profile={profile} />
}
