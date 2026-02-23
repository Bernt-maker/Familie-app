# Familieapp – prosjektnotater

## Bakgrunn
App for å holde kontakten med Bernts mor (snart 97 år), som bor alene og er nærmeste slektning 3 mil unna. To hovedutfordringer:
- **Ensomhet** – ønsker å føle seg inkludert i familielivet
- **Teknologiangst** – krever radikalt forenklet grensesnitt

Enheter: Android-nettbrett (primær) og iPhone.

---

## Tre moduler

### 1. Familievegg (feed)
Alle familiemedlemmer kan poste bilder og korte historier. Farmor ser dem uten å gjøre noe aktivt. Støtter bilder (komprimert), tekst, hjerte-reaksjoner, kommentarer og svar på kommentarer (2 nivåer).

### 2. Minneutfordringer
Appen stiller ett spørsmål om gangen fra hennes eget liv. Hun svarer med tekst. Svarene samles som et livsarkiv synlig for hele familien i Minner-fanen.

### 3. Helse og logistikk
Kun synlig for Bernt og søstre (role: core). Daglig innsjekk, kommende avtaler, medisinoversikt.

---

## Brukerroller

| Rolle | Hvem | Tilgang |
|-------|------|---------|
| `grandma` | Mor | Familievegg (se) + Minnespørsmål (svare) + Fotoramme-modus |
| `family` | Barnebarn, oldebarn | Familievegg (poste + se) + Minnearkiv (se) |
| `core` | Bernt + 3 søstre | Alt over + Helsefanen |

---

## Teknisk stack

| Komponent | Valg |
|-----------|------|
| Frontend | React + Vite PWA |
| Hosting | Netlify (familie-app.netlify.app) |
| Backend/DB | Supabase Pro (gpjhaicgdstgrpxjkvwq) |
| Autentisering | Supabase OTP (8-sifret engangskode på e-post) |
| Bildelagring | Supabase Storage (Family-photos bucket, public) |
| Sanntid | Supabase Realtime (posts, memory_answers, health_checkins) |
| Sesjon | Persistent – forblir innlogget til man logger ut |

## Lenker
- **App:** https://familie-app.netlify.app
- **GitHub:** https://github.com/Bernt-maker/Familie-app
- **Supabase:** https://supabase.com/dashboard/project/gpjhaicgdstgrpxjkvwq

---

## Filstruktur
```
familie-app/
├── index.html
├── package.json
├── vite.config.js
├── .env.example
├── .gitignore
├── supabase-schema.sql
├── comments-schema.sql
├── delete-policy.sql
├── fix-memory-answers.sql
├── public/
│   └── manifest.json
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── supabaseClient.js
    ├── index.css
    └── components/
        ├── Login.jsx
        ├── GrandmaView.jsx
        └── FamilyView.jsx
```

---

## Databasetabeller
- `profiles` – brukere med rolle og emoji
- `posts` – innlegg på feeden (Realtime aktivert)
- `reactions` – hjerte-reaksjoner på innlegg
- `comments` – kommentarer med støtte for svar (parent_id, maks 2 nivåer)
- `memory_prompts` – spørsmål til farmor
- `memory_answers` – farmors svar, inkl. author_id (Realtime aktivert)
- `health_checkins` – daglig innsjekk (kun core, Realtime aktivert)
- `appointments` – avtaler (kun core)
- `medications` – medisiner (kun core)

---

## Status per 23. februar 2026
- [x] Konsept definert og moduler skissert
- [x] Supabase Pro opprettet og SQL-skjema kjørt
- [x] Netlify-deploy live på familie-app.netlify.app
- [x] OTP-innlogging (8-sifret kode) – holder seg i appen
- [x] Persistent sesjon – forblir innlogget til man logger ut
- [x] Feed med bilder, tekst og hjerte-reaksjoner
- [x] Bildeopplasting med automatisk komprimering (maks 1200px)
- [x] Forhåndsvisning av bilde før posting
- [x] Kommentarer og svar (2 nivåer)
- [x] Sletting – core kan slette alt, andre kun egne
- [x] Fotoramme-modus for farmor (fullskjerm lysbildefremvisning)
- [x] Varselbadges på faner – rød (feed), grønn (minner), gul (helse)
- [x] Supabase Realtime koblet til for sanntidsvarsler
- [x] Testbruker opprettet (role: family)
- [ ] Realtime-test – varsler bekreftet fungerende
- [ ] Minnesvar fra farmor bekreftet synlig i Minner-fanen
- [ ] Søstre invitert (role: core)
- [ ] Mor invitert (role: grandma)
- [ ] Minnespørsmål lagt inn i databasen

---

## Fremtidige forbedringer

### 📱 Onboarding og tilgang
- [ ] Admin-side for å invitere brukere direkte i appen (slipper å gå via Supabase)
- [ ] Forhåndsvisningsknapp for Bernt der han kan se farmors visning uten å logge ut

### 🔔 Varsler
- [ ] Push-notifikasjoner til mobil (krever service worker + FCM eller OneSignal)

### 🎙️ Tale
- [ ] Taleopptak for minnespørsmål (Web Speech API)

### 🗄️ Lagring
- [ ] Vurdere automatisk sletting av gamle innlegg ved behov
- [ ] Oppgradere Supabase-plan hvis storage-grense nås
