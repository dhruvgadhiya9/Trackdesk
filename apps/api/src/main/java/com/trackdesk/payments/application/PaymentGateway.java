// SECURITY-REVIEW-REQUIRED: payment port — payment flow sign-off is human-only.
package com.trackdesk.payments.application;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Port for collecting invoice payments. Implementations: FakePaymentGateway (local/test),
 * MerchantOfRecordPaymentGateway (stub) and, in Sprint 6, StripePaymentGateway (Stripe Java SDK,
 * test-mode keys from env only). Chosen by {@code trackdesk.payments.provider} pending the
 * billing-route decision (docs/00-scope-statement.md section 5.1).
 */
public interface PaymentGateway {

  PayLinkResult createPayLink(
      UUID tenantId, UUID invoiceId, BigDecimal amountGbp, String reference);

  /** Verifies the provider signature; throws if invalid. Returns the parsed event. */
  WebhookEvent verifyWebhook(String payload, String signatureHeader);

  record PayLinkResult(String url, Instant expiresAt, String providerRef) {}

  record WebhookEvent(String eventId, String type, String providerRef, BigDecimal amountGbp) {}
}
