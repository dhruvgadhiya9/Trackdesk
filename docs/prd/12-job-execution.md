# PRD 12 — Field job execution (checklists, photos, signatures)
Linked Figma frame: TODO (`Mobile / Job Detail`, `Mobile / Checklist`) · Contract: `packages/contracts/openapi/fieldwork.yaml` · Sprint 4

## Roles affected
field_worker (execute assigned jobs); ops_manager (view results).

## User stories
- As a technician, I see today's jobs, open one, and start → arrive → complete it.
- As a technician, I fill in the BS 5839 / BS 5266 checklist for each asset, take photos of defects and capture the customer's signature.

## Acceptance criteria
```gherkin
Feature: Job execution
  Scenario: Today's jobs
    Given I have 4 jobs today
    When I open the app
    Then I see them ordered by scheduled start, with site name and status

  Scenario: Complete requires a checklist
    Given a BS 5266 monthly test job
    When I try to complete it with unanswered required items
    Then I am shown the missing items and the job stays on_site

  Scenario: Photo upload via signed URL
    When I attach a photo
    Then the app requests a signed upload URL scoped to tenant/job
    And the photo uploads to Supabase Storage under tenants/<tenant_id>/jobs/<job_id>/

  Scenario: Signature capture
    When the customer signs on the device
    Then the signature image and signer name are stored with the job

  Scenario: Technician cannot access another technician's job
    When I request a job assigned to someone else
    Then the response is 404
```

## States
Today list: loading, empty ("No jobs today"), offline banner, error. Checklist progress indicator.
