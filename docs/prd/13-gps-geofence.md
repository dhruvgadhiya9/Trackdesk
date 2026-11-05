# PRD 13 — GPS tracking and geofence arrival (with consent)
Linked Figma frame: TODO (`Mobile / Location Consent`, `Mobile / What We Collect`) · Contract: `packages/contracts/openapi/fieldwork.yaml` · Sprint 4
**SECURITY-REVIEW-REQUIRED · DPO sign-off required** (see `docs/11-compliance.md`)

## User stories
- As a technician, I understand and consent to location tracking only while on jobs during working hours, and I can revoke it.
- As an ops manager, I see technicians' live positions and automatic arrival at sites.
- As a technician, I can see exactly what location data is collected about me.

## Acceptance criteria
```gherkin
Feature: Location with consent
  Scenario: No tracking without consent
    Given I have not consented
    Then no location is collected and arrival is confirmed manually

  Scenario: Tracking only during working hours and active jobs
    Given I consented and my shift is 08:00–17:00
    When I have a job en_route at 10:00
    Then pings are sent every 30 seconds
    When the time is 17:01 or no job is active
    Then tracking stops

  Scenario: Server rejects out-of-policy pings
    When a ping arrives outside working hours
    Then the API responds 422 and stores nothing

  Scenario: Geofence arrival
    Given the site location and a radius of 100 m
    When a ping is within 100 m (ST_DWithin)
    Then the job moves en_route → on_site automatically with reason "geofence"

  Scenario: Visible indicator and transparency
    Then a "Tracking on" indicator is visible while tracking
    And the "What we collect" screen lists my last 24 h of points

  Scenario: Revoke consent
    When I revoke consent
    Then tracking stops immediately and the revocation is recorded
```
