## PR: Day 1 — Norwegian Lead-Gen MVP (UI + API stubs + Seed)

### What changed
- New route `'/leads'`: søkefiltre (nøkkelord, kategori, by, radius), signal‑brytere (ansettelser, annonser, nyåpnet, min rating/anmeldelser), resultattabell med valg, score‑kolonne og CSV‑eksport.
- API stubs: `POST /api/leads` (validering med Zod, returnerer filtrerte seed/mock‑data) og `GET /api/jobs/[id]` (returnerer status `done`).
- Database: Prisma + Postgres minimale modeller (`Company`, `Lead`, `Job`) og seed med 5 norske bedrifter.
- Lokaliseringspolish: nb-NO for tallformat i UI.
- Config: Krever kun `DATABASE_URL`. API har mock‑fallback om DB er tom/ikke migrert.

### How to run locally
1. Sett `DATABASE_URL` i `.env` (Postgres). Eks: `postgresql://user:pass@localhost:5432/allvitr`.
2. Installer og generer klient: `npm i && npx prisma generate`.
3. Kjør migrering i dev eller deploy: `npx prisma migrate dev` (lokalt) eller `npm run prisma:migrate` (deploy). Valgfritt: seed `npm run db:seed`.
4. Start: `npm run dev` og åpne `http://localhost:3000/leads`.

### What to test
1. Åpne `'/leads'` – tabellen viser seed/mock‑resultater.
2. Søk med filtre, bekreft at `POST /api/leads` kalles og at tabellen oppdateres.
3. Velg noen rader og klikk «Eksporter» – nedlastet CSV skal inneholde kun valgte rader.
4. Hent `GET /api/jobs/123` – skal returnere `{ id: '123', status: 'done' }`.

### Vercel
- Deploy til Vercel Preview. Kun `DATABASE_URL` er nødvendig. `POST /api/leads` fungerer med mock‑fallback hvis databasen ikke er migrert/seedet ennå.
# Market Research
