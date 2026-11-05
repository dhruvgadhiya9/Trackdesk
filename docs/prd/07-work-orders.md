# PRD 07 — Work orders
Linked Figma frame: TODO · Contract: `packages/contracts/openapi/workorders.yaml` · Sprint 2

## Roles affected
company_owner, ops_manager (CRUD); customer (view own; create via job request); field_worker (view through job).

## User stories
- As an ops manager, I raise a work order for a customer's site covering specific assets (e.g. "replace 3 failed emergency lights"), and create one or more jobs from it.

## Acceptance criteria
```gherkin
Feature: Work orders
  Scenario: Create a work order with assets
    Given site "Main Building" with 3 emergency lights
    When I create a work order for 2 of them
    Then the work order lists those 2 assets and has status "open"

  Scenario: Assets must belong to the work order's site
    When I add an asset from another site
    Then the response is 400

  Scenario: Create a job from a work order
    When I create a job from the work order
    Then the job references the work order, customer and site

  Scenario: Work order closes when all jobs are verified
    Given all jobs of the work order are verified
    Then the work order status becomes "completed"

  Scenario: Cross-tenant access is impossible
    When I access a tenant B work order
    Then the response is 404
```

## States
Loading, empty, error.
