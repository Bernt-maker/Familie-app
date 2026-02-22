import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabaseClient'

export default function FamilyView({ profile }) {
  const [tab, setTab] = useState('feed')
  const [posts, setPosts] = useState([])
  const [memories, setMemories] = useState([])
  const [checkins, setCheckins] = useState([])
  const [appointments, setAppointments] = useState([])
  const [medications, setMedications] = useState([])
  const [newCaption, setNewCaption] = useState('')
  const [newImage, setNewImage] = useState(null)
  const [posting, setPosting] = useState(false)
  const [showPostForm, setShowPostForm] = useState(false)
  const fileRef = useRef()

  const isCore = profile.role === 'core'

  useEffect(() => {
    fetchPosts()
    fetchMemories()
    if (isCore) {
      fetchCheckins()
      fetchAppointments()
      fetchMedications()
    }
  }, [])

  async function fetchPosts() {
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(name, avatar_emoji), reactions(id, emoji, user_id)')
      .order('created_at', { ascending: false })
      .limit(20)
    if (data) setPosts(data)
  }

  async function fetchMemories() {
    const { data } = await supabase
      .from('memory_answers')
      .select('*, memory_prompts(question)')
      .order('created_at', { ascending: false })
    if (data) setMemories(data)
  }

  async function fetchCheckins() {
    const { data } = await supabase
      .from('health_checkins')
      .select('*')
      .order('checkin_date', { ascending: false })
      .limit(7)
    if (data) setCheckins(data)
  }

  async function fetchAppointments() {
    const { data } = await supabase
      .from('appointments')
      .select('*')
      .gte('appointment_date', new Date().toISOString())
      .order('appointment_date', { ascending: true })
    if (data) setAppointments(data)
  }

  async function fetchMedications() {
    const today = new Date().toISOString().split('T')[0]
    const { data } = await supabase
      .from('medications')
      .select('*')
      .eq('med_date', today)
    if (data) setMedications(data)
  }

  async function handlePost() {
    if (!newCaption.trim() && !newImage) return
    setPosting(true)

    let imageUrl = null
    if (newImage) {
      const ext = newImage.name.split('.').pop()
      const filename = `${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('family-photos')
        .upload(filename, newImage)
      if (!uploadError) {
        const { data } = supabase.storage.from('family-photos').getPublicUrl(filename)
        imageUrl = data.publicUrl
      }
    }

    await supabase.from('posts').insert({
      author_id: profile.id,
      caption: newCaption,
      image_url: imageUrl
    })

    setNewCaption('')
    setNewImage(null)
    setShowPostForm(false)
    setPosting(false)
    fetchPosts()
  }

  async function toggleReaction(postId) {
    const post = posts.find(p => p.id === postId)
    const myReaction = post?.reactions?.find(r => r.user_id === profile.id)
    if (myReaction) {
      await supabase.from('reactions').delete().eq('id', myReaction.id)
    } else {
      await supabase.from('reactions').insert({ post_id: postId, user_id: profile.id })
    }
    fetchPosts()
  }

  async function addCheckin(mood) {
    await supabase.from('health_checkins').insert({
      registered_by: profile.id,
      mood,
      checkin_date: new Date().toISOString().split('T')[0]
    })
    fetchCheckins()
  }

  async function toggleMed(med, field) {
    await supabase.from('medications')
      .update({ [field]: !med[field], updated_by: profile.id })
      .eq('id', med.id)
    fetchMedications()
  }

  return (
    <div className="app family-app">
      {/* Header */}
      <div className="family-header">
        <div className="family-header-top">
          <span className="family-greeting">Hei {profile.name} {profile.avatar_emoji}</span>
          <button className="signout-btn" onClick={() => supabase.auth.signOut()}>Logg ut</button>
        </div>
        <div className="family-nav">
          {['feed', 'memories', ...(isCore ? ['health'] : [])].map(t => (
            <button
              key={t}
              className={`nav-btn ${tab === t ? 'active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t === 'feed' ? '📸 Feed' : t === 'memories' ? '✍️ Minner' : '🩺 Helse'}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      {tab === 'feed' && (
        <div className="family-feed">
          {showPostForm && (
            <div className="post-form">
              <textarea
                className="post-textarea"
                placeholder="Del noe med familien…"
                value={newCaption}
                onChange={e => setNewCaption(e.target.value)}
              />
              <div className="post-form-actions">
                <button className="attach-btn" onClick={() => fileRef.current.click()}>
                  📷 {newImage ? newImage.name : 'Legg ved bilde'}
                </button>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={e => setNewImage(e.target.files[0])} />
                <button className="submit-post-btn" onClick={handlePost} disabled={posting}>
                  {posting ? 'Poster…' : 'Del med familien'}
                </button>
              </div>
            </div>
          )}

          {posts.length === 0 && (
            <div className="empty-state">Ingen innlegg ennå. Vær den første!</div>
          )}

          {posts.map(post => {
            const myReaction = post.reactions?.find(r => r.user_id === profile.id)
            return (
              <div className="feed-card" key={post.id}>
                <div className="feed-card-header">
                  <div className="feed-avatar">{post.profiles?.avatar_emoji}</div>
                  <div>
                    <div className="feed-author">{post.profiles?.name}</div>
                    <div className="feed-ago">
                      {new Date(post.created_at).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
                {post.image_url && <img src={post.image_url} alt="" className="feed-image" />}
                {post.caption && <div className="feed-caption">{post.caption}</div>}
                <div className="feed-reactions">
                  <button
                    className={`reaction-btn ${myReaction ? 'reacted' : ''}`}
                    onClick={() => toggleReaction(post.id)}
                  >
                    ❤️ {post.reactions?.length || 0}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Memories */}
      {tab === 'memories' && (
        <div className="family-feed">
          <div className="section-label">Farmors minner</div>
          {memories.length === 0 && (
            <div className="empty-state">Farmor har ikke svart ennå – spørsmålene sendes automatisk daglig.</div>
          )}
          {memories.map(m => (
            <div className="memory-card" key={m.id}>
              <div className="memory-question">«{m.memory_prompts?.question}»</div>
              <div className="memory-answer">{m.answer_text}</div>
              <div className="memory-date">
                {new Date(m.created_at).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Health – kun core */}
      {tab === 'health' && isCore && (
        <div className="family-feed">
          {/* Checkin */}
          <div className="health-card">
            <div className="health-title">💚 Registrer daglig innsjekk</div>
            <div className="checkin-row">
              {['Bra 😊', 'OK 😐', 'Sliten 😔', 'Syk 🤒'].map(mood => (
                <button key={mood} className="checkin-pill" onClick={() => addCheckin(mood)}>
                  {mood}
                </button>
              ))}
            </div>
            {checkins.length > 0 && (
              <div className="checkin-history">
                <div style={{ fontSize: 13, opacity: 0.6, margin: '12px 0 6px' }}>Siste registreringer</div>
                {checkins.slice(0, 5).map(c => (
                  <div key={c.id} className="checkin-row-item">
                    <span>{c.mood}</span>
                    <span style={{ opacity: 0.5, fontSize: 13 }}>
                      {new Date(c.checkin_date).toLocaleDateString('nb-NO', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Appointments */}
          <div className="health-card">
            <div className="health-title">📅 Kommende avtaler</div>
            {appointments.length === 0 && <div className="empty-state-small">Ingen avtaler registrert.</div>}
            {appointments.map(a => {
              const d = new Date(a.appointment_date)
              return (
                <div className="appt-item" key={a.id}>
                  <div className="appt-date-box">
                    <div className="appt-day">{d.toLocaleDateString('nb-NO', { weekday: 'short' })}</div>
                    <div className="appt-num">{d.getDate()}</div>
                  </div>
                  <div>
                    <div className="appt-title">{a.title}</div>
                    <div className="appt-sub">{a.driver}</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Medications */}
          <div className="health-card">
            <div className="health-title">💊 Medisiner i dag</div>
            {medications.length === 0 && <div className="empty-state-small">Ingen medisiner registrert for i dag.</div>}
            {medications.map(med => (
              <div className="med-item" key={med.id}>
                <div>
                  <div className="med-name">{med.name}</div>
                  <div className="med-time">{med.time_of_day}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(med.time_of_day === 'morgen' || med.time_of_day === 'begge') && (
                    <button className={`med-check ${med.taken_morning ? 'checked' : ''}`}
                      onClick={() => toggleMed(med, 'taken_morning')}>
                      {med.taken_morning ? '✅' : '⬜'} Morgen
                    </button>
                  )}
                  {(med.time_of_day === 'kveld' || med.time_of_day === 'begge') && (
                    <button className={`med-check ${med.taken_evening ? 'checked' : ''}`}
                      onClick={() => toggleMed(med, 'taken_evening')}>
                      {med.taken_evening ? '✅' : '⬜'} Kveld
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAB – post button */}
      {tab === 'feed' && (
        <button className="fab" onClick={() => setShowPostForm(v => !v)}>
          {showPostForm ? '✕' : '+'}
        </button>
      )}
    </div>
  )
}
