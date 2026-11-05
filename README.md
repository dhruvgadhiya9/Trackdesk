# TrackDesk

Multi-tenant field service management for UK statutory compliance contractors (BS 5839 fire
alarms, BS 5266 emergency lighting). Monorepo: Spring Boot API, Next.js web + customer portal,
Expo field app, shared OpenAPI contracts and design system.

**Start with [`CLAUDE.md`](CLAUDE.md)** (rules + commands) and [`docs/`](docs/) (scope,
architecture, data model, PRDs, phase plan). Sprint 0 status: [`docs/GATE-REPORT-sprint0.md`](docs/GATE-REPORT-sprint0.md).

## Prerequisites
JDK 21, Node 20+, pnpm 10 (`corepack enable`), Docker. The Supabase CLI is a dev dependency
(`pnpm exec supabase`). Details: [`docs/12-tooling-setup.md`](docs/12-tooling-setup.md).

## First run
```bash
pnpm install
pnpm contracts:generate                     # OpenAPI -> TS client/Zod, permissions
pnpm db:start                               # local Supabase on ports 544xx (API 54421, DB 54422)
cp apps/api/src/main/resources/application-local.yml.example apps/api/src/main/resources/application-local.yml
#   fill service-role key from `pnpm exec supabase status`
cp apps/web/.env.example apps/web/.env.local   # fill the anon key
pnpm db:migrate                             # Flyway as trackdesk_owner
pnpm --filter @trackdesk/api dev            # API on :8080 (add --args=--server.port=8090 if 8080 is taken)
pnpm --filter @trackdesk/web dev            # http://localhost:3000
```
UI without a backend: `NEXT_PUBLIC_API_MOCKS=1 pnpm --filter @trackdesk/web dev`.

## Checks
```bash
pnpm turbo run lint typecheck test          # JS + Java (Java via apps/api/package.json)
cd apps/api && ./gradlew build              # Spotless, unit, Testcontainers, isolation, Modulith, ArchUnit
pnpm test:isolation                         # tenant-isolation suite only
pnpm --filter @trackdesk/web e2e            # Playwright (mock API) + axe
pnpm contracts:check && pnpm review-queue:check
API_URL=http://localhost:8080 API_LOG=<path to api log> node scripts/gate-smoke.mjs   # real-stack gate
```

## Layout
```
apps/api        Spring Boot modular monolith (Java 21, Gradle)     apps/web       Next.js (owner/ops/platform)
apps/customer   Next.js customer portal                             apps/mobile    Expo field worker app
packages/contracts  OpenAPI spec, permissions.yaml, generated TS, mocks
packages/ui     tokens, Tailwind preset, components, Storybook      packages/ui-native  RN components
packages/config shared eslint/tsconfig/prettier                     infra/terraform     DRAFT IaC (human applies)
supabase/       local stack config                                  docs/          playbook-derived docs
```
