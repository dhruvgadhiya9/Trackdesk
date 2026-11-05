# PRD 21 — Reporting
Linked Figma frame: TODO · Contract: `packages/contracts/openapi/reporting-chat.yaml` · Sprint 6

## User stories
- As a company owner, I see jobs completed, SLA compliance %, overdue maintenance, revenue and technician utilisation for a date range.

## Acceptance criteria
```gherkin
Feature: Reporting
  Scenario: SLA compliance
    Given 10 jobs completed in range, 9 before sla_due_at
    Then SLA compliance is 90%

  Scenario: Overdue maintenance
    Then schedules with next_due_on in the past and no open job are listed

  Scenario: Technician utilisation
    Then utilisation = booked job hours / working hours in range

  Scenario: Tenant scoped
    Then reports only ever include the caller's tenant data
```
Queries live in repositories only. Field workers have no access; customers see a limited summary in the portal.
