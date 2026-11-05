# Phase Plan (20 weeks)

> `TODO(playbook): reconcile week numbers, owners and gates with PLAYBOOK.md.`

| Phase | Weeks | Owner | AI tools | Steps | Gate |
|---|---|---|---|---|---|
| 0 Scope & team | 1–2 | Mitul + PM | Claude Project | Scope statement, hire Tech Lead + PM, NFRs | **Signed scope statement** |
| 1 Specs | 2–3 | PM + Tech Lead | Claude (PRDs, Gherkin), Claude Code (docs) | Architecture, data model, PRDs for v1 modules, DPIA draft | PRDs reviewed; architecture approved by Tech Lead |
| 2 Design system | 2–4 | Designer | Figma Dev Mode MCP, Claude Code | Tokens, component library, Storybook, AI-readable frames | Designer sign-off of core components in Storybook |
| 3 Foundation ("Sprint 0") | 3–4 | Tech Lead | Claude Code, Cursor | Monorepo, CI, auth, tenancy, RLS, isolation tests, reference module | Sign up → create company → invite worker → log in on web + mobile; isolation tests green |
| 4 Build (Sprints 1–6) | 5–16 | Pod | Claude Code agents, Claude GitHub Action | Vertical slices per sprint (see scope) | Each sprint: DoD met, gate report, field-test day from Sprint 4 |
| 5 Hardening | 16–18 | Tech Lead + QA | Claude (self-audit, k6, axe) | Security review, pen test, load test, a11y, compliance pack, ops readiness | Zero open critical/high defects; DPIA signed |
| 6 Design-partner beta | 18–20 | PM + Mitul | Claude (feedback clustering) | 3–5 paid partners, feedback loop | Partners running real jobs 2 consecutive weeks |
| 7 Launch & run | 20+ | Mitul | Claude (runbooks) | Status page, support, release process | Mitul approves the production release |

## First 14 days
### Days 1–5
- [ ] Mitul signs `00-scope-statement.md` (billing route decided)
- [ ] Tech Lead and AI-first PM hired or contracted
- [ ] Claude Project created with playbook, scope and CLAUDE.md (see `12-tooling-setup.md`)
- [ ] Team accounts for Claude, Cursor, GitHub and Figma created with data-privacy settings
- [ ] Repo bootstrapped (this commit); CI green
- [ ] NFR targets confirmed

### Days 6–10
- [ ] Architecture and data model reviewed and approved by the Tech Lead
- [ ] PRDs for Sprint 1–2 modules reviewed by PM; Gherkin criteria agreed
- [ ] Designer publishes Figma variables; `figma-tokens-sync` run once
- [ ] Supabase projects (dev, staging) created in the London region by a human
- [ ] DPIA draft started with the DPO advisor
- [ ] Review queue items 1–9 reviewed

### Days 11–14
- [ ] Phase 3 gate demo: sign up → company → invite worker → log in (web + mobile)
- [ ] Isolation test suite green in CI
- [ ] Background-location spike scheduled (Sprint 1)
- [ ] Sprint 1 planned; design-partner shortlist (5–10 contractors) drafted
