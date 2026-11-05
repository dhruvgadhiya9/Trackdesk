# Review Queue — code needing senior human review

Every file containing `SECURITY-REVIEW-REQUIRED` must be covered by an entry below (a path or a
parent directory). `pnpm review-queue:check` enforces this in CI. **AI drafted all of it. Nothing
here is approved until a named human signs it off** (reviewer + date in the Status column).

| # | Area | Path | Why it needs review | Reviewer | Status |
|---|------|------|---------------------|----------|--------|
| 1 | Tenant isolation | `apps/api/src/main/java/com/trackdesk/platform/tenancy/` | TenantContext, JWT→context filter, per-transaction `set_config` (is_local=true), Hibernate filter, privileged `TenantTransactions.runAs` | Tech Lead + 2nd | Open |
| 2 | Tenant isolation | `apps/api/src/main/java/com/trackdesk/platform/persistence/` | `TenantScopedEntity` assigns tenant on persist; Hibernate filter definition | Tech Lead | Open |
| 3 | Auth | `apps/api/src/main/java/com/trackdesk/platform/security/` | JWT validation (JWKS vs local HS256), audience/issuer, CORS, role→authority mapping, generated `Permission.java` | Tech Lead + 2nd | Open |
| 4 | Auth admin | `apps/api/src/main/java/com/trackdesk/platform/auth/` | Writes `app_metadata` (tenant/role) with the service-role key | Tech Lead + 2nd | Open |
| 5 | Role permissions | `packages/contracts/permissions.yaml`, `packages/contracts/scripts/gen-permissions.mjs` | Permission matrix for the 5 roles; generator for Java/SQL/TS | Tech Lead + PM | Open |
| 6 | DB roles + RLS | `apps/api/src/main/resources/db/` | Bootstrap roles (no BYPASSRLS), V1 platform RLS (incl. **invitation capability policy** via `app.invite_token_hash`), V2 customers, V3 scaffolds, `R__role_permissions.sql` | Tech Lead + 2nd | Open |
| 7 | RLS generator | `apps/api/scripts/` | Generates V3 policy SQL (review the SQL output, not just the script) | Tech Lead | Open |
| 8 | Tenant onboarding | `apps/api/src/main/java/com/trackdesk/tenants/` | Sign-up → company creation runs before a tenant exists; auth admin call inside the transaction (D-011) | Tech Lead + 2nd | Open |
| 9 | Invitations | `apps/api/src/main/java/com/trackdesk/users/` | Token generation/hashing, two-step accept, role grant rules (ops cannot grant owner) | Tech Lead | Open |
| 10 | Audit log | `apps/api/src/main/java/com/trackdesk/platform/audit/` | Append-only guarantees (no update/delete grant + trigger) | Tech Lead | Open |
| 11 | Isolation proof | `apps/api/src/test/java/com/trackdesk/isolation/` | The tests that prove isolation; weakening them needs sign-off | Tech Lead | Open |
| 12 | Payments | `apps/api/src/main/java/com/trackdesk/payments/`, `packages/contracts/openapi/billing.yaml` | Adapter skeletons; **payment flow sign-off is human-only** | Tech Lead + Mitul | Open |
| 13 | Location data | `packages/contracts/openapi/fieldwork.yaml`, `apps/mobile/src/location/`, `apps/api/src/main/java/com/trackdesk/fieldwork/` | Consent, working-hours gating, background task | DPO advisor + Tech Lead | Open |
| 14 | Compliance certificates | `packages/contracts/openapi/compliance.yaml`, `apps/api/src/main/java/com/trackdesk/compliance/` | BS 5839 / BS 5266 record immutability (trigger in V3) | Compliance advisor | Open |
| 15 | Happy Code OTP | `packages/contracts/openapi/verification.yaml`, `apps/api/src/main/java/com/trackdesk/verification/` | OTP hashing, attempt and rate limits (scaffold) | Tech Lead | Open |
| 16 | Infra | `infra/terraform/` | Draft IaC, never applied by AI | Tech Lead / DevOps | Open |
| 17 | CI secrets | `.github/workflows/` | `claude-review.yml` uses the `ANTHROPIC_API_KEY` repo secret, set by a human | Tech Lead | Open |
| 18 | Local bootstrap | `supabase/` | Local roles/passwords (placeholders) and auth settings | Tech Lead | Open |
