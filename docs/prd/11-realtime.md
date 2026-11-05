# PRD 11 — Realtime updates
Linked Figma frame: N/A · Mechanism: Supabase Realtime (Postgres Changes + Broadcast) · Sprint 3

## User stories
- As an ops manager, job status changes and technician locations update the dispatch board live.

## Acceptance criteria
```gherkin
Feature: Realtime
  Scenario: Job status change appears live
    Given I have the dispatch board open
    When a technician marks a job on_site
    Then the job card updates within 2 seconds

  Scenario: Technician location updates live
    When a technician's location is updated
    Then their marker moves on the map

  Scenario: Tenant isolation for realtime
    Given ops users from tenant A and tenant B are subscribed
    When a tenant B job changes
    Then the tenant A subscriber receives no event

  Scenario: Reconnect
    When the connection drops and returns
    Then the board refetches state and resubscribes
```

## Notes
Realtime relies on RLS evaluated with the subscriber's JWT. Only `job`, `technician_location_latest` and `chat_message` are published, with `SELECT` granted to `authenticated`. SECURITY-REVIEW-REQUIRED.
