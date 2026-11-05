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

## D-005 · 2026-11-06 · RLS settings written per transaction only (conservative default)
- `TenantAwareJpaTransactionManager.doBegin` runs `select set_config(?, ?, true)` for `app.tenant_id`,
  `app.user_id`, `app.role`, `app.customer_id` (+ allowed extra `app.*` capability settings) as the first
  statement of EVERY transaction, then enables the Hibernate `tenantFilter`. `is_local = true` means
  nothing survives on a pooled connection. Work outside a transaction sees NO tenant and fails closed.
- `open-in-view` is disabled so connections are only used inside transactions.
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

## D-011 · 2026-11-06 · Onboarding writes auth claims inside the DB transaction
- Company creation and invite acceptance call the Supabase Admin API (`app_metadata`) as the LAST step
  before commit, after an explicit flush. A provider failure rolls the DB back. Rare residual case:
  commit fails after the admin call succeeds, which leaves claims pointing at a missing tenant. Mitigation
  to design (Tech Lead): a reconciliation job. Listed in REVIEW-QUEUE #8.

## D-012 · 2026-11-06 · Cloud provider not decided
- Draft Terraform targets AWS eu-west-2 (ECS Fargate). GCP europe-west2 (Cloud Run) is equally valid.
  Human decision; nothing has been applied.

## D-013 · 2026-11-06 · Local Supabase uses ports 544xx
- This machine already runs another Supabase project on the default 543xx ports. TrackDesk's local stack
  uses API 54421 / DB 54422 / Studio 54423 / Inbucket 54424 so both can run side by side.

## D-014 · 2026-11-06 · Local JWT verification uses JWKS (ES256)
- Supabase CLI 2.x signs user access tokens with ES256 (the anon key is still HS256). The local profile
  therefore verifies via `/auth/v1/.well-known/jwks.json`, the same code path as staging/prod. HS256 stays
  supported only for the `local`/`test` profiles (tests mint HS256 tokens).

## D-015 · 2026-11-06 · Invitation lookup by capability policy (no SECURITY DEFINER)
- Instead of a SECURITY DEFINER lookup function, the `invitation` select/update policies also allow
  access when `token_hash = current_setting('app.invite_token_hash')`. The `app_user` insert policy lets a
  user insert ONLY themselves, with the invited role, while a matching valid invitation exists.
  A 256-bit token makes the capability unguessable. No RLS bypass exists anywhere. SECURITY-REVIEW-REQUIRED.

## D-016 · 2026-11-06 · Scaffolded endpoints return 501
- Controllers for Sprint 1–6 modules implement their generated interfaces with no overrides, so routes
  exist, need authentication and return 501. The cross-tenant coverage test forces an isolation test as
  soon as any of them is implemented.

## D-017 · 2026-11-06 · Local-only invite link logging
- With no mail provider locally, `trackdesk.email.log-links=true` (honoured ONLY with the `local`
  profile) logs invitation accept links. Never enabled in shared environments.
