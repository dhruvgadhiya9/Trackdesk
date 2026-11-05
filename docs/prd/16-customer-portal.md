# PRD 16 — Customer portal (apps/customer)
Linked Figma frame: TODO · Contract: `packages/contracts/openapi/portal.yaml` · Sprint 5

## Roles affected
customer (users invited by the contractor, linked to one customer record).

## User stories
- As a facilities manager, I log in to see my sites and assets, job history, upcoming maintenance and download certificates.
- As a facilities manager, I request a job (e.g. "faulty detector in Block C").

## Acceptance criteria
```gherkin
Feature: Customer portal
  Scenario: See only my records
    Given I am a customer user of "Northside Academy" in tenant A
    And tenant A also services "Oakwood Retail"
    When I list sites, jobs or certificates
    Then I only see "Northside Academy" records

  Scenario: Download a certificate
    When I download an issued certificate
    Then I receive a short-lived signed URL to the PDF

  Scenario: Request a job
    When I submit a request for site "Main Building" with a description
    Then a job_request is created with status "new" and ops is notified

  Scenario: Cannot see internal fields
    Then Happy Code hashes, internal notes and technician locations are never returned
```

## States
Loading, empty ("No certificates yet"), error.
