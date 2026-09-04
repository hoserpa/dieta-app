# AGENTS.md — Dieta & Compra

## What this is

Mobile-first diet + shopping list app for two private users. React + TypeScript + Vite, Supabase backend (Auth + PostgreSQL + RLS), deployed to GitHub Pages via GitHub Actions.

**Status:** Phase 1 complete — scaffold, tooling, CI/CD in place. Phases 2–10 remaining.

## Key files

- `SPECS.md` — Full architecture spec, data model, UI requirements, security rules, import flow. Read this first for anything non-obvious.
- `CODESTYLE.md` — **Mandatory** code conventions. Spanish-language codebase, strict layering, strict TypeScript.
- `STYLE.md` — "Newsprint" visual design system (typography, colors, components, layout).
- `ROADMAP.md` — Implementation phases (Fase 1–10) and MVP acceptance checklist.
- `plan_semanal_comidas.json` — Source diet data (weekly meal plan, two people, per-person portions).
- `lista_compra.json` — Source shopping list data.

## Non-obvious conventions

- **All code, variable names, comments, and file names in Spanish.** No mixing: if a concept is `Comida`, everything uses `Comida`, never `Meal`. See `CODESTYLE.md:9`.
- **Strict layer separation:** UI (`components/`, `pages/`) → Domain (`domain/`) → Data (`data/`). No component ever calls Supabase directly.
- **No dark mode.** Design is light-only newsprint aesthetic. Zero border-radius everywhere.
- **HashRouter** (not BrowserRouter) for GitHub Pages SPA compatibility. Routes: `/#/login`, `/#/app/dieta`, `/#/app/compra`.
- **Two pre-created users only.** No public registration. Accounts created manually in Supabase Auth.
- **Supabase `service_role` key must never appear in frontend code**, even during development.
- JSON files in repo root are **import source only** — never bundled into `dist/` or `public/`.

## When code exists

- Build: `npm run build`
- Lint: `npm run lint` (oxlint)
- Typecheck: `npm run typecheck`
- Tests: `npm run test:run` (vitest)
- Format: `npm run format` (prettier)
- Dev server: `npm run dev`
- CI order: `lint → typecheck → tests → build`
- Deploy is automatic on merge to `main`
- Path alias: `@/` maps to `src/`
- Tests: Vitest + Testing Library (unit/components), Playwright (E2E)
- Env vars: only `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`

## Implementation order

Follow `ROADMAP.md` phases. Do not skip ahead — each phase depends on the previous. Start with Phase 1 (Vite + React + TS scaffold, ESLint, Prettier, GitHub Actions, GitHub Pages config).
