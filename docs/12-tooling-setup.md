# Tooling Setup

## 1. Claude Project (claude.ai), for PM/design/planning work
Load as project knowledge: `docs/PLAYBOOK.md`, `docs/00-scope-statement.md`, `docs/02-architecture.md`,
`docs/03-data-model.md`, `docs/07-definition-of-done.md`, `CLAUDE.md`, the relevant `docs/prd/*.md`,
and `packages/contracts/permissions.yaml`. Project instructions: "Follow CLAUDE.md; never invent
requirements; output Gherkin for acceptance criteria." **Never** upload real customer data or secrets.

## 2. Claude Code
- `CLAUDE.md` (root) is loaded automatically. `.claude/settings.json` holds permissions and post-edit
  hooks. Subagents live in `.claude/agents/` (`rls-reviewer`, `test-writer`, `figma-screen-builder`,
  `spring-module-builder`).
- Install: `npm i -g @anthropic-ai/claude-code`, then `claude` in the repo root.

## 3. Figma Dev Mode MCP server
- Figma desktop → Preferences → **Enable Dev Mode MCP Server** (local server at `http://127.0.0.1:3845/mcp`).
- Claude Code: `claude mcp add --transport http figma-dev-mode-mcp-server http://127.0.0.1:3845/mcp`
- Cursor: Settings → MCP → add the same URL.
- Token sync (variables API, needs a Figma Enterprise/Org plan or a manual export):
  `FIGMA_TOKEN=<personal access token> FIGMA_FILE_KEY=<file key> pnpm tokens:sync`.
  Keep the token in your password manager, never in `.env` files that are committed.

## 4. Playwright MCP
`claude mcp add playwright npx @playwright/mcp@latest`. Use it against local or staging only, never production.

## 5. Team accounts and data privacy
- Claude Team/Enterprise and Cursor Business with **privacy mode on** (no training on our code).
- GitHub: org-owned repo, branch protection on `main`, required reviews, CODEOWNERS, required CI checks.
- Figma: org workspace; designers own the library.

## 6. Secrets vault policy
- Production and staging secrets live only in the cloud secret manager (AWS Secrets Manager
  eu-west-2 or GCP Secret Manager europe-west2) and GitHub Environments with required reviewers.
- Local development uses `.env` / `application-local.yml` copied from the `*.example` files, with local Supabase keys only.
- AI tools never receive production secrets. `gitleaks` runs in CI.
- Rotation: every 90 days and on any staff change.

## 7. Local setup
| Tool | Version | Install |
|---|---|---|
| JDK | 21 (Temurin) | `winget install EclipseAdoptium.Temurin.21.JDK` / `brew install --cask temurin@21` / sdkman |
| Node | 20+ (24 tested) | nvm / fnm |
| pnpm | 10 | `corepack enable` (or `corepack enable --install-directory ~/.local/bin` without admin rights) |
| Docker | Desktop / Engine | needed by Supabase CLI and Testcontainers |
| Supabase CLI | repo devDependency | `pnpm supabase --version` |
| Gradle | via wrapper | `apps/api/gradlew` (do not install Gradle globally) |

IntelliJ: import `apps/api` as a Gradle project and enable annotation processing (MapStruct).
Run `./gradlew openApiGenerate` once so the generated sources are indexed.
