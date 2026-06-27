# SmartWarga — Backend Implementation Plan

Plan to move from the current **in-memory Express demo** to a real, persistent backend.

---

## 1. Current state

- **Frontend:** React 19 + Vite SPA (`src/`), served by Express.
- **Backend:** single `server-setup.ts` — all data is **in-memory JS arrays** that reset on restart.
- **Auth:** none. Role (`user`/`admin`/`docs`) is set in-memory on the client.
- **External:** Google Gemini via `/api/ocr-ktp`, `/api/user/reports/analyze-ai`, `/api/chatbot`.
- **Files:** images are base64 strings or external Unsplash URLs (not stored).

**Goal:** persistent data, real auth, durable file storage — with the smallest rewrite of the existing Express routes.

---

## 2. Hosting & stack decision

Keep the long-running Express server (avoid a serverless rewrite).

| Concern | Choice | Why |
|---|---|---|
| App host | **Railway** (or Render) | Runs `npm run build && npm start` as-is; one-click Postgres |
| Database | **Postgres** (Railway/Render managed, or Neon/Supabase) | Relational fits residents/dues/letters/elections |
| ORM | **Prisma** | Type-safe, easy migrations, fits TS codebase |
| File storage | **Supabase Storage** or **Vercel Blob** / S3 | KTP scans, payment receipts — never base64 in DB |
| Auth | **Lucia / Auth.js**, or Supabase Auth | Real login + RT-managed accounts |
| Secrets | Host env vars | `GEMINI_API_KEY`, `DATABASE_URL`, storage keys |

**Recommended baseline:** Railway + managed Postgres + Prisma + Supabase Storage.

---

## 3. Data model (Postgres / Prisma)

Derived from the current in-memory arrays.

### Core entities
- **User** — `id, name, nik(unique), email, phoneWhatsapp, passwordHash, role(WARGA|PENGURUS), rt, rw, address, status(PENDING|ACTIVE), createdAt`
- **FamilyMember** — `id, userId→User, name, relation, verified`
- **Document** (Brankas / KTP-KK) — `id, userId, type(KTP|KK), fileUrl, verified, uploadedAt`

### Administration
- **Letter** (surat) — `id, userId, type, keperluan, status(PENDING|APPROVED|REJECTED), wargaSignatureUrl, adminSignatureUrl, createdAt`
- **Report** (laporan) — `id, userId, title, description, location, category, imageUrl, isPublic, status(TERKIRIM|PROSES|SELESAI), createdAt`
- **ReportAiLabel** — `reportId(unique), category, urgency, tags[], confirmed`
- **ReportResponse** — `id, reportId, authorId, text, createdAt`

### Finance
- **Due** (iuran) — `id, userId, month, amount, status(PAID|UNPAID|PENDING), paidDate, proofUrl, proofMeta(json)`
- **Reminder** — `id, userId, message, createdAt`
- **Transaction** (kas) — `id, type(IN|OUT), category, amount, description, proofUrl, createdAt`

### Community
- **News** — `id, title, category, summary, content, imageUrl, createdAt`
- **Umkm** — `id, ownerId, name, category, phone, description, imageUrl`
- **Ad** — `id, sponsor, title, description, imageUrl, cta, link`
- **Donation** — `id, title, description, target, raised, imageUrl`
- **DonationDonor** — `id, donationId, userId, name, amount, createdAt`
- **Volunteer** — `id, eventId, userId, name, relation, createdAt`

### Election (state machine: INACTIVE→NOMINATING→VOTING→COMPLETED)
- **Election** — `id, phase, termCurrentRT, termStart, termEnd, yearsServed, winnerId, announcedAt`
- **Candidate** — `id, electionId, userId, name, visiMisi, voteCount`
- **Vote** — `id, electionId, voterId, candidateId, createdAt` — **unique(electionId, voterId)** ← enforces one-vote-per-warga at the DB level (currently only app-logic)

### System
- **Notification** — `id, userId(nullable=broadcast), title, message, category, isRead, createdAt`

---

## 4. Auth & authorization

- Email/phone + password login; passwords hashed (argon2/bcrypt).
- **PENGURUS creates/approves WARGA accounts** (matches existing "Pendaftaran Warga" + OCR flow).
- Session via httpOnly cookie (or JWT).
- Middleware: `requireAuth`, `requireRole('PENGURUS')` guarding all `/api/admin/*` routes (currently unprotected).
- Replace client-side `voterId="RES-01"` and `sender="Budi Santoso"` hardcodes with the session user.

---

## 5. File storage

- Replace base64 image payloads with **upload → URL** flow.
- Targets: KTP/KK scans, payment receipts, report photos, signatures, news images.
- Endpoint `POST /api/upload` → returns stored URL; persist only the URL in Postgres.
- Validate type/size (JPG/PNG, ≤10 MB) server-side.

---

## 6. AI integration (keep server-side)

- Gemini stays behind the backend; `GEMINI_API_KEY` in env only.
- `/api/ocr-ktp`, `/api/user/reports/analyze-ai`, `/api/chatbot` reused mostly as-is.
- Keep the **graceful no-key fallback** already added (returns `available:false`).
- Report classification (urgency/category/tags) runs async after report insert → writes `ReportAiLabel`.

---

## 7. Migration steps

1. Add **Prisma** + `schema.prisma` from §3; `prisma migrate` to create tables.
2. Write a **seed script** porting the current demo arrays into the DB.
3. Refactor `server-setup.ts` routes to use Prisma queries instead of array mutations (one resource at a time; keep response shapes identical so the frontend is untouched).
4. Add **auth** (login, session middleware, protect `/api/admin/*`).
5. Add **file upload** endpoint; switch image fields to URLs.
6. Wire frontend: replace hardcoded identities with the logged-in user; add a login screen.
7. Move secrets to env; deploy to Railway + Postgres + Storage.

---

## 8. Env vars

```
DATABASE_URL=postgres://...
GEMINI_API_KEY=...
SESSION_SECRET=...
STORAGE_BUCKET_URL=...
STORAGE_KEY=...
APP_URL=...            # already injected in cloud
```

---

## 9. Suggested phasing

- **Phase 1 (MVP persistence):** Postgres + Prisma + port all routes + seed. App behaves identically but data survives restarts.
- **Phase 2 (Auth):** real login + role guards + per-user data (votes, reports, dues tied to session user).
- **Phase 3 (Storage):** durable file uploads for documents/receipts/photos.
- **Phase 4 (Polish):** rate limits, input validation (zod), audit log, email/WA notifications.

---

## 10. Open decisions

- [ ] DB host: Railway PG vs Neon vs Supabase
- [ ] Auth lib: Lucia vs Auth.js vs Supabase Auth
- [ ] Storage: Supabase vs S3 vs Vercel Blob
- [ ] Multi-RT (tenant) support now, or single-RT for v1?
