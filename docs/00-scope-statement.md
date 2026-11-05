# TrackDesk v1 — Scope Statement (one page)

> **Status: DRAFT. Not signed.** Phase 0 gate = this document signed by Mitul.
> `TODO(playbook): reconcile module counts and wording with PLAYBOOK.md.`

## 1. Product
TrackDesk is a multi-tenant B2B SaaS for field service management (FSM). It covers scheduling,
dispatch, field execution, customer verification, compliance records and getting paid.

## 2. Market and launch
| Item | v1 decision |
|---|---|
| Launch geography | **UK only**. UK data residency (London region), GBP, UK VAT, UK GDPR + DUAA 2025 |
| First vertical | **Statutory compliance contractors**: fire detection & alarm (BS 5839-1) and emergency lighting (BS 5266-1) |
| Customers of our customers | Facilities managers, landlords, schools, retail and offices that need statutory servicing records |
| Users | company_owner, ops_manager, field_worker, customer (portal), portal_owner (platform admin) |

## 3. In scope for v1 (six sprint areas, ~45% of the module catalogue)
| Sprint | Modules |
|---|---|
| 1 | Customers, Sites, Assets (BS 5839 / BS 5266 asset types), Users, Teams |
| 2 | Jobs (state machine), Work orders, Planned-maintenance (PM) schedules |
| 3 | Scheduling, Dispatch board, Realtime updates |
| 4 | Field worker app: job execution, checklists, photos, signatures, GPS + geofence (with consent), offline sync |
| 5 | Happy Code OTP job verification, Customer portal, Compliance certificates & records |
| 6 | Quotes, Invoices, Payments, Reporting, Chat |
| Platform | Tenant onboarding, roles & permissions, RLS isolation, audit log, feature flags, observability |

## 4. Deferred (~55% of modules; each needs a PRD before entering a sprint)
Inventory/stock & van stock, purchase orders & supplier management, timesheets & payroll export,
accounting integrations (Xero/QuickBooks/Sage), fleet telematics (stub adapter only in v1),
route optimisation beyond nearest-available, contracts & SLA agreements editor, multi-currency /
non-UK tax, other verticals (gas safety, electrical EICR, HVAC, lifts), white-labelling, public API &
webhooks for customers, marketplace/sub-contractor network, AI scheduling assistant, advanced BI,
native tablet layouts, multi-tenant membership per user, SSO/SAML.
`TODO(playbook): replace with the playbook's exact deferred-module list.`

## 5. Decisions required (human)
### 5.1 Billing route — **TODO: Mitul to choose**
| Option | Pros | Cons |
|---|---|---|
| A. Stripe direct (TrackDesk = merchant for its subscriptions; Stripe Connect for contractor → customer invoices) | Lower fees, full control, mature UK support | We own VAT handling, disputes, PCI SAQ-A scope |
| B. Merchant of record (e.g. Paddle / Lemon Squeezy for subscriptions) | MoR handles VAT and compliance | Higher fees, less suited to contractor → end-customer invoice payments |

Engineering builds against a `PaymentGateway` port with both adapters (Stripe test mode + MoR stub)
until this is decided. See DECISIONS D-008.

### 5.2 Mobile location approach — **proposed, needs DPO sign-off**
- Background location **only with explicit, revocable consent**, and **only during working hours
  and while a job is active** (en route / on site).
- Visible "tracking on" indicator, plus a screen showing exactly what is collected.
- Offline job data on device (expo-sqlite) with a sync queue. Location points are retained for a
  limited time (see `11-compliance.md`).
- Spike in Sprint 1 to de-risk iOS/Android background behaviour.

## 6. Out of scope for v1 (explicitly)
Non-UK launch, production use of telematics, payroll, customer self-service payments other than
invoice pay-links, any AI feature that makes compliance decisions.

## 7. Success measure for v1
3–5 paid design-partner tenants running real jobs for two consecutive weeks (Phase 6 gate).

## 8. Sign-off
| Role | Name | Signature | Date |
|---|---|---|---|
| Founder / Product owner | Mitul | ____________ | ____ |
| Tech Lead | TODO (hire) | ____________ | ____ |
| AI-first PM | TODO (hire) | ____________ | ____ |
