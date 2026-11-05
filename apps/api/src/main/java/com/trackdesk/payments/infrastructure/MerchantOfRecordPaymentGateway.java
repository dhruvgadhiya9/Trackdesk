// SECURITY-REVIEW-REQUIRED: merchant-of-record adapter stub (billing route undecided).
package com.trackdesk.payments.infrastructure;

import com.trackdesk.payments.application.PaymentGateway;
import java.math.BigDecimal;
import java.util.UUID;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

/** Stub: implemented only if Mitul chooses the merchant-of-record route (scope 5.1, option B). */
@Component
@ConditionalOnProperty(name = "trackdesk.payments.provider", havingValue = "mor")
public class MerchantOfRecordPaymentGateway implements PaymentGateway {

  @Override
  public PayLinkResult createPayLink(
      UUID tenantId, UUID invoiceId, BigDecimal amountGbp, String reference) {
    throw new UnsupportedOperationException("Merchant-of-record adapter not implemented");
  }

  @Override
  public WebhookEvent verifyWebhook(String payload, String signatureHeader) {
    throw new UnsupportedOperationException("Merchant-of-record adapter not implemented");
  }
}
