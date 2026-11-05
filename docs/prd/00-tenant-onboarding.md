# PRD 00 — Tenant onboarding (sign up → company → invite → log in)
Linked Figma frame: TODO · Contract: `packages/contracts/openapi/tenants.yaml`, `users.yaml` · Sprint 0

## Roles affected
Anyone signing up (becomes company_owner), company_owner, ops_manager, invited users (field_worker, ops_manager, customer).

## User stories
- As a contractor owner, I sign up with email and password and create my company, so I can start using TrackDesk.
- As a company owner, I invite a field worker or ops manager by email, so they can join my company.
- As an invited worker, I accept the invite, set my password and log in on web or mobile.

## Acceptance criteria
```gherkin
Feature: Tenant onboarding
  Scenario: Owner creates a company after sign-up
    Given I have signed up with Supabase Auth and have no company
    When I POST /v1/tenants with name "Acme Fire Ltd"
    Then a tenant is created with country "GB"
    And I become a user of that tenant with role "company_owner"
    And my auth app_metadata contains the tenant_id and role
    And an audit event "tenant.created" is recorded

  Scenario: A user who already belongs to a company cannot create another
    Given I belong to tenant "Acme Fire Ltd"
    When I POST /v1/tenants
    Then I receive 409 Problem Details "already-member"

  Scenario: Owner invites a field worker
    Given I am company_owner of "Acme Fire Ltd"
    When I POST /v1/invitations with email "tech@example.test" and role "field_worker"
    Then an invitation is created that expires in 7 days
    And an invite email is sent with a one-time token
    And only the token hash is stored

  Scenario: Field worker cannot invite
    Given I am a field_worker
    When I POST /v1/invitations
    Then I receive 403

  Scenario: Invitee accepts
    Given a valid invitation token for "tech@example.test"
    And I am signed up with email "tech@example.test" and have no company
    When I POST /v1/invitations/accept with the token
    Then I become a user of the inviting tenant with role "field_worker"
    And the invitation is marked accepted

  Scenario: Expired, used or mismatched invitations are rejected
    Given an invitation that is expired, already accepted, or for a different email
    When I POST /v1/invitations/accept
    Then I receive 410 or 403 Problem Details and no user is created

  Scenario: Current user profile
    Given I am logged in
    When I GET /v1/me
    Then I receive my user id, tenant, role and permissions
```

## Edge cases
Duplicate company names are allowed (the slug gets a suffix). Re-inviting the same email revokes the previous pending invite. portal_owner cannot be invited through tenant invitations. Customer invites require `customerId`.

## States
- Loading: company creation spinner.
- Empty: no invitations ("Invite your first technician").
- Error: email taken, invite expired, network error with retry.
