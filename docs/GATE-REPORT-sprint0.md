# Gate Report — Phase 3 / Sprint 0 (Foundation)

Date: 2026-11-06 · Prepared by: Claude Code (AI draft — human Tech Lead must verify and sign)

## Gate questions

### Can a user sign up, create a company, invite a worker and log in on web and mobile?
| Step | API | Web UI | Mobile UI | Evidence |
|---|---|---|---|---|
| Sign up (Supabase Auth) | ✅ | ✅ built (`/signup`) | n/a (workers are invited) | `scripts/gate-smoke.mjs` against the **real local stack** |
| Create company (`POST /v1/tenants`) | ✅ | ✅ built | n/a | gate-smoke + `OnboardingApiIT` |
| JWT carries `tenant_id` + role after refresh | ✅ | ✅ (`refreshSession`) | ✅ (Refresh button) | gate-smoke decodes a real ES256 Supabase token |
| Invite worker (`POST /v1/invitations`) | ✅ | ✅ built (`/owner/team`) | n/a | gate-smoke + `OnboardingApiIT` |
| Accept invite (`POST /v1/invitations/accept`) | ✅ | ✅ built (`/accept-invite`) | n/a | gate-smoke + `OnboardingApiIT` |
| Worker logs in and sees own tenant/role | ✅ | ✅ login page | ✅ built (Login → Today) | gate-smoke `/v1/me` |

**API flow: YES, proven end to end** on the local stack (Supabase Auth + Postgres 17/PostGIS + RLS +
Spring API). `scripts/gate-smoke.mjs`: 15/15 checks pass, including a second tenant proving isolation
with real JWTs and that PostgREST exposes no tenant tables.
**Web UI: built and typechecked; the screens were NOT clicked through manually against the real stack.**
Customer screens are verified by Playwright in mock mode.
**Mobile: builds/typechecks only.** No emulator or device run was done → **human** (device test).

### Are isolation tests green?
**Yes.** `./gradlew isolationTest`:
- `RlsIsolationTest`: **276 checks** over **34 tenant tables** (discovered from the catalog). RLS is enabled and
  forced, every table has a tenant-leading index and policies, and seed rows exist for A and B. As the
  non-superuser API role, tenant A cannot SELECT, UPDATE, DELETE or INSERT tenant B rows (INSERT tried as all 4
  tenant roles), and cannot move its own rows to B. With no tenant set, every table returns 0 rows and
  rejects inserts (fail closed). The audit log is append-only. The invitation capability exposes only that
  invitation. The API role has no BYPASSRLS and owns nothing.
- Mutation check: disabling RLS on `customer` turned 7 checks red, so the suite does detect regressions.
- `CrossTenantApiTest`: all **15 implemented endpoints** are covered, enforced by a coverage test that fails
  when a newly implemented endpoint has no `@Covers` test.

## Verification run (this session)
| Check | Result |
|---|---|
| `./gradlew build` (Spotless, 325 tests incl. Testcontainers, isolation, Spring Modulith verify, 7 ArchUnit rules) | ✅ |
| `pnpm turbo run lint typecheck test` (all JS packages + API) | ✅ 21/21 tasks |
| Playwright web E2E, mock API, 1280 + 1440, incl. axe WCAG 2.1 AA | ✅ 12 passed, 2 visual tests skipped (baselines on Linux CI) |
| Contract drift (`pnpm contracts:check`) | ✅ no drift |
| Review-queue coverage (`pnpm review-queue:check`) | ✅ |
| Real-stack gate smoke (`scripts/gate-smoke.mjs`) | ✅ 15/15 |
| Flyway V1–V3 + R__ applied on Supabase Postgres 17 as `trackdesk_owner` | ✅ |
| `next build` web + customer | ✅ (after fix 5 below) |

## Bugs found and fixed by the checks
1. **Token contrast:** axe flagged `fg.muted` on `bg.subtle` at 4.12:1. Changed the placeholder slate-500 to `#5F6878` (≥ 4.9:1).
2. **Local JWT algorithm:** Supabase CLI 2.x signs access tokens with ES256. The local profile now uses JWKS (D-014). Unit tests alone would not have caught this.
3. **Port clash:** another local Supabase project uses 543xx, so TrackDesk uses 544xx (D-013). Port 8080 was also busy here; I used 8090 for the smoke run.
4. MapStruct field injection was rejected by Modulith verification, so I switched to constructor injection.
5. **Next.js production build:** UI components using hooks lacked a `"use client"` boundary for server-component pages. Fixed in `packages/ui`.
6. **Turbo + Gradle:** running API lint/typecheck/test as parallel Gradle builds deadlocked on locks. These are now serialized in `turbo.json`.

## Left incomplete / not done
- `docs/PLAYBOOK.md` was not provided. Team table, RACI, phase plan, risks and DoD are drafts marked `TODO(playbook)`.
- Mobile app never ran on a device or emulator. No Metro bundle check (`expo export`). Background location spike is Sprint 1.
- Web flows (signup / accept / login) not exercised in a browser against the real stack (API path verified instead).
- Storybook build not run locally (it is in CI). Visual-regression baselines not generated (need Linux CI with `VISUAL=1`).
- CI workflows are written but have never run (no GitHub remote). The `ANTHROPIC_API_KEY` secret and branch protection still need setting up.
- Terraform is a draft: the `ecs-api` module is an interface only. Nothing has been applied.
- Real email provider, maps, SMS and Stripe adapters: ports + fakes/stubs only.
- `updateUser` (role change / disable) and every Sprint 1–6 endpoint are scaffolds (return 501).
- Disabled users keep a valid JWT until expiry (15 min, local config). There is no per-request status check yet (REVIEW-QUEUE #3).
- `pnpm db:seed` was written but not run (the gate smoke covers the same flow).
- Supabase Realtime grants (`authenticated` role) are deliberately not configured until Sprint 3.

## Assumptions made (see docs/DECISIONS.md)
D-002 playbook missing → drafts · D-003 stable dependency majors · D-004 one tenant per user, claims in
`app_metadata` · D-005 per-transaction `set_config` only, fail closed · D-006 owner/app role split ·
D-007 permission matrix generated to Java/SQL/TS · D-008 billing route undecided (both adapters) ·
D-010 audit append-only · D-011 auth-admin call inside the onboarding transaction · D-012 cloud provider undecided ·
D-013 local ports 544xx · D-014 local JWKS · D-015 invitation capability policy instead of SECURITY DEFINER ·
D-016 scaffolds return 501 · D-017 local-only invite link logging.

## Added to REVIEW-QUEUE.md (all Open, need human sign-off)
1 tenancy · 2 persistence base · 3 security/JWT/permissions · 4 auth-admin · 5 permission matrix ·
6 DB roles + RLS migrations · 7 RLS generator · 8 onboarding · 9 invitations · 10 audit · 11 isolation
tests · 12 payments · 13 location data · 14 compliance certificates · 15 Happy Code · 16 infra ·
17 CI secrets · 18 local Supabase bootstrap.

## Human actions before Sprint 1
1. Paste the playbook into `docs/PLAYBOOK.md` and reconcile the `TODO(playbook)` markers.
2. Mitul signs `docs/00-scope-statement.md` (billing route decision).
3. Tech Lead reviews REVIEW-QUEUE items 1–11 (tenancy, auth, RLS) with a second reviewer.
4. Create the GitHub repo, push, enable branch protection + CODEOWNERS + required checks, add `ANTHROPIC_API_KEY`.
5. Run the web flows in a browser and the mobile login on one iOS and one Android device.
