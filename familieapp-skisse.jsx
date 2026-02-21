import { useState } from "react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream: #fdf6ec;
    --warm: #f5e6d0;
    --brown: #8b5e3c;
    --dark: #3d2b1f;
    --green: #5a7a5a;
    --rose: #c4706b;
    --gold: #c9933a;
    --shadow: rgba(61,43,31,0.12);
  }

  body { 
    font-family: 'Lora', serif; 
    background: var(--cream);
    color: var(--dark);
  }

  .app {
    max-width: 420px;
    margin: 0 auto;
    min-height: 100vh;
    position: relative;
    overflow: hidden;
    background: var(--cream);
  }

  /* ---- TOPBAR ---- */
  .topbar {
    background: var(--dark);
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .topbar-title {
    font-family: 'Playfair Display', serif;
    color: var(--warm);
    font-size: 20px;
    letter-spacing: 0.5px;
  }
  .mode-toggle {
    background: var(--brown);
    border: none;
    border-radius: 20px;
    padding: 6px 14px;
    color: var(--cream);
    font-family: 'Lora', serif;
    font-size: 13px;
    cursor: pointer;
    transition: background 0.2s;
  }
  .mode-toggle:hover { background: var(--gold); }

  /* ---- GRANDMOTHER VIEW ---- */
  .grandma-view {
    padding: 0;
  }

  .grandma-greeting {
    background: linear-gradient(160deg, #3d2b1f 0%, #6b3f28 100%);
    padding: 32px 24px 40px;
    text-align: center;
    position: relative;
  }
  .grandma-greeting::after {
    content: '';
    position: absolute;
    bottom: -20px;
    left: 0; right: 0;
    height: 40px;
    background: var(--cream);
    border-radius: 50% 50% 0 0 / 100% 100% 0 0;
  }
  .grandma-time {
    color: var(--warm);
    opacity: 0.7;
    font-size: 15px;
    margin-bottom: 6px;
  }
  .grandma-hello {
    font-family: 'Playfair Display', serif;
    color: var(--cream);
    font-size: 32px;
    line-height: 1.2;
    margin-bottom: 8px;
  }
  .grandma-sub {
    color: var(--warm);
    opacity: 0.8;
    font-size: 16px;
    font-style: italic;
  }

  .grandma-photo-section {
    padding: 36px 20px 20px;
  }
  .section-label {
    font-family: 'Playfair Display', serif;
    font-size: 13px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--brown);
    margin-bottom: 16px;
    opacity: 0.8;
  }

  .photo-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 20px var(--shadow);
    margin-bottom: 16px;
    cursor: pointer;
    transition: transform 0.2s;
  }
  .photo-card:hover { transform: translateY(-2px); }

  .photo-placeholder {
    width: 100%;
    height: 220px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 48px;
  }
  .photo-meta {
    padding: 14px 18px 16px;
  }
  .photo-who {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    color: var(--dark);
    margin-bottom: 4px;
  }
  .photo-text {
    font-size: 16px;
    color: #5a4a3a;
    line-height: 1.5;
  }
  .photo-time {
    font-size: 13px;
    color: #9a8070;
    margin-top: 8px;
    font-style: italic;
  }

  /* Big action buttons for grandma */
  .grandma-actions {
    padding: 8px 20px 32px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .big-btn {
    width: 100%;
    padding: 22px 20px;
    border: none;
    border-radius: 16px;
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: 0 3px 12px var(--shadow);
  }
  .big-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px var(--shadow); }
  .big-btn:active { transform: translateY(0); }
  .big-btn-icon { font-size: 32px; }
  .big-btn-text { line-height: 1.2; }
  .big-btn-sub { font-family: 'Lora', serif; font-size: 14px; opacity: 0.75; font-style: italic; display: block; margin-top: 2px; }

  .btn-memory { background: linear-gradient(135deg, #e8d5bc, #d4b896); color: var(--dark); }
  .btn-health { background: linear-gradient(135deg, #c8ddc8, #a8c4a8); color: #2a3d2a; }
  .btn-call { background: linear-gradient(135deg, #c4706b, #a85550); color: white; }

  /* ---- FAMILY VIEW ---- */
  .family-view {}

  .family-header {
    background: var(--dark);
    padding: 20px;
  }
  .family-nav {
    display: flex;
    gap: 4px;
    background: rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 4px;
    margin-top: 16px;
  }
  .nav-btn {
    flex: 1;
    padding: 9px 4px;
    border: none;
    border-radius: 9px;
    font-family: 'Lora', serif;
    font-size: 13px;
    cursor: pointer;
    transition: background 0.2s;
    color: rgba(255,255,255,0.7);
    background: transparent;
  }
  .nav-btn.active {
    background: white;
    color: var(--dark);
    font-weight: 500;
  }

  .family-feed {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .feed-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 12px var(--shadow);
  }
  .feed-card-header {
    padding: 14px 16px 10px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .avatar {
    width: 40px; height: 40px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }
  .av-bernt { background: #3d2b1f; color: var(--cream); }
  .av-silje { background: var(--rose); color: white; }
  .av-noah { background: var(--green); color: white; }
  .feed-author { font-family: 'Playfair Display', serif; font-size: 15px; color: var(--dark); }
  .feed-ago { font-size: 12px; color: #9a8070; font-style: italic; }

  .feed-photo {
    width: 100%; height: 180px;
    display: flex; align-items: center; justify-content: center;
    font-size: 48px;
  }
  .feed-caption {
    padding: 12px 16px 14px;
    font-size: 15px;
    line-height: 1.5;
    color: #4a3a2a;
  }
  .feed-reaction {
    padding: 10px 16px 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .reaction-pill {
    background: var(--warm);
    border: none;
    border-radius: 20px;
    padding: 6px 14px;
    font-size: 14px;
    cursor: pointer;
    font-family: 'Lora', serif;
    color: var(--brown);
    transition: background 0.2s;
  }
  .reaction-pill:hover { background: #e8d0b0; }

  /* Question of the day */
  .question-card {
    background: linear-gradient(135deg, #3d2b1f, #6b3f28);
    border-radius: 16px;
    padding: 24px;
    color: white;
    box-shadow: 0 4px 20px var(--shadow);
  }
  .question-label {
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    opacity: 0.6;
    margin-bottom: 10px;
  }
  .question-text {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    line-height: 1.4;
    margin-bottom: 18px;
  }
  .question-answer-area {
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 12px;
    padding: 14px;
    width: 100%;
    font-family: 'Lora', serif;
    font-size: 16px;
    color: white;
    resize: none;
    height: 80px;
  }
  .question-answer-area::placeholder { color: rgba(255,255,255,0.4); }
  .question-answer-area:focus { outline: none; border-color: rgba(255,255,255,0.5); }
  .q-actions {
    display: flex; gap: 10px; margin-top: 12px;
  }
  .q-btn {
    flex: 1; padding: 12px;
    border: none; border-radius: 10px;
    font-family: 'Lora', serif; font-size: 15px;
    cursor: pointer; transition: opacity 0.2s;
  }
  .q-btn-voice { background: var(--rose); color: white; }
  .q-btn-send { background: var(--gold); color: var(--dark); }

  /* Health panel */
  .health-panel {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .health-card {
    background: white;
    border-radius: 14px;
    padding: 18px;
    box-shadow: 0 2px 12px var(--shadow);
  }
  .health-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 16px;
    color: var(--dark);
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .checkin-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .checkin-pill {
    padding: 8px 16px;
    border-radius: 20px;
    border: 2px solid var(--warm);
    background: transparent;
    font-family: 'Lora', serif;
    font-size: 14px;
    cursor: pointer;
    color: var(--brown);
    transition: all 0.2s;
  }
  .checkin-pill.selected {
    background: var(--green);
    border-color: var(--green);
    color: white;
  }
  .appointment-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid var(--warm);
  }
  .appointment-item:last-child { border-bottom: none; }
  .appt-date {
    background: var(--dark);
    color: var(--cream);
    border-radius: 8px;
    padding: 8px 10px;
    text-align: center;
    min-width: 44px;
  }
  .appt-day { font-size: 10px; opacity: 0.7; text-transform: uppercase; letter-spacing: 1px; }
  .appt-num { font-family: 'Playfair Display', serif; font-size: 22px; line-height: 1; }
  .appt-info { flex: 1; }
  .appt-title { font-size: 15px; color: var(--dark); }
  .appt-who { font-size: 13px; color: #9a8070; font-style: italic; }

  .post-btn {
    background: var(--brown);
    color: var(--cream);
    border: none;
    border-radius: 50%;
    width: 56px; height: 56px;
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(139,94,60,0.4);
    position: fixed;
    bottom: 24px;
    right: 24px;
    transition: background 0.2s, transform 0.2s;
    z-index: 10;
  }
  .post-btn:hover { background: var(--gold); transform: scale(1.08); }
`;

const PHOTOS = [
  { id: 1, bg: "#f0e4d4", emoji: "🌲❄️", who: "Bernt", text: "Skitur på Krokskogen i dag – tenkte på deg hele veien!", ago: "For 2 timer siden", av: "av-bernt", avE: "B" },
  { id: 2, bg: "#fce4e4", emoji: "🎂🎉", who: "Silje (barnebarn)", text: "Mathilde fyller 6 år i dag. Hun savner klemmen din!", ago: "I går", av: "av-silje", avE: "S" },
  { id: 3, bg: "#e4f0e4", emoji: "⚽😄", who: "Noah (oldebarn)", text: "Scoret to mål på trening. Lærte å skyte med venstre fot!", ago: "For 2 dager siden", av: "av-noah", avE: "N" },
];

export default function FamilieApp() {
  const [mode, setMode] = useState("grandma"); // grandma | family
  const [tab, setTab] = useState("feed"); // feed | question | health
  const [selected, setSelected] = useState(null);

  return (
    <>
      <style>{style}</style>
      <div className="app">
        <div className="topbar">
          <span className="topbar-title">
            {mode === "grandma" ? "👵 Farmors visning" : "👨‍👩‍👧 Familievisning"}
          </span>
          <button className="mode-toggle" onClick={() => setMode(m => m === "grandma" ? "family" : "grandma")}>
            {mode === "grandma" ? "Familievisning →" : "← Farmors visning"}
          </button>
        </div>

        {mode === "grandma" && (
          <div className="grandma-view">
            <div className="grandma-greeting">
              <div className="grandma-time">Lørdag 22. februar</div>
              <div className="grandma-hello">God morgen, Mormor! ☀️</div>
              <div className="grandma-sub">3 nye bilder fra familien</div>
            </div>

            <div className="grandma-photo-section">
              <div className="section-label">Siste fra familien</div>
              {PHOTOS.map(p => (
                <div className="photo-card" key={p.id}>
                  <div className="photo-placeholder" style={{ background: p.bg }}>
                    <span>{p.emoji}</span>
                  </div>
                  <div className="photo-meta">
                    <div className="photo-who">{p.who}</div>
                    <div className="photo-text">{p.text}</div>
                    <div className="photo-time">{p.ago}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grandma-actions">
              <button className="big-btn btn-memory" onClick={() => { setMode("family"); setTab("question"); }}>
                <span className="big-btn-icon">✍️</span>
                <div className="big-btn-text">
                  Dagens spørsmål
                  <span className="big-btn-sub">Del et minne fra livet ditt</span>
                </div>
              </button>
              <button className="big-btn btn-health" onClick={() => { setMode("family"); setTab("health"); }}>
                <span className="big-btn-icon">🩺</span>
                <div className="big-btn-text">
                  Helse og avtaler
                  <span className="big-btn-sub">Legebesøk, medisiner, logistikk</span>
                </div>
              </button>
              <button className="big-btn btn-call">
                <span className="big-btn-icon">📞</span>
                <div className="big-btn-text">
                  Ring Bernt
                  <span className="big-btn-sub">Trykk her for å ringe</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {mode === "family" && (
          <div className="family-view">
            <div className="family-header">
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: "'Lora', serif", fontStyle: "italic" }}>
                Hei Bernt 👋 Familien er aktiv
              </div>
              <div className="family-nav">
                {["feed", "question", "health"].map(t => (
                  <button key={t} className={`nav-btn ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
                    {t === "feed" ? "📸 Feed" : t === "question" ? "✍️ Minner" : "🩺 Helse"}
                  </button>
                ))}
              </div>
            </div>

            {tab === "feed" && (
              <div className="family-feed">
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", color: "var(--brown)", opacity: 0.8 }}>
                  Siste fra familien
                </div>
                {PHOTOS.map(p => (
                  <div className="feed-card" key={p.id}>
                    <div className="feed-card-header">
                      <div className={`avatar ${p.av}`}>{p.avE}</div>
                      <div>
                        <div className="feed-author">{p.who}</div>
                        <div className="feed-ago">{p.ago}</div>
                      </div>
                    </div>
                    <div className="feed-photo" style={{ background: p.bg }}>
                      <span>{p.emoji}</span>
                    </div>
                    <div className="feed-caption">{p.text}</div>
                    <div className="feed-reaction">
                      <button className="reaction-pill">❤️ Hjerte</button>
                      <button className="reaction-pill">💬 Svar</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === "question" && (
              <div className="family-feed">
                <div className="question-card">
                  <div className="question-label">Dagens spørsmål til Farmor</div>
                  <div className="question-text">
                    «Hva er det beste minnet du har fra barndommen din?»
                  </div>
                  <textarea className="question-answer-area" placeholder="Farmors svar vises her når hun har svart…" readOnly />
                </div>
                <div style={{ background: "white", borderRadius: 16, padding: 20, boxShadow: "0 2px 12px var(--shadow)" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, marginBottom: 14, color: "var(--dark)" }}>
                    📚 Tidligere svar fra Farmor
                  </div>
                  {[
                    { q: "Hva var favorittmaten din som barn?", a: "Mors fårikål på søndag. Den lukten kan jeg ennå kjenne…", date: "18. feb" },
                    { q: "Husker du første dagen på skolen?", a: "Jeg var så redd. Læreren het frøken Hansen og var snill.", date: "15. feb" },
                  ].map((item, i) => (
                    <div key={i} style={{ borderBottom: "1px solid var(--warm)", paddingBottom: 14, marginBottom: 14 }}>
                      <div style={{ fontSize: 13, color: "var(--brown)", fontStyle: "italic", marginBottom: 4 }}>{item.q}</div>
                      <div style={{ fontSize: 15, color: "var(--dark)", lineHeight: 1.5 }}>{item.a}</div>
                      <div style={{ fontSize: 12, color: "#9a8070", marginTop: 4 }}>{item.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "health" && (
              <div className="health-panel">
                <div className="health-card">
                  <div className="health-card-title">💚 Dagens innsjekk – Farmor</div>
                  <div style={{ fontSize: 14, color: "#6a5a4a", marginBottom: 12, fontStyle: "italic" }}>Hvordan har hun det i dag?</div>
                  <div className="checkin-row">
                    {["Bra 😊", "OK 😐", "Sliten 😔", "Syk 🤒"].map(s => (
                      <button key={s} className={`checkin-pill ${selected === s ? "selected" : ""}`} onClick={() => setSelected(s)}>{s}</button>
                    ))}
                  </div>
                </div>
                <div className="health-card">
                  <div className="health-card-title">📅 Kommende avtaler</div>
                  {[
                    { day: "Man", num: "24", title: "Fastlege Dr. Nilsen", who: "Bernt kjører" },
                    { day: "Fre", num: "28", title: "Frisør i Hønefoss", who: "Søster Anne henter" },
                    { day: "Tir", num: "4", title: "Blodprøver Drammen", who: "Ikke planlagt ennå" },
                  ].map((a, i) => (
                    <div className="appointment-item" key={i}>
                      <div className="appt-date">
                        <div className="appt-day">{a.day}</div>
                        <div className="appt-num">{a.num}</div>
                      </div>
                      <div className="appt-info">
                        <div className="appt-title">{a.title}</div>
                        <div className="appt-who">{a.who}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="health-card">
                  <div className="health-card-title">💊 Medisiner i dag</div>
                  {[
                    { name: "Blodtrykksmedisin", time: "Morgen", done: true },
                    { name: "D-vitamin", time: "Morgen", done: true },
                    { name: "Hjertemedisin", time: "Kveld", done: false },
                  ].map((m, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 2 ? "1px solid var(--warm)" : "none" }}>
                      <span style={{ fontSize: 20 }}>{m.done ? "✅" : "⬜"}</span>
                      <div>
                        <div style={{ fontSize: 15, color: "var(--dark)" }}>{m.name}</div>
                        <div style={{ fontSize: 13, color: "#9a8070", fontStyle: "italic" }}>{m.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button className="post-btn" title="Del noe med familien">+</button>
          </div>
        )}
      </div>
    </>
  );
}
