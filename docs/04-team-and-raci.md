# Team and RACI

> `TODO(playbook): the playbook says to copy the team table and RACI "exactly". This is a draft
> built from the prompt pack; reconcile it line by line with PLAYBOOK.md.`

## 1. Team: 9-person pod + fractional specialists
| Role | Count | Responsibilities | AI usage | Must-have skills |
|---|---|---|---|---|
| Tech Lead | 1 | Architecture, tenancy/RLS design, security reviews, merge gate, CLAUDE.md owner | Claude Code daily for scaffolds, reviews and tests; owns the agent rules | 8+ years; Postgres; Java/Spring Boot; multi-tenant SaaS; hands-on with Claude Code and Cursor |
| AI-first Product Manager | 1 | PRDs, Gherkin criteria, backlog, design-partner relationships, scope control | Claude for PRD drafts, feedback clustering, test-case generation | Writes precise acceptance criteria; FSM or B2B SaaS domain; can write a CLAUDE.md |
| Backend Engineers | 2 | Spring modules, Flyway + RLS, integrations, webhooks | Claude Code / Cursor for module scaffolds from the spec; human writes core rules | Java 21/Spring Boot, JPA/Hibernate, Postgres/PostGIS, payment and webhook integrations |
| Frontend Engineer (web) | 1 | apps/web, apps/customer, packages/ui | Figma Dev Mode MCP → components; Playwright | React/Next.js, Tailwind, design systems, accessibility |
| Mobile Engineer | 1 | apps/mobile, packages/ui-native, offline sync, background location | Claude Code for screens; human for platform quirks | React Native/Expo, iOS/Android background tasks, SQLite |
| Product Designer | 1 | Figma library, tokens, AI-readable frames, Storybook sign-off | Figma AI-readability checklist | Design systems, Figma variables, field/mobile UX |
| QA Engineer | 1 | Test strategy, Playwright/Maestro, compliance packs, field-test days | Claude turns Gherkin into test cases | Automation, API testing, exploratory field testing |
| DevOps / Platform (shared) | 1 | CI/CD, IaC, observability, UK residency, backups | Claude drafts Terraform; human applies | AWS/GCP, Terraform, GitHub Actions, Postgres ops |
| **Fractional** — Compliance / DPO advisor | 0.1–0.2 | DPIA, consent text, retention, BS 5839/5266 records | Reviews AI drafts | UK GDPR, DUAA, fire-safety standards |
| **Fractional** — Security / pen tester | engagement | Pen test, security review | — | OWASP, cloud security |
| **Fractional** — Fire-safety domain expert | ad hoc | Checklist and certificate content | — | BS 5839-1, BS 5266-1 |

## 2. Key-person profiles
### Tech Lead
- 8+ years of engineering, with recent ownership of a multi-tenant Postgres SaaS.
- Has shipped Spring Boot services in production. Comfortable with RLS, JPA pitfalls (N+1, lazy
  loading) and Flyway.
- Uses Claude Code and Cursor every day. Can show a repo where AI-generated PRs passed review.
- **Interview test:** "Write a CLAUDE.md for this repo in 30 minutes". Judge the forbidden
  patterns, the testing rules and how clearly they mark the security-review boundary.

### AI-first PM
- Writes PRDs with Gherkin criteria a model can turn into tests without guessing.
- **Interview test:** write the CLAUDE.md section for a feature, plus three Gherkin scenarios
  including one edge case and one permission case. Then prompt Claude to produce test cases and
  critique the result.
- Runs weekly design-partner calls and clusters feedback with Claude.

## 3. RACI (R = Responsible, A = Accountable, C = Consulted, I = Informed)
| Activity | Mitul (Founder) | Tech Lead | PM | Backend | Frontend | Mobile | Designer | QA | DevOps | Compliance/DPO | AI (Claude) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Scope statement | **A** | C | R | I | I | I | I | I | I | C | drafts |
| NFR targets | A | **R** | C | C | I | C | I | C | C | I | drafts |
| Architecture & tenancy | I | **A/R** | I | C | C | C | I | C | C | I | drafts |
| PRDs & acceptance criteria | C | C | **A/R** | C | C | C | C | C | I | C | drafts |
| Design system & Figma | I | C | C | I | C | C | **A/R** | I | I | I | assists |
| OpenAPI contracts | I | **A** | C | R | C | C | I | C | I | I | drafts |
| RLS & permission changes | I | **A** | C | R | I | I | I | C | I | I | drafts, never approves |
| Feature implementation | I | A | C | R | R | R | C | C | I | I | drafts |
| Code review & merge | I | **A** | I | R | R | R | I | C | I | I | first-pass review |
| Test strategy & automation | I | C | C | C | C | C | I | **A/R** | I | I | generates tests |
| Payments flow sign-off | **A** | R | C | C | I | I | I | C | I | C | never |
| Compliance logic sign-off | A | C | C | I | I | I | I | C | I | **R** | never |
| DPIA & consent | A | C | C | I | I | C | C | I | I | **R** | drafts |
| Production deploy | **A** | R | I | I | I | I | I | C | R | I | never |
| Secrets & infra apply | I | A | I | I | I | I | I | I | **R** | I | never |
| Field-test days | I | C | A | C | I | **R** | I | R | I | C | prepares plan |
| Design-partner onboarding | **A** | C | **R** | I | I | I | C | C | I | C | assists |
| Pen test | A | **R** | I | C | C | C | I | C | C | I | prepares scope |
