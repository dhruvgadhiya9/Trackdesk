# PRD 19 — Invoices
Linked Figma frame: TODO · Contract: `packages/contracts/openapi/billing.yaml` · Sprint 6

## User stories
- As an ops manager, I generate an invoice from a verified job, with UK VAT, and send it with a pay link.

## Acceptance criteria
```gherkin
Feature: Invoices
  Scenario: Invoice from verified job
    Given a verified job with priced lines
    When I generate an invoice
    Then the invoice totals use BigDecimal with HALF_UP rounding per line
    And the job moves verified → invoiced

  Scenario: Sequential references per tenant
    Then invoice references are unique and sequential per tenant (e.g. INV-000123)

  Scenario: Issued invoices are immutable
    When I edit an issued invoice
    Then the response is 409 and a credit note is required (deferred)

  Scenario: Overdue
    Given due_on has passed and the invoice is unpaid
    Then its status is "overdue"
```
