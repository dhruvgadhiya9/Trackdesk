# PRD 05 — Teams (and technician skills, working hours)
Linked Figma frame: TODO · Contract: `packages/contracts/openapi/teams.yaml` · Sprint 1

## Roles affected
company_owner, ops_manager (manage); field_worker (view own team, own skills and hours).

## User stories
- As an ops manager, I group technicians into teams (e.g. "North", "Emergency Lighting"), so I can filter the dispatch board.
- As an ops manager, I record each technician's skills (BS 5839, BS 5266, FIA-certified) and working hours, so dispatch suggestions respect them.

## Acceptance criteria
```gherkin
Feature: Teams
  Scenario: Create a team and add members
    When I create team "North" and add two field workers
    Then the team lists both members

  Scenario: Only field workers and ops managers can be members
    When I add a customer user to a team
    Then the response is 400

  Scenario: Set working hours
    When I set Monday 08:00–17:00 for a technician
    Then dispatch treats them as available in that window (Europe/London)

  Scenario: Overlapping working hours are rejected
    When I add Monday 16:00–18:00 overlapping 08:00–17:00
    Then the response is 400

  Scenario: Cross-tenant access is impossible
    When I add a user from tenant B to my team
    Then the response is 404
```

## States
Loading, empty ("No teams — create one"), error.
