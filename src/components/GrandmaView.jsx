import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export default function GrandmaView({ profile }) {
  const [posts, setPosts] = useState([])
  const [todayPrompt, setTodayPrompt] = useState(null)
  const [answer, setAnswer] = useState('')
  const [answerSent, setAnswerSent] = useState(false)
  const [view, setView] = useState('feed')
  const [slideshowActive, setSlideshowActive] = useState(false)
  const [slideIndex, setSlideIndex] = useState(0)

  // Kun innlegg med bilder for fotoramme
  const photoPosts = posts.filter(p => p.image_url)

  useEffect(() => {
    fetchPosts()
    fetchTodayPrompt()
  }, [])

  // Fotoramme-timer: bytt bilde hvert 8. sekund
  useEffect(() => {
    if (!slideshowActive || photoPosts.length === 0) return
    const timer = setInterval(() => {
      setSlideIndex(i => (i + 1) % photoPosts.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [slideshowActive, photoPosts.length])

  async function fetchPosts() {
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(name, avatar_emoji)')
      .order('created_at', { ascending: false })
      .limit(20)
    if (data) setPosts(data)
  }

  async function fetchTodayPrompt() {
    const today = new Date().toISOString().split('T')[0]
    const { data } = await supabase
      .from('memory_prompts')
      .select('*')
      .lte('active_date', today)
      .order('active_date', { ascending: false })
      .limit(1)
      .single()
    if (data) setTodayPrompt(data)
  }

  async function submitAnswer() {
    if (!answer.trim() || !todayPrompt) return
    await supabase.from('memory_answers').insert({
      prompt_id: todayPrompt.id,
      answer_text: answer
    })
    setAnswerSent(true)
  }

  const today = new Date().toLocaleDateString('nb-NO', {
    weekday: 'long', day: 'numeric', month: 'long'
  })
  const todayCapitalized = today.charAt(0).toUpperCase() + today.slice(1)

  // Fotoramme-visning
  if (slideshowActive && photoPosts.length > 0) {
    const current = photoPosts[slideIndex]
    return (
      <div className="slideshow-screen" onClick={() => setSlideshowActive(false)}>
        <img src={current.image_url} alt="" className="slideshow-img" />
        <div className="slideshow-caption">
          <div className="slideshow-who">{current.profiles?.avatar_emoji} {current.profiles?.name}</div>
          {current.caption && <div className="slideshow-text">{current.caption}</div>}
        </div>
        <div className="slideshow-dots">
          {photoPosts.map((_, i) => (
            <div key={i} className={`slideshow-dot ${i === slideIndex ? 'active' : ''}`} />
          ))}
        </div>
        <div className="slideshow-hint">Trykk hvor som helst for å gå tilbake</div>
      </div>
    )
  }

  return (
    <div className="app grandma-app">
      <div className="grandma-header">
        <div className="grandma-date">{todayCapitalized}</div>
        <div className="grandma-hello">God dag, {profile.name}! ☀️</div>
        <div className="grandma-sub">{posts.length} bilder fra familien</div>
      </div>

      {view === 'feed' && (
        <div className="grandma-feed">
          <div className="section-label">Siste fra familien</div>

          {photoPosts.length > 0 && (
            <button className="slideshow-btn" onClick={() => { setSlideshowActive(true); setSlideIndex(0) }}>
              🖼️ Vis som fotoramme
            </button>
          )}

          {posts.length === 0 && (
            <div className="empty-state">Ingen bilder ennå – familien legger snart ut noe!</div>
          )}
          {posts.map(post => (
            <div className="grandma-card" key={post.id}>
              {post.image_url && (
                <img src={post.image_url} alt="" className="grandma-img" />
              )}
              <div className="grandma-card-body">
                <div className="grandma-poster">
                  {post.profiles?.avatar_emoji} {post.profiles?.name}
                </div>
                {post.caption && (
                  <div className="grandma-caption">{post.caption}</div>
                )}
                <div className="grandma-ago">
                  {new Date(post.created_at).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'question' && (
        <div className="grandma-feed">
          <div className="section-label">Dagens spørsmål</div>
          {todayPrompt ? (
            <div className="question-big-card">
              <div className="question-big-text">«{todayPrompt.question}»</div>
              {answerSent ? (
                <div className="answer-sent">
                  <div style={{ fontSize: 48 }}>💌</div>
                  <p>Tusen takk! Svaret ditt er sendt til familien.</p>
                </div>
              ) : (
                <>
                  <textarea
                    className="grandma-textarea"
                    placeholder="Skriv svaret ditt her…"
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                  />
                  <button className="grandma-submit-btn" onClick={submitAnswer}>
                    Send til familien 💌
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="empty-state">Ingen spørsmål i dag.</div>
          )}
        </div>
      )}

      <div className="grandma-actions">
        {view !== 'feed' && (
          <button className="big-btn btn-back" onClick={() => setView('feed')}>
            <span className="big-btn-icon">←</span>
            <div className="big-btn-text">Tilbake til bildene</div>
          </button>
        )}
        {view === 'feed' && (
          <button className="big-btn btn-memory" onClick={() => setView('question')}>
            <span className="big-btn-icon">✍️</span>
            <div className="big-btn-text">
              Dagens spørsmål
              <span className="big-btn-sub">Del et minne fra livet ditt</span>
            </div>
          </button>
        )}
        <button className="big-btn btn-call" onClick={() => window.location.href = 'tel:+47XXXXXXXX'}>
          <span className="big-btn-icon">📞</span>
          <div className="big-btn-text">
            Ring Bernt
            <span className="big-btn-sub">Trykk her for å ringe</span>
          </div>
        </button>
      </div>
    </div>
  )
}
