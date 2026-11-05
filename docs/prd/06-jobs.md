# PRD 06 — Jobs (state machine)
Linked Figma frame: TODO · Contract: `packages/contracts/openapi/jobs.yaml` · Sprint 2

## Roles affected
company_owner, ops_manager (all); field_worker (assigned jobs, field transitions only); customer (view own jobs, limited fields).

## State machine
```
draft → scheduled → dispatched → en_route → on_site → completed → verified → invoiced
any non-terminal (draft..on_site) → cancelled
scheduled | dispatched → overdue (system, when sla_due_at passes) → dispatched | cancelled
```
| Transition | Who |
|---|---|
| draft→scheduled, scheduled→dispatched, →cancelled | ops_manager, company_owner |
| dispatched→en_route→on_site→completed | assigned field_worker (ops can override) |
| completed→verified | system after Happy Code, or ops with a reason |
| verified→invoiced | system (invoice created) |
| →overdue | system only |

## Acceptance criteria
```gherkin
Feature: Job lifecycle
  Scenario: Allowed transition records history and publishes an event
    Given a job in "scheduled" assigned to technician T
    When ops dispatches it
    Then status is "dispatched"
    And job_status_history has a row scheduled→dispatched
    And a JobStatusChanged event is published

  Scenario Outline: Forbidden transitions are rejected
    Given a job in "<from>"
    When I transition it to "<to>"
    Then the response is 409 Problem Details "invalid-transition"
    Examples:
      | from      | to        |
      | draft     | completed |
      | completed | en_route  |
      | invoiced  | cancelled |

  Scenario: Field worker can only move their own assigned jobs
    Given a job assigned to another technician
    When I mark it en_route
    Then the response is 404

  Scenario: Job cannot be dispatched without an assignee
    Given a scheduled job with no technician
    When ops dispatches it
    Then the response is 409

  Scenario: Cross-tenant access is impossible
    When I get or transition a job from tenant B
    Then the response is 404
```

## Edge cases
Concurrent transitions (optimistic locking: 409). Offline transitions replayed later with idempotency keys. Cancelled jobs keep their history.

## States
Job list: loading, empty, error. Detail: status timeline.
