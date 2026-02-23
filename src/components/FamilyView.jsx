import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabaseClient'

// Komprimer bilde før opplasting
async function compressImage(file, maxWidth = 1200, quality = 0.8) {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let { width, height } = img
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width)
        width = maxWidth
      }
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      canvas.toBlob(blob => {
        resolve(new File([blob], file.name, { type: 'image/jpeg' }))
        URL.revokeObjectURL(url)
      }, 'image/jpeg', quality)
    }
    img.src = url
  })
}

function Comment({ comment, postId, profile, onReplyAdded, onDelete, depth = 0 }) {
  const [showReply, setShowReply] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [posting, setPosting] = useState(false)
  const canDelete = profile.role === 'core' || comment.author_id === profile.id

  async function submitReply() {
    if (!replyText.trim()) return
    setPosting(true)
    await supabase.from('comments').insert({
      post_id: postId, author_id: profile.id,
      parent_id: comment.id, content: replyText
    })
    setReplyText(''); setShowReply(false); setPosting(false)
    onReplyAdded()
  }

  return (
    <div className={`comment ${depth > 0 ? 'comment-reply' : ''}`}>
      <div className="comment-header">
        <span className="comment-avatar">{comment.profiles?.avatar_emoji}</span>
        <span className="comment-author">{comment.profiles?.name}</span>
        <span className="comment-time">
          {new Date(comment.created_at).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' })}
        </span>
        {canDelete && (
          <button className="delete-small-btn" onClick={() => onDelete(comment.id)}>🗑</button>
        )}
      </div>
      <div className="comment-content">{comment.content}</div>
      {depth < 2 && (
        <button className="comment-reply-btn" onClick={() => setShowReply(v => !v)}>
          {showReply ? 'Avbryt' : '↩ Svar'}
        </button>
      )}
      {showReply && (
        <div className="reply-form">
          <input className="reply-input" placeholder={`Svar ${comment.profiles?.name}…`}
            value={replyText} onChange={e => setReplyText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submitReply()} />
          <button className="reply-send-btn" onClick={submitReply} disabled={posting || !replyText.trim()}>
            {posting ? '…' : 'Send'}
          </button>
        </div>
      )}
      {comment.replies?.map(reply => (
        <Comment key={reply.id} comment={reply} postId={postId} profile={profile}
          onReplyAdded={onReplyAdded} onDelete={onDelete} depth={depth + 1} />
      ))}
    </div>
  )
}

// Les/skriv "sist sett" fra localStorage
function getLastSeen(key) {
  return localStorage.getItem(`familie_lastseen_${key}`) || '2000-01-01'
}
function setLastSeen(key) {
  localStorage.setItem(`familie_lastseen_${key}`, new Date().toISOString())
}

export default function FamilyView({ profile }) {
  const [tab, setTab] = useState('feed')
  const [posts, setPosts] = useState([])
  const [comments, setComments] = useState({})
  const [expandedComments, setExpandedComments] = useState({})
  const [newCaption, setNewCaption] = useState('')
  const [newImage, setNewImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [posting, setPosting] = useState(false)
  const [showPostForm, setShowPostForm] = useState(false)
  const [commentInputs, setCommentInputs] = useState({})
  const [memories, setMemories] = useState([])
  const [checkins, setCheckins] = useState([])
  const [appointments, setAppointments] = useState([])
  const [medications, setMedications] = useState([])

  // Varseltellere
  const [badges, setBadges] = useState({ feed: 0, memories: 0, health: 0 })

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

  // Tell nye innlegg siden sist besøk
  useEffect(() => {
    if (posts.length === 0 && memories.length === 0) return
    const lastFeed = getLastSeen('feed')
    const lastMemories = getLastSeen('memories')
    const lastHealth = getLastSeen('health')

    const newPosts = posts.filter(p => p.created_at > lastFeed && p.author_id !== profile.id).length
    const newMemories = memories.filter(m => m.created_at > lastMemories).length
    const newHealth = checkins.filter(c => c.created_at > lastHealth).length

    setBadges({ feed: newPosts, memories: newMemories, health: newHealth })
  }, [posts, memories, checkins])

  // Nullstill varsel når du bytter til en fane
  function switchTab(t) {
    setTab(t)
    setLastSeen(t)
    setBadges(prev => ({ ...prev, [t]: 0 }))
  }

  async function fetchPosts() {
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(name, avatar_emoji), reactions(id, emoji, user_id)')
      .order('created_at', { ascending: false })
      .limit(20)
    if (data) setPosts(data)
  }

  async function fetchComments(postId) {
    const { data } = await supabase
      .from('comments')
      .select('*, profiles(name, avatar_emoji)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
    if (data) {
      const top = data.filter(c => !c.parent_id)
      const nested = top.map(c => ({
        ...c,
        replies: data.filter(r => r.parent_id === c.id).map(r => ({
          ...r, replies: data.filter(rr => rr.parent_id === r.id)
        }))
      }))
      setComments(prev => ({ ...prev, [postId]: nested }))
    }
  }

  function toggleComments(postId) {
    const isExpanded = expandedComments[postId]
    setExpandedComments(prev => ({ ...prev, [postId]: !isExpanded }))
    if (!isExpanded && !comments[postId]) fetchComments(postId)
  }

  async function submitComment(postId) {
    const text = commentInputs[postId]
    if (!text?.trim()) return
    await supabase.from('comments').insert({ post_id: postId, author_id: profile.id, content: text })
    setCommentInputs(prev => ({ ...prev, [postId]: '' }))
    fetchComments(postId)
  }

  async function deletePost(postId) {
    if (!confirm('Slette dette innlegget?')) return
    await supabase.from('posts').delete().eq('id', postId)
    fetchPosts()
  }

  async function deleteComment(commentId, postId) {
    await supabase.from('comments').delete().eq('id', commentId)
    fetchComments(postId)
  }

  async function handleImageSelect(file) {
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { alert('Bildet er for stort (maks 10 MB)'); return }
    const compressed = await compressImage(file)
    setNewImage(compressed)
    setImagePreview(URL.createObjectURL(compressed))
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
      .from('health_checkins').select('*')
      .order('checkin_date', { ascending: false }).limit(7)
    if (data) setCheckins(data)
  }

  async function fetchAppointments() {
    const { data } = await supabase
      .from('appointments').select('*')
      .gte('appointment_date', new Date().toISOString())
      .order('appointment_date', { ascending: true })
    if (data) setAppointments(data)
  }

  async function fetchMedications() {
    const today = new Date().toISOString().split('T')[0]
    const { data } = await supabase.from('medications').select('*').eq('med_date', today)
    if (data) setMedications(data)
  }

  async function handlePost() {
    if (!newCaption.trim() && !newImage) return
    setPosting(true)
    let imageUrl = null
    if (newImage) {
      const filename = `${Date.now()}.jpg`
      const { error: uploadError } = await supabase.storage.from('Family-photos').upload(filename, newImage)
      if (!uploadError) {
        const { data } = supabase.storage.from('Family-photos').getPublicUrl(filename)
        imageUrl = data.publicUrl
      }
    }
    await supabase.from('posts').insert({ author_id: profile.id, caption: newCaption, image_url: imageUrl })
    setNewCaption(''); setNewImage(null); setImagePreview(null)
    setShowPostForm(false); setPosting(false)
    fetchPosts()
  }

  async function toggleReaction(postId) {
    const post = posts.find(p => p.id === postId)
    const myReaction = post?.reactions?.find(r => r.user_id === profile.id)
    if (myReaction) await supabase.from('reactions').delete().eq('id', myReaction.id)
    else await supabase.from('reactions').insert({ post_id: postId, user_id: profile.id })
    fetchPosts()
  }

  async function addCheckin(mood) {
    await supabase.from('health_checkins').insert({
      registered_by: profile.id, mood,
      checkin_date: new Date().toISOString().split('T')[0]
    })
    fetchCheckins()
  }

  async function toggleMed(med, field) {
    await supabase.from('medications').update({ [field]: !med[field], updated_by: profile.id }).eq('id', med.id)
    fetchMedications()
  }

  const tabConfig = [
    { key: 'feed', label: '📸 Feed', badgeColor: '#e53e3e' },
    { key: 'memories', label: '✍️ Minner', badgeColor: '#38a169' },
    ...(isCore ? [{ key: 'health', label: '🩺 Helse', badgeColor: '#d69e2e' }] : [])
  ]

  return (
    <div className="app family-app">
      <div className="family-header">
        <div className="family-header-top">
          <span className="family-greeting">Hei {profile.name} {profile.avatar_emoji}</span>
          <button className="signout-btn" onClick={() => supabase.auth.signOut()}>Logg ut</button>
        </div>
        <div className="family-nav">
          {tabConfig.map(({ key, label, badgeColor }) => (
            <button
              key={key}
              className={`nav-btn ${tab === key ? 'active' : ''}`}
              onClick={() => switchTab(key)}
              style={{ position: 'relative' }}
            >
              {label}
              {badges[key] > 0 && (
                <span className="nav-badge" style={{ background: badgeColor }}>
                  {badges[key]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {tab === 'feed' && (
        <div className="family-feed">
          {showPostForm && (
            <div className="post-form">
              <textarea className="post-textarea" placeholder="Del noe med familien…"
                value={newCaption} onChange={e => setNewCaption(e.target.value)} />
              {imagePreview && (
                <div style={{ position: 'relative', marginTop: 8 }}>
                  <img src={imagePreview} alt="" style={{ width: '100%', borderRadius: 10, maxHeight: 200, objectFit: 'cover' }} />
                  <button onClick={() => { setNewImage(null); setImagePreview(null) }}
                    style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', fontSize: 14 }}>✕</button>
                </div>
              )}
              <div className="post-form-actions">
                <button className="attach-btn" onClick={() => fileRef.current.click()}>
                  📷 {newImage ? 'Bytt bilde' : 'Legg ved bilde'}
                </button>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={e => handleImageSelect(e.target.files[0])} />
                <button className="submit-post-btn" onClick={handlePost} disabled={posting}>
                  {posting ? 'Poster…' : 'Del med familien'}
                </button>
              </div>
            </div>
          )}

          {posts.length === 0 && <div className="empty-state">Ingen innlegg ennå. Vær den første!</div>}

          {posts.map(post => {
            const myReaction = post.reactions?.find(r => r.user_id === profile.id)
            const isExpanded = expandedComments[post.id]
            const postComments = comments[post.id] || []
            const canDelete = isCore || post.author_id === profile.id

            return (
              <div className="feed-card" key={post.id}>
                <div className="feed-card-header">
                  <div className="feed-avatar">{post.profiles?.avatar_emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div className="feed-author">{post.profiles?.name}</div>
                    <div className="feed-ago">
                      {new Date(post.created_at).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  {canDelete && <button className="delete-small-btn" onClick={() => deletePost(post.id)}>🗑</button>}
                </div>
                {post.image_url && <img src={post.image_url} alt="" className="feed-image" />}
                {post.caption && <div className="feed-caption">{post.caption}</div>}
                <div className="feed-reactions">
                  <button className={`reaction-btn ${myReaction ? 'reacted' : ''}`} onClick={() => toggleReaction(post.id)}>
                    ❤️ {post.reactions?.length || 0}
                  </button>
                  <button className="comment-toggle-btn" onClick={() => toggleComments(post.id)}>
                    💬 {isExpanded ? 'Skjul' : 'Kommentarer'}
                  </button>
                </div>
                {isExpanded && (
                  <div className="comments-section">
                    {postComments.map(c => (
                      <Comment key={c.id} comment={c} postId={post.id} profile={profile}
                        onReplyAdded={() => fetchComments(post.id)}
                        onDelete={(id) => deleteComment(id, post.id)} />
                    ))}
                    {postComments.length === 0 && (
                      <div style={{ fontSize: 14, color: '#9a8070', fontStyle: 'italic', padding: '8px 0' }}>
                        Ingen kommentarer ennå – vær den første!
                      </div>
                    )}
                    <div className="new-comment-form">
                      <input className="reply-input" placeholder="Skriv en kommentar…"
                        value={commentInputs[post.id] || ''}
                        onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyDown={e => e.key === 'Enter' && submitComment(post.id)} />
                      <button className="reply-send-btn" onClick={() => submitComment(post.id)}
                        disabled={!commentInputs[post.id]?.trim()}>Send</button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {tab === 'memories' && (
        <div className="family-feed">
          <div className="section-label">Farmors minner</div>
          {memories.length === 0 && <div className="empty-state">Farmor har ikke svart ennå.</div>}
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

      {tab === 'health' && isCore && (
        <div className="family-feed">
          <div className="health-card">
            <div className="health-title">💚 Registrer daglig innsjekk</div>
            <div className="checkin-row">
              {['Bra 😊', 'OK 😐', 'Sliten 😔', 'Syk 🤒'].map(mood => (
                <button key={mood} className="checkin-pill" onClick={() => addCheckin(mood)}>{mood}</button>
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
          <div className="health-card">
            <div className="health-title">💊 Medisiner i dag</div>
            {medications.length === 0 && <div className="empty-state-small">Ingen medisiner registrert.</div>}
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

      {tab === 'feed' && (
        <button className="fab" onClick={() => setShowPostForm(v => !v)}>
          {showPostForm ? '✕' : '+'}
        </button>
      )}
    </div>
  )
}
