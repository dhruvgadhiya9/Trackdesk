# Non-Functional Requirement Targets

> All values are **placeholders marked TODO**, sized for the design-partner beta plus the first
> year. The Tech Lead confirms them before Phase 5 load testing (k6 scripts read this table).

| Area | Target (v1) | Notes / how measured | Status |
|---|---|---|---|
| Tenants | 50 at launch, 500 in year 1 | Shared schema, `tenant_id` + RLS | TODO confirm |
| Users per tenant | up to 200 | | TODO |
| Concurrent field technicians (platform) | 2,000 | Each sends a location ping ≤ every 30 s while a job is active | TODO |
| Jobs per day (platform) | 20,000 | Peak tenant 1,000/day | TODO |
| Realtime connections | 3,000 concurrent | Supabase Realtime plan limits must be checked | TODO |
| API response time | p95 < 300 ms reads, < 500 ms writes; p99 < 1 s | Measured at the load balancer, London region | TODO |
| Dispatch board load | < 2 s for 50 technicians × 1 day | | TODO |
| Mobile cold start | < 3 s on a mid-range Android | | TODO |
| Offline | Full day of assigned jobs usable offline; sync within 60 s of reconnecting | | TODO |
| Uptime | 99.9 % monthly (excludes planned maintenance) | Status page | TODO |
| RPO / RTO | RPO ≤ 15 min (PITR), RTO ≤ 4 h | Supabase PITR add-on | TODO |
| Data residency | **UK only**: Supabase London, AWS eu-west-2 or GCP europe-west2, backups in UK | Verification checklist in Phase 5 | Required |
| Location data retention | 90 days raw points, then aggregated/deleted | See `11-compliance.md` | DRAFT, DPO |
| Compliance records retention | ≥ 6 years after issue (TODO: confirm per BS/insurer guidance) | | DRAFT |
| Audit log retention | 7 years | Append-only | TODO |
| Accessibility | WCAG 2.1 AA for web apps | axe in Playwright | Required |
| Security | OWASP ASVS L2 target, external pen test before launch | | Required |
| Battery | Background tracking < 5 %/hour on a reference device | Field-test day | TODO |
