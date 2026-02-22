# Familieapp – prosjektnotater

## Bakgrunn
App for å holde kontakten med Bernts mor (snart 97 år), som bor alene og er nærmeste slektning 3 mil unna. To hovedutfordringer:
- **Ensomhet** – ønsker å føle seg inkludert i familielivet
- **Teknologiangst** – krever radikalt forenklet grensesnitt

Enheter: Android-nettbrett (primær) og iPhone.

---

## Tre moduler

### 1. Familievegg (feed)
Alle familiemedlemmer (barn, barnebarn, oldebarn) kan poste bilder og korte historier. Farmor ser dem uten å måtte gjøre noe aktivt.

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
| Backend/DB | Supabase (gpjhaicgdstgrpxjkvwq) |
| Autentisering | Supabase Magic Link (e-post) |
| Bildelagring | Supabase Storage (Family-photos bucket, public) |

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

## Status per 22. februar 2026
- [x] Konsept definert og moduler skissert
- [x] Interaktiv UI-skisse laget
- [x] Supabase-prosjekt opprettet og SQL-skjema kjørt
- [x] Alle filer lastet opp til GitHub
- [x] Netlify-deploy live på familie-app.netlify.app
- [x] Bernt innlogget med role: core
- [x] Tekst-innlegg og hjerte-reaksjoner fungerer
- [x] Bildeopplasting fungerer (Family-photos bucket, public)
- [ ] Søstre invitert og profiler opprettet (role: core)
- [ ] Mor invitert og profil opprettet (role: grandma)
- [ ] Teste farmors visning på nettbrett
- [ ] Teste minnespørsmål

---

## Kjente problemer og fremtidige forbedringer

### 🔐 Innlogging
- Magic link blokkeres av rate limiting ved mange forsøk på rad
- Mulige løsninger å utforske:
  - Lengre sesjon (Supabase → Authentication → Settings → JWT expiry, sett til 30 dager)
  - PIN-kode-innlogging for farmor i stedet for e-post
  - «Husk meg»-funksjon som holder sesjonen aktiv lenge

### 🗄️ Bildelagring
- Gratis Supabase-plan gir 1 GB storage – kan bli lite over tid
- Tiltak å vurdere:
  - Komprimere bilder før opplasting (client-side resize)
  - Maks bildestørrelse per fil (f.eks. 2 MB)
  - Automatisk slette gamle innlegg etter X måneder
  - Oppgradere Supabase-plan ved behov ($25/mnd for 100 GB)

### 🗑️ Sletting av innlegg
- Bernt (core) skal kunne slette alle innlegg
- Andre brukere skal kun slette egne innlegg
- Krever endring i RLS-policy og slett-knapp i UI

### 📱 Andre ideer
- [ ] Taleopptak for minnespørsmål (Web Speech API)
- [ ] Automatisk fotoramme-modus i farmors visning
- [ ] Push-notifikasjoner for daglig åpning
- [ ] Onboarding-guide for farmor
