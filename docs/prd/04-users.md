# PRD 04 — Users
Linked Figma frame: TODO · Contract: `packages/contracts/openapi/users.yaml` · Sprint 1 (invites in Sprint 0)

## Roles affected
company_owner (all, incl. role changes); ops_manager (invite field workers/customers, view users); others (view self).

## User stories
- As a company owner, I see all users in my company with their roles and status.
- As a company owner, I change a user's role or disable a user, so leavers lose access immediately.
- As any user, I update my name and phone.

## Acceptance criteria
```gherkin
Feature: Users
  Scenario: List users
    Given I am company_owner
    When I list users
    Then I see all users of my tenant with role and status

  Scenario: Ops manager cannot grant company_owner
    Given I am ops_manager
    When I invite a user with role "company_owner"
    Then the response is 403

  Scenario: Disable a user
    Given I am company_owner
    When I disable user "tech@example.test"
    Then their status is "disabled"
    And their auth app_metadata is updated so new tokens are rejected
    And an audit event "user.disabled" is recorded

  Scenario: Owner cannot remove the last company_owner
    When I change the only company_owner's role
    Then the response is 409

  Scenario: Cross-tenant access is impossible
    When I get a user id from tenant B
    Then the response is 404
```

## Edge cases
Email changes go through Supabase Auth. A disabled user's existing JWT stays valid until expiry (keep the access-token TTL short, ≤ 15 min; TODO Tech Lead).

## States
Loading, empty (only you, with a "Invite your team" call to action), error.
