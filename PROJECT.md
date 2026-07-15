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

## 3a. Design tokens

From Figma the only custom colors are (rest are stock Tailwind: gray/slate/neutral):

| Token         | Class usage           | Value (approx from design) |
|---------------|-----------------------|----------------------------|
| Smart-blue    | `bg-Smart-blue`, primary button, brand blue | `#1B9CD8` |
| Smart-green   | `text-Smart-green`, links, logo accent      | `#43B02A` |

Font: **Inter** (via `@fontsource/inter`). Icons: **lucide-react**.
Tailwind v4 theme tokens are defined in `src/index.css` under `@theme` — the Figma classes
`bg-Smart-blue` / `text-Smart-green` work verbatim.

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

### Auth flow

**Registration flow (multi-step):**
1. **Register** (`/register`) — user picks their **E-IMZO (ЭЦП) key** OR **USB Token** (tab
   toggle), selects the key from a dropdown, enters phone number, accepts the offer
   (oferta) checkbox → **Продолжить**.
2. **OTP** — user types the one-time code sent to their phone.
3. **Set login/password** — user creates login + password.
4. → redirected back to **Login** page, where they can sign in with either their **key**
   or their **login/password**.

| Route         | Screen                | Status      |
|---------------|-----------------------|-------------|
| `/register`          | Create account (step 1: key + phone) | ✅ done   |
| `/register/otp`      | OTP step (4-digit + resend timer)    | ✅ done   |
| `/register/credentials` | Set password (+ confirm, rules)   | ✅ done   |
| `/login`             | Login — 3 tabs: ЭЦП / По паролю / USB Токен | ✅ done |
| `/dashboard`         | App shell / dashboard (placeholder stub)    | 🟡 stub |

Default route `/` → `/login`. Login "Продолжить" → `/dashboard` (stub until the app
shell design arrives). "Создать аккаунт" → `/register`.

**Note:** design only provided the **ЭЦП** login tab. "По паролю" (**ИНН/ПИНФЛ** + password) and
"USB Токен" (token select) tabs were implemented from the documented flow — swap for exact
Figma when available.

Auth pages share an **AuthLayout**: branded blue background (corner brackets + document
watermark texture), smartup logo top-left, language selector top-right (Русский /
Узбекский / Английский), footer (Публичная оферта · О нас · Обратная связь + social icons).

## 8. Document types (fill in from design)

_TBD — user will provide the list from the design (invoices / contracts / acts / etc.)._

## 9. Open questions / notes

- Figma export format still unknown — decide component-splitting strategy when first
  code arrives.
- Keep all Russian copy easy to extract later for i18n (Uzbek/English).

## 10. Changelog

- **2026-07-15** — Project initialized: scaffold, Tailwind, router, folder structure,
  tracking doc. Build verified green.
