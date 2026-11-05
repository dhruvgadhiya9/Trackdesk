# PRD 20 — Payments
Linked Figma frame: TODO · Contract: `packages/contracts/openapi/billing.yaml` · Sprint 6
**SECURITY-REVIEW-REQUIRED · payment flow sign-off is human-only**

## Design
`PaymentGateway` port → `StripePaymentGateway` (test mode keys from env only) or the
`MerchantOfRecordPaymentGateway` stub, chosen by `trackdesk.payments.provider`, pending the
billing-route decision (scope §5.1).

## Acceptance criteria
```gherkin
Feature: Payments
  Scenario: Pay link
    When I create a pay link for an unpaid invoice
    Then a Stripe Checkout session is created with the invoice amount in GBP

  Scenario: Webhook signature verification
    When a webhook arrives with an invalid signature
    Then the response is 400 and nothing is processed

  Scenario: Idempotent webhook processing
    When the same event id is delivered twice
    Then the payment is recorded once (processed_webhook_event)

  Scenario: Failure and refund paths
    When a payment fails or is refunded
    Then the invoice status and payment rows reflect it and an audit event is recorded
```
