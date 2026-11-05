# PRD 09 — Scheduling (assignment rules)
Linked Figma frame: TODO · Contract: `packages/contracts/openapi/dispatch.yaml` · Sprint 3

## Roles affected
ops_manager, company_owner.

## User stories
- As an ops manager, I get ranked technician suggestions for a job based on availability, skills, working hours and distance, so I assign the right person quickly.

## Rules (pure Java class `AssignmentRules`, human-designed)
1. Hard filters: has the required skill for the job's standard; within working hours for the slot; no overlapping job; active user.
2. Ranking: distance from the previous job location (or home base) to the site (PostGIS `ST_Distance`), then current load.

## Acceptance criteria
```gherkin
Feature: Assignment suggestions
  Scenario: Unskilled technicians are excluded
    Given a BS 5266 job and technician T1 without the BS5266 skill
    When I request suggestions
    Then T1 is not suggested

  Scenario: Off-shift technicians are excluded
    Given the slot is 18:00–19:00 and T2 works 08:00–17:00
    Then T2 is not suggested

  Scenario: Nearest technician ranks first
    Given T3 is 2 km and T4 is 15 km from the site
    Then T3 ranks above T4

  Scenario: Double booking is rejected
    When I assign T3 to an overlapping slot
    Then the response is 409
```

## States
Suggestions panel: loading, "no available technicians" empty state, error.
