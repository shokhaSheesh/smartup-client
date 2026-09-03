# Build Tasks: Client Dashboard API Integration

Generated from: `smartup-client/src/pages/DashboardPage.tsx`, `smartup-client/src/features/dashboard/`, and the live integration patterns in `smartup24_react_admin`
Date: 2026-09-03

## Goal and scope

Move the dashboard design from `smartup-client` into the production-connected `smartup24_react_admin` application and replace all dashboard mock data with an organization-scoped API.

The recommended ownership is:

- `smartup_core_service`: document dashboard query, tenant scoping, aggregation, pagination, and gRPC contract.
- `smartup_apigateway_service`: authenticated `GET /api/v1/dashboard` REST adapter and Swagger contract.
- `smartup24_react_admin`: API client, filters, table, charts, bulk actions, and UI states.
- `smartup-client`: design reference only; do not add a second API stack here.

The existing `GET /api/v1/documents` endpoint is not sufficient by itself: it is capped at 100 rows, does not return chart aggregates or VAT breakdowns, and public calls intentionally do not expose counterparty employee details. Loading every page in the browser would be slow and would make totals dependent on client-side pagination.

## Locked API contract

### Request

`GET /api/v1/dashboard`

| Query parameter | Type | Rule |
|---|---|---|
| `direction` | `all \| inbound \| outbound` | Default `all` |
| `document_type_id` | integer | Optional; use the existing document type catalog |
| `status` | `all \| sent \| signed \| rejected \| cancelled \| draft` | Default `all` |
| `search` | string | Document number, counterparty name, or TIN/PINFL; trimmed and length-limited |
| `from` | `YYYY-MM-DD` | Optional; must be supplied together with `to`; filters business `doc_date` |
| `to` | `YYYY-MM-DD` | Inclusive; maximum supported range for v1 is one calendar year |
| `granularity` | `day \| month` | Default `month`; use `day` for short custom ranges |
| `timezone` | IANA timezone | Default `Asia/Tashkent` |
| `limit` | integer | Default `20`, maximum `100` |
| `offset` | integer | Default `0` |

If no date range is provided, return the current calendar year in the selected timezone. The same organization visibility, counterparty selection, direction, and status rules used by `ListDocuments` must be reused rather than duplicated with different semantics.

### Response

```json
{
  "success": true,
  "data": {
    "period": {
      "from": "2026-01-01",
      "to": "2026-12-31",
      "granularity": "month",
      "timezone": "Asia/Tashkent"
    },
    "summary": {
      "all": 2603,
      "sent": 648,
      "signed": 1321,
      "rejected": 120,
      "cancelled": 514,
      "draft": 0
    },
    "documents": {
      "items": [],
      "total_count": 2603,
      "limit": 20,
      "offset": 0
    },
    "charts": {
      "status_by_period": [
        {
          "bucket": "2026-01",
          "label": "Янв",
          "sent": 0,
          "signed": 0,
          "rejected": 0,
          "cancelled": 0,
          "draft": 0
        }
      ],
      "direction_by_period": [
        { "bucket": "2026-01", "label": "Янв", "inbound": 0, "outbound": 0 }
      ],
      "accepted_by_vat": [
        { "key": "rate", "rate": "12.00", "amount_minor": 0, "currency": "UZS" }
      ],
      "not_accepted_by_status": [
        { "status": "sent", "amount_minor": 0, "currency": "UZS" },
        { "status": "rejected", "amount_minor": 0, "currency": "UZS" },
        { "status": "cancelled", "amount_minor": 0, "currency": "UZS" }
      ]
    }
  }
}
```

`documents.items` should reuse the public `DocumentListItem` fields and add only the dashboard-safe creator projection:

- `creator_name` is returned only when the creator belongs to the active organization.
- For inbound/counterparty-created documents it is empty and the UI renders `—`; do not leak a counterparty employee's identity.
- Money aggregates use integer minor units, not floating-point arithmetic.

### Filter semantics

- Direction, type, search, and date affect the summary, table, and every chart.
- Status affects the table and charts, but `summary` ignores the selected status so all status cards remain useful, matching the existing `status_counts` behavior.
- Aggregates are calculated over all matching rows; only `documents.items` is paginated.
- Empty calendar buckets are returned as zeroes so Recharts does not invent or omit axis points.
- One multilateral document is counted once even when the active organization appears in several party roles.

### Status and VAT semantics

- Frontend `pending` maps to backend `sent`.
- Keep `rejected` and `cancelled` separate; the current mock `canceled` value must not silently combine them.
- Rename the second bar chart from “incoming/outgoing products” to “incoming/outgoing documents”.
- VAT chart categories must be data-driven. Do not hardcode the prototype's old `15%` label; current rows may contain another `vat_rate`.
- Calculate VAT segments from document item amounts so a mixed-rate document is split correctly.
- `without_vat` can come from `document_items.without_vat`; a reliable “benefit” segment needs a normalized benefit field. Until a reviewed migration/backfill exists, omit that segment instead of guessing from `signed_payload`.

## Backend foundation

- [ ] **Freeze dashboard DTO and filter behavior**: Review the contract above with frontend and backend owners, especially `doc_date` bucketing, `rejected` versus `cancelled`, the one-year range cap, safe creator visibility, and whether the benefit segment is required for v1. _Creates: shared API contract; reuses: `ListDocumentsRequest`, `DocumentStatusCounts`, `DocumentListItem` concepts._

- [ ] **Add the versioned gRPC dashboard contract**: Add `GetDashboard(GetDashboardRequest) returns (GetDashboardResponse)` and typed period, summary, document page, status bucket, direction bucket, and money segment messages to `document/v1/document.proto`; keep request/response wrappers and append field numbers without reusing old tags. Run `make proto-gen` in the edited `smartup_protos` submodule, commit/push it there, pull the submodule update into gateway/core, then run `go mod tidy && go mod vendor` as required by workspace rules. _Creates: proto messages and generated clients; modifies: `DocumentService`; reuses: document status and list-item models where practical._

- [ ] **Extract one organization-scoped document filter**: Refactor the existing list query helpers so dashboard and `ListDocuments` share `documentListVisiblePartyJoin`, `documentListPartnerJoin`, `documentListStatusExpr`, type/direction/search/date predicates, and distinct-document behavior. Prove the existing list response is unchanged before adding aggregates. _Modifies: `smartup_core_service/storage/postgres/document_list.go`; reuses: current SQL visibility/status logic._

- [ ] **Implement the core dashboard vertical slice**: Add a focused repository method and gRPC service method that resolve the caller's active organization exactly like `ListDocuments`, validate bounded filters, return a paginated recent-document page, and compute summary plus both count charts in explicit parameterized PostgreSQL queries. Queries must receive `context.Context`, close/check rows, and return wrapped errors; gRPC must translate validation and missing active-organization cases to specific status codes. _Creates: dashboard repository/service files and small consumed interfaces only where tests need them; reuses: core database, organization resolver, list filters, money conversion helpers._

- [ ] **Add VAT and non-accepted money aggregates**: Aggregate signed item totals by `without_vat` and dynamic `vat_rate`, aggregate `sent/rejected/cancelled` document totals by canonical status, and prevent item joins from multiplying document-level totals. If “benefit” is accepted into v1, first add a separately reviewed normalized field and backfill plan; do not parse arbitrary payload JSON on every dashboard request. _Modifies: core dashboard repository; reuses: `document_items` money/VAT columns and the canonical status expression._

- [ ] **Protect query performance**: Run `EXPLAIN (ANALYZE, BUFFERS)` against representative organization/year/filter cases, confirm the current document-party and document-date indexes are used, and have any proposed schema/index migration reviewed against production row counts before merging. Do not add a materialized view or cache until measurements show it is necessary. _Modifies only if measured: reviewed migrations/indexes; reuses: current PostgreSQL schema._

## Gateway API

- [ ] **Expose the authenticated REST endpoint**: Register `GET /api/v1/dashboard` inside the existing JWT-protected user API group, read `sub` and the active organization context using existing helpers, validate/normalize query parameters, call core through the existing reusable gRPC connection, and map the typed response into named REST DTOs. Never accept an organization ID from the browser. _Creates: dashboard handler and DTOs; modifies: gateway route registration; reuses: `currentUserID`, organization-scoped context, response envelope, gRPC client._

- [ ] **Publish an exact Swagger contract**: Document every query parameter, enum, default, range, bearer requirement, success DTO, `401`, `422`, and upstream failure response. Run `make swag-gen` and commit the regenerated `docs/` output with the handler. _Creates: dashboard Swagger operation and named schemas; reuses: standard success/error envelopes._

- [ ] **Add gateway contract tests**: Cover missing JWT, invalid direction/status/date/timezone/range/pagination, correct user and active-organization forwarding, successful empty and populated responses, and gRPC error mapping. Assertions should verify the observable HTTP contract, not handler internals. _Creates: table-driven `dashboard_test.go`; reuses: current handler fake-client patterns._

## React Admin integration

- [ ] **Add the typed dashboard API client**: Create `src/lib/api/dashboard.ts`, export it through `src/lib/api/index.ts`, model canonical backend statuses and money units, build query strings without empty values, and support request cancellation through the existing `apiFetch` client. Add pure mapper functions only where the chart components need a different shape. _Creates: dashboard API types/client and mapper tests; reuses: `apiFetch`, auth refresh, language header, `ApiError` handling._

- [ ] **Replace the mock dashboard read path**: Modify `smartup24_react_admin/src/pages/DashboardPage.tsx` to debounce search, request server data on filters/pagination changes, ignore stale responses, and remove `mockDocuments`, `docStats`, and client-side whole-dataset selectors from the production path. Keep `smartup-client` unchanged as the visual reference. _Modifies: `DashboardPage`; reuses: existing dashboard components, `DateRangeFilter`, `FilterMenu`, `useDocumentTypes`, `Spinner`, `Alert`, `Pagination`, and toast primitives._

- [ ] **Wire stat cards and charts to canonical data**: Make `StatCards`, `DocumentsBarChart`, `ProductsBarChart`, and `DonutCard` controlled by API response props; localize labels in the frontend while using stable API keys; render zero/empty states without NaN or broken Recharts domains; rename the products chart to documents. _Modifies: all existing dashboard visualization components; reuses: current card/chart styling and Recharts._

- [ ] **Wire the real document table**: Change `DocumentsTable` from numeric mock IDs to UUID `DocumentListItem` rows, add pagination, map `sent` to the visible “waiting” label, retain separate rejected/cancelled states, navigate a row to `/documents/view/:id`, and display safe `creator_name` or `—`. CSV download must use the real rows and localized document type names. _Modifies: `DocumentsTable`; reuses: `DocumentStatusBadge`, `Pagination`, existing document type naming, date/money formatters, and download utilities._

- [ ] **Replace fake signing with the existing bulk flow**: Remove the local `setDocs` status mutation. Allow selection/actions only for documents supported by the current backend (initially inbound `sent` documents), open the existing `BulkSignModal`, refresh dashboard data after success, enforce the existing batch limit, and disable the action when any selected row is ineligible. _Modifies: dashboard page/table selection contract; reuses: `BulkSignModal`, E-IMZO flow, current bulk endpoints, toast/error helpers._

- [ ] **Connect quick-create actions**: Map supported quick-create chips to the existing `/documents/create` flow using a stable document type ID/variant rather than display text; hide or disable types that are not supported by the real create page. _Modifies: `QuickCreateBar` and, only if needed, create-page initial selection; reuses: router and document type catalog._

## Interactions and states

- [ ] **Complete loading, error, empty, and refresh states**: Show skeleton/spinner content on first load, preserve the last successful layout during filter refresh, provide a retry action with `request_id`-aware error text, show explicit no-results content for the table and each chart, and never fall back to mock values in production. _Modifies: `DashboardPage` and dashboard cards; reuses: `Spinner`, `Alert`, `Toast`, `apiErrorText`._

- [ ] **Make filters and pagination deterministic**: Reset page and selection when a filter changes, debounce search at the existing 400 ms convention, keep `from/to` inclusive in Asia/Tashkent, and ensure one network request controls the table and charts so they cannot show different filter snapshots. _Modifies: dashboard state orchestration; reuses: documents-list debounce/pagination conventions._

- [ ] **Responsive and accessibility pass**: Preserve the current dashboard design while allowing stat cards, filter controls, table overflow, and charts to work at tablet/mobile widths; provide labels for checkboxes/icon buttons, keyboard focus states, chart text alternatives, and `aria-live` feedback for load/error/action results. _Modifies: dashboard components; reuses: design tokens and current responsive shell._

## Verification and rollout

- [ ] **Core repository/service tests**: Add table-driven and integration coverage for organization isolation, multiple matching party roles, every status family, empty buckets, timezone boundaries, type/direction/search/date filters, pagination independence, mixed VAT rates, document-level sum deduplication, creator privacy, cancelled versus rejected, and context cancellation. _Creates: source-matched Go test files; reuses: current core repository/service fixtures._

- [ ] **Frontend contract tests**: Test query serialization, API-to-chart mapping, canonical status mapping, dynamic VAT labels, empty responses, stale-request cancellation, selection eligibility, and pagination reset. Run `npm test`, `npm run lint`, and `npm run build` in `smartup24_react_admin`. _Creates: dashboard Node test files; reuses: current `node:test` setup._

- [ ] **End-to-end acceptance check**: With two organizations and seeded inbound/outbound documents, verify no cross-tenant rows or totals leak, all filters update cards/table/charts consistently, bulk accept refreshes all panels, document navigation works, and a no-data organization renders cleanly. Then run focused and full `go test ./...` in core/gateway and verify generated proto/Swagger files are committed. _Reuses: deployed API stack and existing auth/organization switching flow._

- [ ] **Roll out backend before frontend**: Deploy proto-compatible core, then gateway, verify the endpoint in staging with realistic year-sized data and request timing, and only then ship the React Admin change. A development-only mock flag may remain temporarily, but production must fail visibly instead of showing fabricated totals. _Modifies: deployment order only; reuses: existing release process._

## Definition of done

- No dashboard production import references `src/data/mockDocuments.ts` or `docStats`.
- One filtered API response drives stat cards, the paginated table, and all four charts.
- Tenant scope is derived server-side and covered by a cross-organization leakage test.
- Statuses are canonical end-to-end; `pending` exists only as a translated display label for `sent`.
- VAT rates are dynamic, money is aggregated without float arithmetic, and unsupported benefit data is not fabricated.
- Bulk signing uses the existing E-IMZO backend flow and refreshes server state.
- Core/gateway Go tests, React Admin tests/lint/build, proto generation, and Swagger generation pass.

