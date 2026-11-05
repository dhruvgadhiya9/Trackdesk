# Definition of Done

> `TODO(playbook): reconcile with PLAYBOOK.md.` The PR template mirrors this list.

A story is done when **all** of these are true:

- [ ] PRD story and Gherkin criteria exist and are linked in the PR
- [ ] OpenAPI spec updated; Java + TS code regenerated; `pnpm contracts:check` passes
- [ ] Flyway migration (if any) has `tenant_id`, an index on it, RLS enabled + forced, policies, and composite FKs
- [ ] Controller implements the generated interface; `@PreAuthorize` uses `Permission` constants
- [ ] Unit tests for domain rules and services
- [ ] API integration tests (Testcontainers) for every Gherkin scenario
- [ ] Cross-tenant access test for every new or changed endpoint
- [ ] UI built only from `packages/ui` / `packages/ui-native` components and tokens; loading, empty and error states
- [ ] Playwright (web) or Maestro (mobile) test for the main path
- [ ] Audit events for state-changing operations (`@Audited`)
- [ ] Lint, typecheck, Spotless, Modulith and ArchUnit checks green in CI
- [ ] `SECURITY-REVIEW-REQUIRED` marked and listed in `docs/REVIEW-QUEUE.md` where relevant
- [ ] Docs updated (data model, architecture dependency register, CLAUDE.md if conventions changed)
- [ ] Human reviewer approved; second reviewer for migrations, auth, permissions
- [ ] Designer sign-off in Storybook / staging (human)
- [ ] Device testing for mobile stories (human)
- [ ] Product owner accepted (human)
