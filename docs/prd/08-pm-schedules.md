# PRD 08 — Planned-maintenance (PM) schedules
Linked Figma frame: TODO · Contract: `packages/contracts/openapi/maintenance.yaml` · Sprint 2

## Roles affected
company_owner, ops_manager (CRUD); customer (view upcoming maintenance).

## User stories
- As an ops manager, I set up statutory servicing schedules per site (BS 5839 six-monthly service; BS 5266 monthly functional and annual duration tests), so jobs are created automatically and nothing becomes overdue.

## Acceptance criteria
```gherkin
Feature: PM schedules
  Scenario: Default intervals by standard
    When I create a BS 5839 schedule for a site
    Then interval_months defaults to 6
    When I create a BS 5266 annual schedule
    Then interval_months defaults to 12

  Scenario: Job generation is idempotent
    Given a schedule due on 2027-01-15 with lead_days 14
    When the generator runs twice on 2027-01-01
    Then exactly one draft job exists for that due date
    And next_due_on advances to 2027-07-15

  Scenario: Only one instance runs the generator
    Given two API instances
    Then ShedLock ensures a single run per interval

  Scenario: SLA timer marks jobs overdue
    Given a scheduled job whose sla_due_at has passed and is not completed
    When the SLA job runs
    Then the job status is "overdue" and ops is notified

  Scenario: Cross-tenant access is impossible
    When I access a tenant B schedule
    Then the response is 404
```

## Edge cases
Month-end dates (31 Jan + 1 month → 28/29 Feb). Paused schedules do not generate. Changing the interval recalculates only future dates.

## States
Loading, empty ("No maintenance scheduled for this site"), error.
