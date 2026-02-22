# Familieapp – prosjektnotater

## Bakgrunn
App for å holde kontakten med Bernts mor (snart 97 år), som bor alene og er nærmeste slektning 3 mil unna. To hovedutfordringer:
- **Ensomhet** – ønsker å føle seg inkludert i familielivet
- **Teknologiangst** – krever radikalt forenklet grensesnitt

Enheter: Android-nettbrett (primær) og iPhone.

---

## Tre moduler

### 1. Familievegg (feed)
Alle familiemedlemmer (barn, barnebarn, oldebarn) kan poste bilder og korte historier. Farmor ser dem uten å måtte gjøre noe aktivt. Støtter bilder, tekst, hjerte-reaksjoner og kommentarer med svar.

### 2. Minneutfordringer
Appen stiller ett spørsmål om gangen fra hennes eget liv. Hun svarer med tekst eller tale. Svarene samles som et livsarkiv synlig for hele familien.

### 3. Helse og logistikk
Kun synlig for Bernt og søstre (role: core). Daglig innsjekk, kommende avtaler, medisinoversikt.

---

## Brukerroller

| Rolle | Hvem | Tilgang |
|-------|------|---------|
| `grandma` | Mor | Familievegg (se) + Minnespørsmål (svare) |
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
- `posts` – innlegg på feeden
- `reactions` – hjerte-reaksjoner på innlegg
- `comments` – kommentarer med støtte for svar (parent_id, maks 2 nivåer)
- `memory_prompts` – spørsmål til farmor
- `memory_answers` – farmors svar
- `health_checkins` – daglig innsjekk (kun core)
- `appointments` – avtaler (kun core)
- `medications` – medisiner (kun core)

---

## Status per 22. februar 2026
- [x] Konsept definert og moduler skissert
- [x] Interaktiv UI-skisse laget
- [x] Supabase Pro opprettet og SQL-skjema kjørt
- [x] Alle filer lastet opp til GitHub
- [x] Netlify-deploy live på familie-app.netlify.app
- [x] Bernt innlogget med role: core
- [x] Tekst-innlegg og hjerte-reaksjoner fungerer
- [x] Bildeopplasting fungerer
- [x] OTP-innlogging (8-sifret kode) – holder seg i appen
- [x] Persistent sesjon – forblir innlogget til man logger ut
- [x] Kommentarer og svar på innlegg (2 nivåer)
- [ ] Søstre invitert og profiler opprettet (role: core)
- [ ] Mor invitert og profil opprettet (role: grandma)
- [ ] Teste farmors visning på nettbrett
- [ ] Teste minnespørsmål

---

## Fremtidige forbedringer

### 🗑️ Sletting av innlegg og kommentarer
- Bernt (core) skal kunne slette alt
- Andre brukere skal kun slette egne innlegg/kommentarer
- Krever slett-knapp i UI og RLS-policy på posts-tabellen

### 🗄️ Bildelagring
- Komprimere bilder før opplasting (client-side resize)
- Maks bildestørrelse per fil (f.eks. 2 MB)
- Vurdere automatisk sletting av gamle innlegg

### 📱 Andre ideer
- [ ] Taleopptak for minnespørsmål (Web Speech API)
- [ ] Automatisk fotoramme-modus i farmors visning
- [ ] Push-notifikasjoner for daglig åpning
- [ ] Onboarding-guide for farmor
- [ ] Admin-side for å invitere brukere direkte i appen
