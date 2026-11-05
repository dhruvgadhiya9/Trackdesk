# PRD 10 — Dispatch board
Linked Figma frame: TODO (`Ops / Dispatch Board`) · Contract: `packages/contracts/openapi/dispatch.yaml` · Sprint 3
Path: `apps/web/app/(ops)/dispatch/page.tsx`

## Roles affected
ops_manager, company_owner.

## User stories
- As an ops manager, I see a day timeline per technician, an unassigned jobs queue and a map, so I can plan the day.
- As an ops manager, I drag a job from the queue onto a technician's timeline slot to assign and schedule it.

## Acceptance criteria
```gherkin
Feature: Dispatch board
  Scenario: Board shows the day
    Given 5 technicians and 12 jobs today, 3 unassigned
    When I open the dispatch board for today
    Then I see 5 timeline rows, 9 jobs on timelines and 3 in the queue

  Scenario: Drag to assign
    When I drag an unassigned job to T1 at 10:00
    Then the job is assigned to T1, scheduled 10:00 for its duration, and shows on T1's row
    And other ops users see the change without refreshing

  Scenario: Invalid drop is rejected
    When I drop a job onto an off-shift slot
    Then the job returns to the queue with an error toast

  Scenario: Overdue jobs are highlighted
    Then overdue jobs show the "Overdue" badge

  Scenario: Responsive
    Then the board is usable at 1280 and 1440 widths
```

## States
Loading skeleton timeline; empty "No jobs today"; error with retry; realtime-disconnected banner.
