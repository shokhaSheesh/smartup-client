# Smartup24 Doc — Frontend Prototype

> Living doc. Kept up to date so context is never lost between sessions.
> Last updated: 2026-07-15

## 1. What we're building

**Smartup24 Doc** — a SaaS product in the **EDM (Electronic Document Management)** industry
for Uzbekistan. Comparable products: **Didox**, **E-Faktura**.

We're building the **full product frontend**. Purpose is a **working prototype** (design
already exists in Figma; the coded frontend is needed as a clickable prototype).

## 2. Ground rules (agreed with the user)

- **The design in Figma is the single source of truth.** The user provides everything —
  screens, document types, flows, copy. I do **not** invent product structure or pages.
- I build the frontend to **match the design** the user hands me (Figma → code).
- Figma export format is **not decided yet** — user will paste code and we adapt.
- **Language:** Russian (primary) for now. (Uzbek/English may come later — keep copy
  centralizable so i18n is easy to add.)
- Data is **mocked** — no real backend for the prototype. Mock data lives in `src/data/`.

## 3. Tech stack (decided)

| Concern    | Choice                          |
|------------|---------------------------------|
| Build tool | Vite 8                          |
| Framework  | React 19 + TypeScript           |
| Styling    | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Routing    | react-router-dom v7             |
| Data       | Mock (hardcoded in `src/data/`) |

## 4. Project structure

```
src/
  components/
    ui/        # reusable primitives (Button, Input, Table, Badge, ...)
    layout/    # shell: Sidebar, Topbar, PageLayout
  pages/       # one file per route/screen
  features/    # feature-scoped components (e.g. documents/, auth/)
  lib/         # helpers, formatters, constants
  types/       # shared TS types
  data/        # mock data
  App.tsx      # routes
```

Path alias: `@/` → `src/` (configured in vite.config.ts + tsconfig).

## 5. Commands

```bash
npm run dev      # dev server (HMR)
npm run build    # tsc -b && vite build  (use to verify it compiles)
npm run preview  # preview production build
```

## 6. Status

- [x] Vite + React + TS scaffold
- [x] Tailwind v4 wired up
- [x] Router shell + placeholder HomePage
- [x] Folder structure + `@/` alias
- [x] Verified: production build passes
- [ ] Receive Figma design / code from user
- [ ] Define routes & page list from design
- [ ] Build design system primitives (colors, typography, components)
- [ ] Build pages

## 7. Screens / routes (fill in from design)

_TBD — populate once the user shares the Figma design._

## 8. Document types (fill in from design)

_TBD — user will provide the list from the design (invoices / contracts / acts / etc.)._

## 9. Open questions / notes

- Figma export format still unknown — decide component-splitting strategy when first
  code arrives.
- Keep all Russian copy easy to extract later for i18n (Uzbek/English).

## 10. Changelog

- **2026-07-15** — Project initialized: scaffold, Tailwind, router, folder structure,
  tracking doc. Build verified green.
