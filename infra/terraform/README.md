# Infrastructure (DRAFT — human applies)

> **Draft only. Claude Code never runs `terraform apply` (denied in `.claude/settings.json`).**
> A human with the DevOps role reviews, plans and applies. Production changes need Mitul's approval.

- Region: **eu-west-2 (London)** only. Supabase projects in the London region (human-created).
- Workspaces: `dev`, `staging`, `prod` (`terraform workspace select staging`).
- Variables: copy `environments/<env>.tfvars.example` to `<env>.tfvars` (git-ignored).
- Secrets: Terraform creates empty Secrets Manager entries; values are set by a human from the vault.

```
terraform init
terraform workspace select staging
terraform plan -var-file=environments/staging.tfvars   # human reviews the plan
terraform apply ...                                     # human only
```

Open decisions: AWS (ECS Fargate) vs GCP (Cloud Run, europe-west2) — D-012 in docs/DECISIONS.md.
