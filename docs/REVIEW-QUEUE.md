# Review Queue — code needing senior human review

Every item marked `// SECURITY-REVIEW-REQUIRED:` (or `-- SECURITY-REVIEW-REQUIRED:` in SQL)
is listed here. AI drafted it. **Nothing here is approved until a named human signs it off.**
Run `pnpm review-queue:check` to list markers in code that are missing from this file.

| # | Area | Path | Why it needs review | Reviewer | Status |
|---|------|------|---------------------|----------|--------|
| 1 | Tenant isolation | `apps/api/src/main/java/com/trackdesk/platform/tenancy/` | TenantContext, filter, `set_config` wiring for RLS | Tech Lead + 2nd | Open |
| 2 | Auth | `apps/api/src/main/java/com/trackdesk/platform/security/SecurityConfig.java` | JWT validation, JWKS, claim mapping, CORS | Tech Lead + 2nd | Open |
| 3 | Role permissions | `packages/contracts/permissions.yaml` + generated `Permission.java`, `R__role_permissions.sql` | Permission matrix for the 5 roles | Tech Lead + PM | Open |
| 4 | RLS | `apps/api/src/main/resources/db/migration/V1__platform.sql` | Roles, helpers, tenants/users/invitations/audit/feature flags RLS | Tech Lead + 2nd | Open |
| 5 | RLS | `apps/api/src/main/resources/db/migration/V2__customers.sql` | Customers RLS (reference module) | Tech Lead | Open |
| 6 | RLS | `apps/api/src/main/resources/db/migration/V3__v1_module_scaffolds.sql` | Scaffold tables for all v1 modules | Tech Lead | Open |
| 7 | Tenant onboarding | `apps/api/src/main/java/com/trackdesk/tenants/` | Sign-up → company creation runs before a tenant exists (privileged path) | Tech Lead + 2nd | Open |
| 8 | Invitations | `apps/api/src/main/java/com/trackdesk/users/` | Invite tokens, role assignment on accept | Tech Lead | Open |
| 9 | Audit log | `apps/api/src/main/java/com/trackdesk/platform/audit/` | Append-only guarantees | Tech Lead | Open |
| 10 | Payments | `apps/api/src/main/java/com/trackdesk/payments/` | Adapter skeletons only — payment flow sign-off is human-only | Tech Lead + Mitul | Open |
| 11 | Location data | `apps/api/src/main/java/com/trackdesk/fieldwork/`, `apps/mobile/src/location/` | Consent, retention, working-hours gating | DPO advisor + Tech Lead | Open |
| 12 | Compliance certificates | `apps/api/src/main/java/com/trackdesk/compliance/` | BS 5839 / BS 5266 record immutability | Compliance advisor | Open |
| 13 | Happy Code OTP | `apps/api/src/main/java/com/trackdesk/verification/` | OTP hashing, attempt limits (scaffold) | Tech Lead | Open |
| 14 | Infra | `infra/terraform/` | Draft IaC, never applied by AI | Tech Lead / DevOps | Open |
| 15 | CI secrets | `.github/workflows/claude-review.yml` | Uses `ANTHROPIC_API_KEY` repo secret, set by a human | Tech Lead | Open |
