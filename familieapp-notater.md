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

## Status
- [x] Konsept definert
- [x] Moduler skissert
- [x] Interaktiv UI-skisse laget
- [ ] Teknisk arkitektur detaljert
- [ ] Backend-oppsett (Supabase)
- [ ] Utvikling starter
