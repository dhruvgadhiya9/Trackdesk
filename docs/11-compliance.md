# Compliance

> **DRAFT — requires Compliance/DPO advisor sign-off.** Nothing in this file is legal advice or an
> approved policy. AI drafted it and must not mark it approved.

## 1. DPIA template: field worker location tracking
| Section | Content (draft) |
|---|---|
| Processing description | Collect field workers' device location while they are on an active job during working hours, to show live positions on the dispatch board, detect arrival at site (geofence) and evidence attendance. |
| Controller / processor | Controller: the contractor (tenant), for its employees. Processor: TrackDesk. Sub-processors: Supabase (London), cloud host (London), Sentry (TODO: EU/UK region). |
| Lawful basis | Legitimate interests (Art. 6(1)(f)), with an LIA. Consent is used as an additional safeguard and transparency mechanism (TODO: DPO to confirm. In an employment context consent is rarely "freely given"). |
| Necessity & proportionality | Only during active jobs + working hours; 30 s interval; no tracking on breaks or off shift; raw data retained 90 days. |
| Data subjects | Field workers (employees/contractors of the tenant). |
| Data | User id, lat/lng, accuracy, timestamp, job id. No speed or driving behaviour in v1. |
| Risks | Out-of-hours monitoring; covert surveillance; misuse for performance management; breach of location history. |
| Mitigations | Working-hours gating server-side + client-side; visible indicator; "what we collect" screen; RLS; retention job; audit of access to location history; role restriction (ops/owner only). |
| Residual risk | TODO (DPO) |
| Sign-off | DPO advisor: ____ · Mitul: ____ · Date: ____ |

## 2. Consent flow design
1. First login on mobile: explanation screen (what, when, why, retention, who sees it), with a link to the privacy notice.
2. The worker taps "Allow location while on jobs" → OS foreground permission → OS background
   permission ("Allow all the time" on Android 10+, "Always" on iOS) with a prominent disclosure
   (Google Play policy).
3. Consent is recorded server-side (`location_consent`: version, timestamp).
4. Revocable at any time in Settings → Location; revoking stops tracking immediately and is recorded.
5. Consent text is versioned. A new version triggers re-consent.
6. Declining consent must not block job execution. Arrival is then confirmed manually.

## 3. Working-hours tracking rules
- Track only when **all** are true: consent active, current time within the worker's
  `working_hours` (tenant timezone Europe/London), and the worker has a job in `en_route` or `on_site`.
- Stop tracking when the job is completed or cancelled, or when the shift ends.
- The server **rejects** pings outside these rules (defence in depth) and does not store them.
- A persistent "Tracking on" indicator (and the Android foreground-service notification) shows while tracking.

## 4. Location data retention policy (draft)
| Data | Retention | Then |
|---|---|---|
| Raw `location_ping` | 90 days | Deleted by a scheduled job (ShedLock) |
| Arrival/departure events on job history | Life of job record | Kept as part of the job record |
| Latest technician location | Overwritten | Cleared at end of shift |

## 5. UK GDPR and DUAA (Data (Use and Access) Act 2025) review checklist
- [ ] Record of processing activities (ROPA) entries for each module
- [ ] Privacy notice for field workers (tenant-facing template) and customers
- [ ] Lawful basis and LIA documented for location, contact data and certificates
- [ ] Data processing agreement (DPA) template for tenants; sub-processor list
- [ ] Data subject rights: access/export and deletion endpoints (Phase 5 compliance pack)
- [ ] DUAA changes reviewed: recognised legitimate interests, complaints-handling requirement, automated decision-making rules (no ADM in v1), and changes to cookie consent rules for the web apps
- [ ] International transfers: none intended (UK residency); verify each sub-processor
- [ ] Breach procedure (72-hour ICO notification) in the incident runbook
- [ ] Retention schedule approved
- [ ] DPIA signed before any production location tracking

## 6. BS 5839 / BS 5266 record requirements (draft, domain expert to verify)
### BS 5839-1 (fire detection and fire alarm systems: non-domestic)
- Periodic inspection and servicing at intervals **not exceeding 6 months** (recommended; risk assessment may require more).
- Record: premises, system, date, engineer and company, devices tested (≥ the required proportion per visit so all devices are tested annually), faults found, actions taken, false alarm records, variations.
- Certificate types: design, installation, commissioning, acceptance, verification, **inspection & servicing**, modification.
- Logbook entries for all events.
### BS 5266-1 (emergency lighting)
- **Monthly** functional test (short "flick" test), and an **annual** full rated-duration test (typically 3 h).
- Record: date, luminaires tested, duration, results, defects, remedial actions, competent person.
- Certificates: completion, periodic inspection & test.
### Platform requirements derived
- Checklist templates per standard and visit type (Sprint 4).
- Certificates generated only from **completed and verified** jobs. They are **immutable once
  issued**; corrections create a new version that supersedes the old one (Sprint 5).
- Retention ≥ 6 years (TODO: confirm with expert/insurer requirements).
- PM schedule default intervals: BS 5839 = 6 months; BS 5266 = monthly + annual (two schedules).
