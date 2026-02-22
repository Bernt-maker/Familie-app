# Familieapp – prosjektnotater

## Bakgrunn
App for å holde kontakten med Bernts mor (snart 97 år), som bor alene og er nærmeste slektning 3 mil unna. To hovedutfordringer:
- **Ensomhet** – ønsker å føle seg inkludert i familielivet
- **Teknologiangst** – krever radikalt forenklet grensesnitt

Enheter: Android-nettbrett (primær) og iPhone.

---

## Tre moduler

### 1. Familievegg (feed)
- Alle familiemedlemmer (barn, barnebarn, oldebarn) kan poste bilder og korte historier
- Farmor ser dem uten å måtte gjøre noe aktivt – bare scrolle
- Mulig utvidelse: automatisk fotoramme-modus som blar gjennom bilder

### 2. Minneutfordringer
- Appen stiller ett spørsmål om gangen fra hennes eget liv
- Hun kan svare med tekst eller tale (Web Speech API)
- Svarene samles som et livsarkiv synlig for hele familien
- Eksempelspørsmål: «Hva var favorittmaten din som barn?», «Husker du første dagen på skolen?»

### 3. Helse og logistikk
- Delt mellom Bernt og søstre (ikke synlig for farmor i første versjon)
- Daglig innsjekk: Hvordan har hun det?
- Kommende avtaler: hvem kjører, hvem henter
- Medisinoversikt: tatt morgen/kveld

---

## To visninger

### Farmors visning
- Ingen navigasjon eller menyer
- Stor hilsen med dato øverst
- Bilder fra familien med stor tekst
- Tre store, tydelige knapper: Dagens spørsmål / Helse og avtaler / Ring Bernt
- Mulig: push-notifikasjon for å åpne appen daglig

### Familievisning
- Tre faner: Feed / Minner / Helse
- Feed med reaksjoner (hjerte, svar)
- Minnefane viser dagens spørsmål + arkiv av farmors svar
- Helsefane med innsjekk, avtaler, medisiner

---

## Teknisk plan

| Komponent | Valg |
|-----------|------|
| Frontend | React PWA |
| Hosting | Netlify |
| Backend/DB | Supabase (flerbruker, sanntid, bildeopplasting) |
| Autentisering | Supabase Auth (enkel e-post/lenke for farmor) |
| Tale-input | Web Speech API |
| Push-varsler | PWA Push Notifications |

---

## Design
- Stil: Varmt og boknært – inspirert av familiefotoalbum
- Fonter: Playfair Display (overskrifter) + Lora (brødtekst)
- Farger: Kremhvit, varm brun, dempet grønn og rose
- Skisse laget som React-komponent (familieapp-skisse.jsx)

---

## Åpne spørsmål
- [ ] Fotoramme-modus for farmors visning – automatisk bildekarusell?
- [ ] Tale vs. tekst for minnespørsmål i første versjon?
- [ ] Push-notifikasjon for daglig åpning – hva skal den si?
- [ ] Onboarding: hvordan introdusere appen til henne trinn for trinn?
- [ ] Hvem i familien inviteres i første runde? Begrense til nærmeste?

---

## GitHub-repo
https://github.com/Bernt-maker/Familie-app

## Netlify
https://familie-app.netlify.app

## Supabase
- Prosjekt-ID: gpjhaicgdstgrpxjkvwq
- URL: https://gpjhaicgdstgrpxjkvwq.supabase.co

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

## Status
- [x] Konsept definert
- [x] Moduler skissert
- [x] Interaktiv UI-skisse laget
- [x] Teknisk arkitektur detaljert
- [x] Supabase-prosjekt opprettet og SQL-skjema kjørt
- [x] Alle filer lastet opp til GitHub
- [x] Netlify-deploy satt opp og live
- [x] Bernt innlogget med role: core
- [ ] Søstre invitert og profiler opprettet (role: core)
- [ ] Mor invitert og profil opprettet (role: grandma)
- [ ] index (7).html → index.html fikses på GitHub
- [ ] Storage bucket for bilder satt opp i Supabase
- [ ] Teste bildeopplasting i feed
- [ ] Teste minnespørsmål
- [ ] Teste helsefanen

## Neste iterasjon – ideer
- [ ] Taleopptak for minnespørsmål (Web Speech API)
- [ ] Automatisk fotoramme-modus i farmors visning
- [ ] Push-notifikasjoner for daglig åpning
- [ ] Onboarding-guide for farmor
