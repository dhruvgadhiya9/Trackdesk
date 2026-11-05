## What and why

<!-- Link the PRD story and Gherkin scenarios: docs/prd/<file>.md#... -->

## Definition of Done (docs/07-definition-of-done.md)

- [ ] PRD story and Gherkin criteria linked above
- [ ] OpenAPI spec updated; `pnpm contracts:generate` run; `pnpm contracts:check` passes
- [ ] Migration (if any): `tenant_id`, index leading with it, ENABLE + FORCE RLS, policies, grants, composite FKs, seed row in `isolation/seed.sql`
- [ ] Controller implements the generated interface; `@PreAuthorize` uses `Permission` constants
- [ ] Unit tests for domain rules and services
- [ ] Integration tests (Testcontainers) for every Gherkin scenario
- [ ] Cross-tenant test (`@Covers`) for every new or changed endpoint
- [ ] UI only from `@trackdesk/ui` / `@trackdesk/ui-native` + tokens; loading, empty and error states
- [ ] Playwright (web) or Maestro (mobile) test for the main path
- [ ] `@Audited` on state-changing operations
- [ ] Lint, typecheck, Spotless, Modulith and ArchUnit green
- [ ] `SECURITY-REVIEW-REQUIRED` marked and listed in `docs/REVIEW-QUEUE.md` where relevant
- [ ] Docs updated (data model, dependency register, CLAUDE.md if conventions changed)
- [ ] Human reviewer approved (second reviewer for migrations, auth, permissions)
- [ ] Designer sign-off (human) · Device testing (human, mobile) · Product owner accepted (human)

## Security-sensitive?

- [ ] No · [ ] Yes, it touches: tenant isolation / auth / permissions / payments / location / compliance certificates
