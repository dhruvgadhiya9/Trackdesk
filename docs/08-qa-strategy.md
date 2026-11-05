# QA Strategy

## Test layers
| Layer | What | Who | AI tool | When it runs |
|---|---|---|---|---|
| Unit (Java) | Domain rules, state machine, services: JUnit 5, Mockito, AssertJ | Backend devs | Claude Code test-writer agent | Every push (`./gradlew test`) |
| Unit (TS) | Hooks, utils, sync queue: Vitest | Frontend / mobile devs | Claude Code | Every push |
| API integration | Spring Boot + Testcontainers (postgis) + Flyway, MockMvc/RestAssured; one test per Gherkin scenario | Backend devs | Claude Code from Gherkin | Every PR |
| Tenant isolation | DB-level RLS suite + API cross-tenant tests for every endpoint; fail-closed checks | Tech Lead owns | rls-reviewer agent | Every PR (blocking) |
| Architecture | Spring Modulith verify + ArchUnit | Tech Lead | — | Every PR |
| Contract | Codegen drift check; Zod parse of mock factories | All | — | Every PR |
| Component / visual | Storybook + Vitest; Playwright screenshots at 1280/1440 | Frontend + Designer | figma-screen-builder agent | Every PR (visual diffs reviewed by a human) |
| E2E web | Playwright: critical journeys | QA | Claude (from Gherkin) | Nightly against staging |
| E2E mobile | Maestro flows | QA + Mobile | Claude | Nightly / pre-release on a device farm |
| Accessibility | axe in Playwright (WCAG 2.1 AA) | QA | — | Every PR from Phase 5 |
| Load | k6 against NFR targets | Tech Lead + QA | Claude drafts scripts | Phase 5 and before major releases |
| Compliance packs | Consent, location retention, data export/deletion, certificate immutability, BS 5839/5266 record fields | QA + Compliance | Claude drafts, human signs | Every release |
| Field tests | Real devices on real sites | QA + Mobile | — | Every sprint from Sprint 4 |

## Field-test day plan (from Sprint 4, every sprint)
1. **Geofence walk:** walk in and out of a site boundary at 3 radii (50/100/200 m). Record
   arrival-detection latency and false positives.
2. **Poor signal / offline:** complete a full job in airplane mode or a basement. Reconnect and
   verify sync, with no duplicates and no lost answers.
3. **Battery drain:** 4-hour shift with tracking on, measured on iOS and Android reference devices
   against the NFR target.
4. **Real conditions:** gloves, sunlight glare, one-handed use, a ladder (photo capture).
5. Log the results in `docs/field-tests/<date>.md`. Defects go into the backlog with severity.

## Real-world checks AI cannot do
- Walking geofence boundaries with a real device
- Behaviour in poor signal, in lifts, in plant rooms
- Battery drain and OS background-kill behaviour on real devices
- Whether a BS 5839 / BS 5266 certificate would satisfy an inspector or insurer
- Usability for a technician on site
