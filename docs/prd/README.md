# PRDs (v1)

One PRD per v1 module. Each has user stories, Gherkin acceptance criteria, roles, edge cases and
UI states. **Every Gherkin scenario becomes an integration test** (`docs/10-backend-workflow.md`).
Status: DRAFT. The PM reviews and owns these.

| # | Module | Sprint | Contract | Status |
|---|---|---|---|---|
| 00 | [Tenant onboarding](00-tenant-onboarding.md) | 0 | `openapi/tenants.yaml`, `openapi/users.yaml` | Implemented (API) |
| 01 | [Customers](01-customers.md) | 1 | `openapi/customers.yaml` | **Reference module, implemented** |
| 02 | [Sites](02-sites.md) | 1 | `openapi/sites.yaml` | Scaffold |
| 03 | [Assets](03-assets.md) | 1 | `openapi/assets.yaml` | Scaffold |
| 04 | [Users](04-users.md) | 1 | `openapi/users.yaml` | Partly implemented (invites) |
| 05 | [Teams](05-teams.md) | 1 | `openapi/teams.yaml` | Scaffold |
| 06 | [Jobs](06-jobs.md) | 2 | `openapi/jobs.yaml` | Scaffold |
| 07 | [Work orders](07-work-orders.md) | 2 | `openapi/workorders.yaml` | Scaffold |
| 08 | [PM schedules](08-pm-schedules.md) | 2 | `openapi/maintenance.yaml` | Scaffold |
| 09 | [Scheduling](09-scheduling.md) | 3 | `openapi/dispatch.yaml` | Scaffold |
| 10 | [Dispatch board](10-dispatch-board.md) | 3 | `openapi/dispatch.yaml` | Scaffold |
| 11 | [Realtime](11-realtime.md) | 3 | Supabase Realtime | Scaffold |
| 12 | [Job execution](12-job-execution.md) | 4 | `openapi/fieldwork.yaml` | Scaffold |
| 13 | [GPS & geofence](13-gps-geofence.md) | 4 | `openapi/fieldwork.yaml` | Scaffold |
| 14 | [Offline sync](14-offline-sync.md) | 4 | `openapi/fieldwork.yaml` | Scaffold |
| 15 | [Happy Code OTP](15-happy-code.md) | 5 | `openapi/verification.yaml` | Scaffold |
| 16 | [Customer portal](16-customer-portal.md) | 5 | `openapi/portal.yaml` | Scaffold |
| 17 | [Compliance certificates](17-compliance-certificates.md) | 5 | `openapi/compliance.yaml` | Scaffold |
| 18 | [Quotes](18-quotes.md) | 6 | `openapi/billing.yaml` | Scaffold |
| 19 | [Invoices](19-invoices.md) | 6 | `openapi/billing.yaml` | Scaffold |
| 20 | [Payments](20-payments.md) | 6 | `openapi/billing.yaml` | Scaffold |
| 21 | [Reporting](21-reporting.md) | 6 | `openapi/reporting-chat.yaml` | Scaffold |
| 22 | [Chat](22-chat.md) | 6 | `openapi/reporting-chat.yaml` | Scaffold |
