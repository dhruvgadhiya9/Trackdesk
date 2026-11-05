# CLAUDE.md — TrackDesk project memory (authoritative)

TrackDesk is a multi-tenant B2B FSM SaaS, UK-first, for statutory compliance contractors
(BS 5839 fire alarms, BS 5266 emergency lighting). This file and `.cursor/rules/` are the single
source of project rules. Update them in the same PR when a convention changes.

Read first: `docs/02-architecture.md`, `docs/03-data-model.md`, `docs/10-backend-workflow.md`,
`docs/07-definition-of-done.md`, `docs/DECISIONS.md`. The playbook is `docs/PLAYBOOK.md`.

## Stack
- Monorepo: Turborepo + pnpm 10. Node 20+. Java 21.
- `apps/api` — Java 21 + Spring Boot 3.5 modular monolith (Spring Modulith), Gradle Kotlin DSL,
  version catalog `apps/api/gradle/libs.versions.toml`. JPA/Hibernate (+spatial), Flyway (only
  migration tool), MapStruct, ShedLock, Spring Security OAuth2 resource server (Supabase JWT).
- `apps/web` — Next.js 15 App Router: route groups `(owner)` `/owner`, `(ops)` `/ops`,
  `(portal-owner)` `/platform`, `(auth)`.
- `apps/customer` — Next.js customer portal. `apps/mobile` — Expo SDK 53 field worker app.
- `packages/contracts` — OpenAPI 3.1 spec (one file per module) = **single source of truth**;
  generated TS client/Zod (orval), `permissions.yaml`, mock factories.
- `packages/ui` (tokens + Tailwind preset + components + Storybook), `packages/ui-native`,
  `packages/config` (eslint, tsconfig, prettier).
- Data: Supabase Postgres + PostGIS with RLS, Supabase Auth, Realtime, Storage. UK region only.

## Commands
| Task | Command |
|---|---|
| Install | `pnpm install` |
| Local DB/Auth stack (ports 544xx) | `pnpm db:start` / `pnpm db:stop` |
| Migrate (Flyway as trackdesk_owner) | `pnpm db:migrate` |
| Seed (synthetic, local only) | `pnpm db:seed` |
| Run everything | `pnpm dev` (API: `pnpm --filter @trackdesk/api dev`) |
| Regenerate contracts | `pnpm contracts:generate` · drift check `pnpm contracts:check` |
| JS lint / typecheck / tests | `pnpm lint` · `pnpm typecheck` · `pnpm test` |
| Java build (Spotless, tests, Modulith, ArchUnit) | `cd apps/api && ./gradlew build` |
| Format Java | `cd apps/api && ./gradlew spotlessApply` |
| Tenant isolation suite | `pnpm test:isolation` (`./gradlew isolationTest`) |
| Web E2E (mock API) | `pnpm --filter @trackdesk/web e2e` |
| Storybook | `pnpm storybook` |
| Review queue check | `pnpm review-queue:check` |
| Real-stack gate smoke | `API_LOG=<api log> node scripts/gate-smoke.mjs` |

## Java package structure (per module)
```
com.trackdesk.<module>
  package-info.java         @ApplicationModule
  api/                      <Name>Controller implements contracts.api.<Name>Api  (thin)
  application/              @NamedInterface("application"): services, MapStruct mappers, query
                            interfaces for other modules, events (records)
  domain/                   entities (extend TenantScopedEntity), enums, pure rules
  infrastructure/           Spring Data repositories, adapters (ports live in application/)
```
`platform` (shared, OPEN): tenancy, security, audit, featureflags, web (errors/paging), auth,
notifications, persistence. `contracts` (OPEN): generated code — never edit.
**Reference module: `com.trackdesk.customers`** (+ `CustomersApiIT`, `CrossTenantApiTest`,
`apps/web/features/customers/CustomersScreen.tsx`, `apps/web/e2e/customers.spec.ts`). Copy it.

## Naming
- Tables snake_case singular (`work_order`); Java entities PascalCase; DTOs are generated with
  suffix `Dto`; operationIds camelCase verbs (`listCustomers`) = Java method names.
- Permissions `resource:action` in `permissions.yaml` → `Permission.RESOURCE_ACTION`.
- Migrations `V<n>__<module>.sql`; repeatable `R__*.sql` only for generated reference data.
- Tests: `*UnitTest` (pure), `*ApiIT` (Testcontainers), isolation tests tagged `isolation`.
- TS: components PascalCase in `packages/ui/src/components`; screens in `apps/web/features/<area>/`.

## Rules (non-negotiable)
1. **Spec before code**: PRD + Gherkin (`docs/prd/`) and the OpenAPI contract first.
2. **Contract-first**: edit `packages/contracts/openapi/*.yaml`, run `pnpm contracts:generate`.
   Every operation has `x-roles` and `x-permission`. Controllers MUST implement the generated
   interface (ArchUnit enforces). Unimplemented operations return 501 via the generated default.
3. **Tenant isolation**: every tenant table has `tenant_id`, `unique (tenant_id, id)`, composite
   same-tenant FKs, an index leading with `tenant_id`, `ENABLE` + `FORCE ROW LEVEL SECURITY`,
   explicit select/insert/update/delete policies (writes also check `app_has_permission`), explicit
   grants to `trackdesk_app`, and a row for A and B in `src/test/resources/isolation/seed.sql`.
   RLS settings come only from `TenantContext` via `TenantAwareJpaTransactionManager`
   (`set_config(..., true)` per transaction). Never bypass, never set TenantContext from input.
4. **Tests ship with every change**: unit + API integration test per Gherkin scenario + a
   `@Covers` cross-tenant test in `CrossTenantApiTest` for every implemented endpoint (enforced).
5. **Design system first**: UI only from `@trackdesk/ui` / `@trackdesk/ui-native` and tokens.
   Loading, empty and error states on every data screen. Test at 1280 and 1440.
6. **Human gate**: you draft, humans approve. Mark security-sensitive code (below).

## Forbidden
- Raw SQL / native queries / `JdbcTemplate` outside repository classes (`infrastructure/` or
  `@Repository`) and `platform.tenancy` — Flyway migrations excepted. (ArchUnit)
- Secrets, API keys, real customer data in code, tests, fixtures or docs. Use `*.example` files
  and synthetic data (`example.test` emails).
- A tenant-scoped table without tenant_id + index + RLS policies (+ seed row).
- Repository access from controllers; cross-module access to another module's `domain`/
  `infrastructure` (only its `application` interface or events). (Modulith + ArchUnit)
- Hard-coded colours, font sizes, spacing, radii; raw hex/rgb; arbitrary Tailwind values like
  `p-[13px]` (lint rule `design-tokens/no-raw-design-values`). Only `packages/ui/src/tokens.ts`
  holds raw values (generated from Figma).
- New dependencies without a line in the dependency register (`docs/02-architecture.md` §11).
- Deploying to production, configuring production secrets, marking security/payment/compliance
  logic "approved".

## Security-review marking
Anything touching tenant isolation, auth, role permissions, payments/refunds, location data or
consent, or compliance certificates gets a `// SECURITY-REVIEW-REQUIRED: <why>` (or `--` in SQL,
`#` in YAML) comment and an entry in `docs/REVIEW-QUEUE.md`. `pnpm review-queue:check` fails CI
if a marked file is not listed.

## Definition of Done
See `docs/07-definition-of-done.md` (mirrored in the PR template). Human-only items: designer
sign-off, device testing, product acceptance, security/payment/compliance approval.

## Gotchas
- After onboarding or accepting an invite, the client must refresh its Supabase session to get a
  JWT with `app_metadata.tenant_id/role`.
- Generated enums use wire values (`"active"`); `WebConfig` converts query params via `fromValue`.
- MapStruct uses constructor injection (Modulith rejects field injection).
- Local Supabase uses ports 544xx (API 54421, DB 54422) to coexist with other projects.
- On Windows run Gradle via `node scripts/gradlew.mjs` or `apps/api/gradlew.bat`.
