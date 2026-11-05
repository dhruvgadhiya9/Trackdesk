# PRD 18 — Quotes
Linked Figma frame: TODO · Contract: `packages/contracts/openapi/quotes.yaml` · Sprint 6

## User stories
- As an ops manager, I create a quote with line items (VAT per line) for a customer's site and send it.
- As a customer, I accept a quote in the portal, which creates a job.

## Acceptance criteria
```gherkin
Feature: Quotes
  Scenario: Totals with UK VAT
    Given lines 2 × £45.00 at 20% and 1 × £10.00 at 0%
    Then subtotal is £100.00, VAT £18.00, total £118.00 (HALF_UP to 2 dp per line)

  Scenario: Accept creates a job
    When the customer accepts a sent, unexpired quote
    Then the quote is "accepted" and a draft job is created

  Scenario: Expired quote cannot be accepted
    Then the response is 409

  Scenario: Cross-tenant and cross-customer access is impossible
    Then other tenants and other customers get 404
```
