# TrackDesk

Multi-tenant field service management SaaS. UI source of truth: the TrackDesk design canvas
(6 pages: Cover & Design System, Platform Owner, Company Owner, Operations Manager, Customer Portal, Field Worker).

## Status (branch `feature/fresh-start`)
| App | Design prefix | Location | State |
|---|---|---|---|
| Company Owner web | `co-` (33 boards) | `apps/web` → `/owner`, `/login`, `/forgot-password` | All screens built on **mock data** |
| Operations Manager web | `om-` (22 boards) | `apps/web` → `/ops` | All screens built on **mock data** |
| Platform Owner web | `po-` (14 boards) | `apps/web` → `/platform` | All screens built on **mock data** |
| Customer portal | `cu-` | `apps/customer` | Not started |
| Field Worker mobile | `fw-` | `apps/mobile` (Expo) | Not started |
| Backend API | — | `apps/api` (Java 21 / Spring Boot) | Not started — JDK 21 required |

## Run
```bash
pnpm install
pnpm --filter @trackdesk/web dev     # http://localhost:3000 → /login (pick the workspace on the login page; any email/password works — mock auth)
pnpm --filter @trackdesk/web build
pnpm lint && pnpm typecheck
```

## Layout
- `packages/ui` — design tokens (`src/styles.css`, Tailwind v4 `@theme`) and shared components.
  Raw colours live **only** in `styles.css` (ESLint blocks hex/rgb elsewhere).
- `apps/web/lib/mock.ts` — synthetic data transcribed from the design. `lib/api.ts` is the only
  data access layer: replace its function bodies with real API calls when the backend exists.
- `apps/web/components/ListScreen.tsx` / `FormLayout.tsx` — list (search, filters, tabs, pagination,
  loading/empty/error states, delete confirm) and numbered-section form patterns used by most screens.
