# PRD 17 — Compliance certificates and records
Linked Figma frame: TODO (certificate PDF layout) · Contract: `packages/contracts/openapi/compliance.yaml` · Sprint 5
**SECURITY-REVIEW-REQUIRED · requires compliance advisor sign-off**

## User stories
- As an ops manager, I issue a BS 5839 inspection & servicing certificate or a BS 5266 periodic test certificate from a verified job, so the customer has the statutory record.
- As an ops manager, I correct an issued certificate by issuing a new version; the old one is marked superseded, never edited.

## Acceptance criteria
```gherkin
Feature: Certificates
  Scenario: Generate from a verified job
    Given a verified BS 5839 servicing job with a complete checklist
    When I issue a certificate
    Then a PDF is generated (OpenPDF/PDFBox) and stored with its SHA-256
    And the certificate is "issued", version 1

  Scenario: Cannot issue from an unverified job
    Given a completed but unverified job
    When I issue a certificate
    Then the response is 409

  Scenario: Immutable once issued
    When anyone tries to update an issued certificate
    Then the database rejects the change

  Scenario: Correction by new version
    When I issue a correction with a reason
    Then version 2 is issued with supersedes_id = v1 and v1 becomes "superseded"

  Scenario: Retention
    Then certificates are retained for at least 6 years (TODO confirm)
```
