# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
npm install

# Run development server (Express + Vite HMR on port 3000)
npm run dev

# Type-check without emitting
npm run lint

# Production build (outputs to dist/)
npm run build

# Deploy to GitHub Pages
npm run deploy
```

There are no test files in this project.

## Environment Setup

Copy `.env.example` to `.env` and fill in `GEMINI_API_KEY` (from Google AI Studio). The `APP_URL` variable is injected automatically in cloud environments.

## Architecture

This is a **React 19 + TypeScript + Vite** SPA with a thin **Express** backend, all served from a single `server.ts` entry point. The Vite dev server is embedded inside Express (not a separate process).

### Key architectural pattern

`App.tsx` drives a simple state machine:
1. **Unauthenticated + no auth modal** → renders `<LandingView>`
2. **Unauthenticated + auth modal open** → renders `<AuthView>`
3. **Authenticated** → renders the shell (Sidebar + Header + main area)

Inside the authenticated shell, `currentRole` (`"user"` | `"admin"` | `"docs"`) and `currentTab` (string) determine what's rendered. Role switching happens from the Sidebar — there is no real auth backend; login just sets the in-memory role.

### View routing

Tab navigation is done by string IDs, not a router library:
- `<UserDashboard currentTab={currentTab}>` — renders the correct user-facing panel based on the tab string
- `<AdminDashboard currentTab={currentTab}>` — same pattern for admin panels
- `<ArchitectureDoc>` — shown when role is `"docs"`

Tab IDs are defined in `src/components/layout/Sidebar.tsx` (`userTabs` and `adminTabs` arrays).

### Backend (`server.ts`)

Express serves the Vite dev middleware (in dev) or static `dist/` (in prod). All data is **in-memory** (JavaScript arrays declared at the top of `server.ts`) — no database. Data resets on server restart. REST API endpoints follow the pattern `/api/user/*` for warga and `/api/admin/*` for pengurus.

The one real external call is to **Google Gemini** (`@google/genai`) via `POST /api/ocr-ktp` — it receives a base64 image and extracts KTP/KK fields using structured output.

### Styling system

Tailwind CSS 4 with a custom design system defined in `src/index.css` via `@theme`. The app has dark (default) and light modes toggled by adding/removing the `.light` class on `<html>`. All semantic color tokens (`--color-canvas`, `--color-primary`, `--color-accent`, etc.) resolve to different CSS variables depending on the theme class. Always use these semantic tokens (`bg-canvas`, `text-text-main`, `bg-surface`, etc.) rather than raw Tailwind colors.

The `cn()` utility from `src/lib/utils.ts` (`clsx` + `tailwind-merge`) is the standard way to compose class names conditionally.

### PDF generation

Letter PDFs are generated client-side using `jspdf` + `jspdf-autotable`. QR codes embedded in letters are for authenticity verification.

### Path alias

`@/` maps to `src/` (configured in `vite.config.ts`).
