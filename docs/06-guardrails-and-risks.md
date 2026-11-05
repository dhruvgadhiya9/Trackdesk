# Guardrails and Risks

> `TODO(playbook): reconcile the risk table with PLAYBOOK.md.`

## Risk table
| Risk | What it looks like | Mitigation | Owner |
|---|---|---|---|
| Cross-tenant data leak | Tenant A sees tenant B's jobs or customers | RLS on every tenant table, set_config per transaction, non-BYPASSRLS role, Hibernate filter, composite FKs, isolation suite in CI, second reviewer on migrations | Tech Lead |
| AI-generated code nobody understands | Large PRs merged on trust | Small PRs, human gate on every merge, CLAUDE.md rules, reference module pattern | Tech Lead |
| Background location unreliable / rejected by app stores | iOS kills tracking; Play policy rejection | Sprint 1 spike, foreground service + disclosure, tracking only on active jobs, field-test days | Mobile Eng |
| Location tracking breaches privacy law | Tracking outside working hours, no consent | DPIA, explicit consent, working-hours gating, retention job, "what we collect" screen | DPO advisor |
| Compliance records wrong | Certificate misses a BS 5839 requirement | Domain expert reviews templates, immutable versioned certificates, compliance test pack | Compliance advisor |
| Payment bugs | Double charge, lost webhook | Idempotent webhook processing, Stripe test mode, human payment sign-off | Tech Lead + Mitul |
| Scope creep | Deferred modules slip into sprints | Signed scope, PRD required before a sprint, PM owns backlog | PM |
| Design drift | Hard-coded colours, inconsistent UI | Tokens only, lint bans raw hex/arbitrary values, Storybook sign-off | Designer |
| Offline sync conflicts | Lost checklist answers, duplicate jobs | Client IDs + idempotency keys, documented conflict strategy, sync unit tests | Mobile Eng |
| Vendor lock-in to Supabase | Hard to move off later | Flyway owns schema, plain Postgres + RLS, auth behind JWT verification | Tech Lead |
| Secrets leakage | Keys in repo or AI context | `.env.example` only, vault, gitleaks in CI, AI never handles prod secrets | DevOps |
| **Contract drift between Java API and TS clients** (Java-specific) | Web/mobile call fields the API no longer returns | Both generated from one OpenAPI spec; controllers implement generated interfaces; CI `contracts:check` fails on drift | Tech Lead |
| Key-person risk | Only the Tech Lead understands RLS | Docs, ADRs in DECISIONS.md, pairing, RLS reviewer agent | Mitul |

## What AI must never own
1. Production deployments.
2. Secrets: creating, reading, rotating or configuring production secrets.
3. Final approval of RLS policies and permission changes.
4. Payment flow sign-off.
5. Compliance logic sign-off (BS 5839 / BS 5266 records, DPIA, consent).
6. Acceptance of any feature (a human product owner accepts).
7. Signing the scope statement, hiring, pen-test sign-off, design-partner commitments.
