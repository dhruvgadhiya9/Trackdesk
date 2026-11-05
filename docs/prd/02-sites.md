# PRD 02 — Sites
Linked Figma frame: TODO · Contract: `packages/contracts/openapi/sites.yaml` · Sprint 1

## Roles affected
company_owner, ops_manager (CRUD); field_worker (view sites of assigned jobs); customer (view own sites).

## User stories
- As an ops manager, I add a site to a customer with an address and map location, so technicians can find it and geofencing works.
- As an ops manager, I record access notes (key safe, contact, parking), so technicians can get in.

## Acceptance criteria
```gherkin
Feature: Sites
  Scenario: Create a site with geocoded location
    Given I am an ops_manager and customer "Northside Academy" exists
    When I create site "Main Building" with postcode "LS1 4AP"
    Then the site is created under that customer
    And its location is geocoded through the maps adapter and stored as a PostGIS point

  Scenario: Manual pin overrides geocoding
    When I create a site with latitude 53.7997 and longitude -1.5492
    Then the stored location equals that point

  Scenario: Site requires an existing customer in my tenant
    When I create a site for a customer id from tenant B
    Then the response is 404

  Scenario: Customer sees only own sites
    Given I am a customer user of "Northside Academy"
    When I list sites
    Then I only see sites of "Northside Academy"

  Scenario: Cross-tenant access is impossible
    Given tenant B has a site
    When I get, update or delete it as tenant A
    Then the response is 404
```

## Edge cases
UK postcode validation. Geocoding fails: save without a location and flag "location missing" (geofence disabled). Archiving a site with active PM schedules prompts for confirmation.

## States
Loading map skeleton; empty "No sites for this customer"; error with retry; geocode failure inline warning.
