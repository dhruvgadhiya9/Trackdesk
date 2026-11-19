# TrackDesk

Multi-tenant field service management SaaS. UI source of truth: the TrackDesk design canvas
(6 pages: Cover & Design System, Platform Owner, Company Owner, Operations Manager, Customer Portal, Field Worker).

## Status (branch `feature/fresh-start`)
| App | Design prefix | Location | State |
|---|---|---|---|
| Company Owner web | `co-` (33 boards) | `apps/web` → `/owner`, `/login`, `/forgot-password` | All screens built on **mock data** |
| Operations Manager web | `om-` (22 boards) | `apps/web` → `/ops` | All screens built on **mock data** |
| Platform Owner web | `po-` (14 boards) | `apps/web` → `/platform` | All screens built on **mock data** |
| Customer portal | `cu-` (23 boards) | `apps/customer` (port 3001) | All screens built on **mock data** |
| Field Worker mobile | `fw-` (25 boards) | `apps/mobile` (Expo SDK 58, expo-router) | All screens built on **mock data** |
| Backend API | — | `apps/api` (Java 21 / Spring Boot) | Not started — JDK 21 required |

## Run
```bash
pnpm install
pnpm --filter @trackdesk/web dev     # http://localhost:3000 → /login (pick the workspace on the login page; any email/password works — mock auth)
pnpm --filter @trackdesk/web build
pnpm --filter @trackdesk/customer dev  # customer portal on http://localhost:3001 (mock auth)
pnpm --filter @trackdesk/mobile start   # Expo dev server — scan the QR with Expo Go (SDK 58)
pnpm -r run lint && pnpm -r run typecheck   # turbo also works where its native binary runs
```

## Layout
- `packages/ui` — design tokens (`src/styles.css`, Tailwind v4 `@theme`) and shared components (incl. StatusBadge, FormSection, AuthLayout, useQuery) used by both web apps.
  Raw colours live **only** in `styles.css` (ESLint blocks hex/rgb elsewhere).
- `apps/web/lib/mock.ts` — synthetic data transcribed from the design. `lib/api.ts` is the only
  data access layer: replace its function bodies with real API calls when the backend exists.
- `apps/web/components/ListScreen.tsx` / `FormLayout.tsx` — list (search, filters, tabs, pagination,
  loading/empty/error states, delete confirm) and numbered-section form patterns used by most screens.
- `packages/tokens` — the same design tokens as plain TS values for React Native. Keep in sync with `packages/ui/src/styles.css`.
- `apps/mobile` — Expo Router app: `(tabs)` Home/Jobs/Attendance/Chat/Profile, `job/[id]/*` job flow
  (accept → navigate → start → execution → checklist + proof → Happy Code), shared state in `src/lib/store.tsx`.
  Mock sign-in: any username/password. Demo Happy Code: `582471`.

## Notes
- `CLAUDE.md` still mentions Expo SDK 53; the app was scaffolded on the current SDK (58) so it runs in today's Expo Go.
- On this Windows machine the `turbo` binary fails to start (STATUS_DLL_NOT_FOUND — likely missing VC++ runtime);
  use `pnpm -r run <task>` until that is fixed.
