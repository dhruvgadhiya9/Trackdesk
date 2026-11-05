package com.trackdesk.payments.infrastructure;

import com.trackdesk.payments.application.PaymentGateway;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

/** Local/test adapter: no network, deterministic pay links, accepts "fake-signature" only. */
@Component
@ConditionalOnProperty(
    name = "trackdesk.payments.provider",
    havingValue = "fake",
    matchIfMissing = true)
public class FakePaymentGateway implements PaymentGateway {

  @Override
  public PayLinkResult createPayLink(
      UUID tenantId, UUID invoiceId, BigDecimal amountGbp, String reference) {
    String ref = "fake_" + invoiceId;
    return new PayLinkResult(
        "https://pay.example.test/" + ref, Instant.now().plus(1, ChronoUnit.DAYS), ref);
  }

  @Override
  public WebhookEvent verifyWebhook(String payload, String signatureHeader) {
    if (!"fake-signature".equals(signatureHeader)) {
      throw new IllegalArgumentException("Invalid webhook signature");
    }
    throw new UnsupportedOperationException("Fake webhook parsing arrives in Sprint 6");
  }
}
