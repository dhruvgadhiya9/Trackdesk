# PRD 01 — Customers (reference module)
Linked Figma frame: TODO · Contract: `packages/contracts/openapi/customers.yaml` · Sprint 1

## Purpose
The organisations a contractor services (facilities managers, landlords, schools). Customers own sites.

## Roles affected
| Role | Access |
|---|---|
| company_owner, ops_manager | list, view, create, update, archive |
| field_worker | view (name/contact only, through jobs) |
| customer | view own customer record only |
| portal_owner | none (tenant data) |

## User stories
- As an ops manager, I can create a customer with a name, contact details and billing address, so I can add sites and jobs for them.
- As an ops manager, I can search and page through customers, so I can find one quickly.
- As an ops manager, I can edit a customer, and archive one we no longer work with, without losing history.

## Acceptance criteria
```gherkin
Feature: Customers
  Background:
    Given I am logged in as an ops_manager of tenant A

  Scenario: Create a customer
    When I create a customer named "Northside Academy" with email "fm@northside.example"
    Then the response is 201 with the customer id and status "active"
    And an audit event "customer.created" is recorded

  Scenario: Name is required
    When I create a customer with an empty name
    Then the response is 400 Problem Details listing field "name"

  Scenario: List customers with search and paging
    Given tenant A has customers "Northside Academy", "Oakwood Retail", "North Park Offices"
    When I list customers with search "north" page 0 size 20
    Then I see "North Park Offices" and "Northside Academy" sorted by name
    And the page metadata shows totalElements 2

  Scenario: Update a customer with optimistic locking
    Given customer "Oakwood Retail" at version 0
    When I update its phone with version 0
    Then the response is 200 and version is 1
    When I update it again with version 0
    Then the response is 409 Problem Details "conflict"

  Scenario: Archive a customer
    When I archive "Oakwood Retail"
    Then its status is "archived"
    And it is excluded from the default list but returned with status=archived

  Scenario: Field worker cannot create customers
    Given I am logged in as a field_worker of tenant A
    When I create a customer
    Then the response is 403

  Scenario: Cross-tenant access is impossible
    Given tenant B has customer "Secret Co"
    When I get, update or archive "Secret Co" as tenant A
    Then the response is 404
    And listing customers as tenant A never includes "Secret Co"
```

## Edge cases
Duplicate names are allowed (warn in UI). Account number is unique per tenant if set. Archiving a customer with open jobs is allowed in v1 (warn in UI; TODO PM). Max name length is 200.

## States
- Loading: table skeleton (LoadingState).
- Empty: "No customers yet" with an "Add customer" action (EmptyState).
- Error: ErrorState with retry; field errors from Problem Details shown inline.
