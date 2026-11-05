# PRD 14 — Offline sync
Linked Figma frame: TODO (`Mobile / Sync Status`) · Contract: `packages/contracts/openapi/fieldwork.yaml` · Sprint 4

## User stories
- As a technician in a basement plant room with no signal, I can still open my jobs, complete checklists and capture photos; everything syncs when I'm back online.

## Design
- Local store: expo-sqlite (jobs, sites, assets, checklist templates for assigned jobs).
- Mutation queue: each item has a client-generated UUID and `Idempotency-Key`, and retries with exponential backoff (1 s → 5 min, with jitter).
- API: the `idempotency_record` table returns the original response on replay. Payload mismatch for the same key → 422.
- Conflicts: job **status** is server-authoritative (an invalid transition → mark it "needs attention" locally); checklist answers use last-writer-wins per item by `answered_at`; photos are append-only.

## Acceptance criteria
```gherkin
Feature: Offline sync
  Scenario: Work offline
    Given I loaded today's jobs while online
    When I go offline and complete a checklist
    Then the answers are saved locally and queued

  Scenario: Idempotent replay
    Given a queued "complete job" mutation was sent but the response was lost
    When the app retries with the same Idempotency-Key
    Then the API returns the original response and the job is completed once

  Scenario: Same key, different payload
    When a request reuses a key with a different body
    Then the API returns 422

  Scenario: Server rejects stale transition
    Given ops cancelled the job while I was offline
    When my "complete" mutation syncs
    Then it is rejected with 409 and the job shows "needs attention"
```
