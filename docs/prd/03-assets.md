# PRD 03 — Assets (BS 5839 / BS 5266)
Linked Figma frame: TODO · Contract: `packages/contracts/openapi/assets.yaml` · Sprint 1

## Roles affected
company_owner, ops_manager (CRUD); field_worker (view, update condition/notes on assigned jobs); customer (view own).

## User stories
- As an ops manager, I register the fire-alarm and emergency-lighting equipment at a site, so servicing visits cover every device.
- As a technician, I see the asset list for the site I'm at, with locations, so I can test each one.

## Asset types
`fire_alarm_panel`, `smoke_detector`, `heat_detector`, `call_point`, `sounder`, `beacon` (BS 5839);
`emergency_light`, `exit_sign`, `central_battery` (BS 5266); `other`.

## Acceptance criteria
```gherkin
Feature: Assets
  Scenario: Register an emergency light
    Given site "Main Building" exists
    When I create an asset of type "emergency_light" with location description "Stairwell B, level 2"
    Then the asset is created with standard "BS5266"

  Scenario: Standard is derived from type
    When I create an asset of type "smoke_detector"
    Then its standard is "BS5839"

  Scenario: Optional indoor point location
    When I create an asset with latitude and longitude
    Then a PostGIS point is stored

  Scenario: Bulk import (CSV)
    When I upload a CSV of 200 detectors for a site
    Then valid rows are created and invalid rows are reported with line numbers

  Scenario: Cross-tenant access is impossible
    Given tenant B has an asset
    When I access it as tenant A
    Then the response is 404
```

## Edge cases
Duplicate serial numbers within a site produce a warning. Decommissioned assets are kept for history and excluded from checklists.

## States
Loading, empty ("No assets registered — import CSV or add manually"), error.
