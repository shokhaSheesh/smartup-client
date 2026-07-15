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

Default route `/` → `/login`. Login "Продолжить" → `/dashboard`. "Создать аккаунт" →
`/register`.

### App shell (post-login)

Shared **AppLayout** = dark sidebar (`#28374A`) + white topbar + content area.
- **Sidebar** (`AppSidebar` + `nav.ts`): Дашборд · Документы ▸ (Входящие/Исходящие/Черновики/
  Создать документ/Импорт Excel) · Тарифы · Товар и услуги; bottom: Support · Профиль · Войти.
  Expandable groups + **collapse toggle** (icon-only).
- **Topbar** (`AppTopbar`): balance + Пополнить, ИНН, UZ flag, notifications bell,
  company switcher (Udevs MCHJ). Collapse button on the left.

| Route                    | Screen                                   | Status  |
|--------------------------|------------------------------------------|---------|
| `/dashboard`             | Documents dashboard (full)               | ✅ done |
| `/documents/incoming`    | Входящие — document list page            | ✅ done |
| `/documents/outgoing`    | Исходящие — same list page (direction)   | ✅ done |
| `/documents/view/:id`    | Document detail (invoice render)         | ✅ done |
| `/documents/create`      | Create document form                     | ✅ done |
| `/documents/drafts`      | Черновики — drafts list                  | ✅ done |
| `/documents/import`      | Импорт Excel — import cards              | ✅ done |
| `/tariffs`               | Биллинг — plans/cards/history/invoices   | ✅ done |
| `/tariffs/add-card`      | Add card form                            | ✅ done |
| `/tariffs/topup`         | Top-up balance (payment methods)         | ✅ done |
| `/products`              | Товар и услуги — classifier table        | ✅ done |
| `/profile`               | Профиль — 5 tabs                         | ✅ done |
| other nav routes         | placeholder pages (await designs)        | 🟡 stub |

**Profile (`ProfilePage`):** tabs — **Персональные данные** (avatar + fields + Change password
modal with rules), **Филиалы** (add form + branch list with edit/delete), **Реквизиты**
(org fields two-col + Обновить с НК / Сохранить), **Доступы** (roles table + role-edit modal
with the permissions multi-select), **Журнал логов** (activity table). Mock in `data/profile.ts`.

**Products (`ProductsPage`):** toolbar (search-by-code, search + green Добавить, Очистить),
table (# / Классификатор коди / названия / Единица измерения / штрих код) with per-row
delete + pagination; Добавить opens a modal to add a row. Mock in `data/mockProducts.ts`.

**Billing (`BillingPage`):** header (ID, active-until, Пополнить баланс), balance card +
summary tiles, **current-subscription card** (added — plan badge, renew date, document-usage
progress, users/integration), tabs **Тарифы** (4 plan cards, current one highlighted +
"Ваш тариф") / **Карты** (list + edit/delete + Добавить карту) / **История** (payments).
Choosing a plan opens a **checkout modal** (plan summary + payment method balance/card, no
points field) → activates the plan live + toast. Sub-pages: `AddCardPage` (card #, MM/YY),
`TopUpBalancePage` (amount + Payme/Octobank/Paynet/Click/Мои карты). Mock in `data/billing.ts`.

**Drafts (`DraftsPage`):** search/filter/pagination like the list page, columns Номер и дата
док / Статус / Тип / Контрагент / Номер и дата договора / Стоимость / Стоимость с НДС; rows
open detail; row menu Подписать/Скачать/Удалить.
**Import (`ImportExcelPage`):** cards (Счета-фактуры / ТТН / Гибридная / Произвольный) each
with a working file picker (accepts .xls/.xlsx/.csv) → toast.

**Create document (`CreateDocumentPage`):** type + variant PillSelects, header fields
(numbers/dates/contract), Ваши сведения / Доверенность / Сведения партнера sections, and a
line-items table with **add/delete rows + live totals** (qty×price → supply, VAT %, row
total, Итого). Flag checkboxes (Обратный расчет/Акциз/…). Fields are UI; totals compute.

**Document list** has a toggleable **Фильтр** panel (`DocumentsFilterPanel`): date range,
type, number, amount range, «Есть льгота» → wired to filtering; Договор/Комиссионер/
Односторонний/Маркирован are visual-only (no backing data yet). Rows are clickable →
detail page. Создать документ button shows only on **Исходящие**.

**Document detail (`DocumentDetailPage`):** breadcrumb, header card (title, ГНК status
link, status badge, print/download, Подписать/Отказать when pending) + a faithful
СЧЁТ-ФАКТУРА render. Sign/reject updates local status (not yet synced to the list —
needs a shared store).

**Documents list page (`DocumentsListPage`, `direction` prop):** toolbar (search by ИНН,
print, download CSV, filter, green Создать документ) · status tabs with live counts
(Все/Ожидает/Подписан/Отменено) · pagination (page nav + Показать по N + total count) ·
table (Статус/Тип/Дата обновления/Контрагент/ИНН/Номер и дата/Стоимость) · per-row menu
(`RowMenu`: Подписать / Скачать / Отменить).

**Dashboard (`DashboardPage` + `features/dashboard/`):** warning banner · quick-create row
(6 doc types) · toolbar (tabs Все/Входящий/Исходящий + Дата/Тип/Статус filters + search) ·
5 stat cards · documents table (StatusBadge, select-all) · stacked bar chart · grouped bar
chart · 2 donut charts.

**Single source of truth:** `mockDocuments.ts` generates a deterministic year-long dataset
(direction/status/type/date/amount/VAT). The date/type/status filters + tabs + search drive
the **table AND all four charts** — chart data is derived from the filtered list via
`features/dashboard/selectors.ts`. Stat cards stay as static design totals. Charts use
**recharts**.

**Bulk actions:** row + "Выбрать все" checkboxes select documents. When ≥1 selected, a bulk
bar shows **Подписать** (mass-sign — flips selected `pending` docs to `signed`, updates table
+ charts, shows a toast) and **Скачать** (downloads selected rows as a UTF-8 CSV via
`lib/download.ts`). Selection clears on any filter change.

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
