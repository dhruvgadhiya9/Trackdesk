# Decision Log

Format: ID · date · decision · context · alternatives · consequences · status.
Decisions marked **(conservative default)** were taken by Claude Code where the playbook was
ambiguous or unavailable; a human should confirm or reverse them.

---

## D-001 · 2026-11-06 · Backend = Java 21 + Spring Boot; contracts = OpenAPI-first
- **Decision:** Replace the playbook's NestJS backend with a Java 21 / Spring Boot 3.5 modular
  monolith (Spring Modulith). Replace Zod-first contracts with an OpenAPI 3.1 spec in
  `packages/contracts/openapi/` as the single source of truth.
- **Generated from the spec:** Java API interfaces + DTOs (openapi-generator `spring`,
  `interfaceOnly=true`, `useSpringBoot3=true`, Jakarta validation); TypeScript types, Zod
  schemas and typed client (orval) for web and mobile.
- **Why:** The playbook allows another backend framework as long as there is one contracts
  source and one rules file. Generating both sides from one spec keeps that rule.
- **Consequences:** CI must fail when generated code drifts from the spec (`contracts:check`).
  Controllers *implement* generated interfaces, so signature drift is a compile error.
- **Status:** Accepted (prompt pack instruction). Needs Tech Lead acknowledgement.

## D-002 · 2026-11-06 · Playbook text unavailable at bootstrap (conservative default)
- `docs/PLAYBOOK.md` was not present when Sprint 0 was generated. All docs were built from the
  prompt pack. Tables meant to be copied "exactly" from the playbook (team, RACI, phase plan,
  risks, DoD) are drafts marked `TODO(playbook)`.
- **Action:** Paste the playbook and reconcile.

## D-003 · 2026-11-06 · Dependency majors pinned to known-stable lines (conservative default)
- Next.js 15.5, React 19, TypeScript 5.9, Tailwind CSS 3.4 (JS preset support), ESLint 9 flat
  config, Vitest 3, Storybook 8.6, Expo SDK 53 / React Native 0.79, Zod 3, orval 7, Turborepo 2.
- Java: Spring Boot 3.5.x (latest 3.x as instructed), Spring Modulith 1.4, Gradle 8.14,
  openapi-generator 7.14, MapStruct 1.6, ShedLock 6, ArchUnit 1.4.
- **Why:** Newer majors exist (Next 16, TS 7, Tailwind 4, Expo 58, Boot 4). Tailwind 4 drops JS
  presets, which the prompt pack requires. Boot 4 isn't "3.x". The newer front-end majors can be
  upgraded later in one go, with a test pass.

## D-004 · 2026-11-06 · Tenant context comes from Supabase JWT `app_metadata`
- `tenant_id` and `role` are read from `app_metadata.tenant_id` / `app_metadata.role`
  (server-writable only; users can't edit `app_metadata`). `user_id` = `sub`.
- A user belongs to exactly one tenant in v1 (conservative). Multi-tenant membership is deferred.

## D-005 · 2026-11-06 · RLS session variables set per transaction (conservative default)
- `TenantAwareDataSource` wraps the pool. On each connection checkout it runs
  `select set_config('app.tenant_id', ?, false)` plus `app.user_id` and `app.role`. On return it
  calls `reset`.
- The prompt pack asks for `set_config(..., true)` (transaction-local) *at the start of every
  transaction*. The `TenantTransactionListener` does that inside each Spring transaction. The
  connection-level set is defence in depth, cleared on release. **Policies fail closed:** with no
  setting, `current_setting('app.tenant_id', true)` is NULL and no rows match.
- `SECURITY-REVIEW-REQUIRED`.

## D-006 · 2026-11-06 · API DB role
- The API connects as `trackdesk_app` (`NOLOGIN` grant role + `LOGIN` user, **no `BYPASSRLS`,
  not table owner**). Flyway runs as the owner role `trackdesk_owner`. Tables use
  `FORCE ROW LEVEL SECURITY` so even the owner is subject to RLS outside migrations.

## D-007 · 2026-11-06 · Permission matrix single source
- `packages/contracts/permissions.yaml` → `scripts/gen-permissions.mjs` →
  `apps/api/.../security/Permission.java` + `packages/contracts/src/permissions.ts` +
  `apps/api/src/main/resources/db/migration/R__role_permissions.sql` (a repeatable migration
  that seeds `role_permission`, which RLS helper `app_has_permission()` reads).

## D-008 · 2026-11-06 · Billing route undecided
- Stripe direct vs merchant of record is a human decision (scope statement). Both adapters exist:
  `StripePaymentGateway` (test mode) and `MerchantOfRecordPaymentGateway` (stub).

## D-009 · 2026-11-06 · Supabase CLI as devDependency
- The Supabase CLI is a root devDependency (`pnpm supabase …`) rather than a global install.
  Flyway, not Supabase migrations, owns the schema. `supabase/migrations` stays empty apart
  from the Supabase-specific bootstrap (roles).

## D-010 · 2026-11-06 · Audit log is append-only via DB grants + trigger
- `audit_event`: the app role has `INSERT, SELECT` only, and a trigger rejects UPDATE/DELETE.
