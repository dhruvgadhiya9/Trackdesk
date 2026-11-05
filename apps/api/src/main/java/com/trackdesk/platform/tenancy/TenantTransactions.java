// SECURITY-REVIEW-REQUIRED: privileged paths that switch tenant context (onboarding, invites).
package com.trackdesk.platform.tenancy;

import java.util.Map;
import java.util.function.Supplier;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

/**
 * Starts a NEW transaction under an explicit principal, so the RLS settings written at transaction
 * start reflect it. Only for trusted server flows where the caller has no tenant yet (company
 * sign-up, invitation acceptance). Callers must not already be inside a transaction.
 */
@Component
public class TenantTransactions {

  private final TransactionTemplate transactionTemplate;

  public TenantTransactions(PlatformTransactionManager transactionManager) {
    this.transactionTemplate = new TransactionTemplate(transactionManager);
    this.transactionTemplate.setPropagationBehavior(TransactionTemplate.PROPAGATION_REQUIRES_NEW);
  }

  public <T> T runAs(TenantPrincipal principal, Map<String, String> settings, Supplier<T> work) {
    return TenantContext.callAs(
        principal, settings, () -> transactionTemplate.execute(status -> work.get()));
  }

  public <T> T runAs(TenantPrincipal principal, Supplier<T> work) {
    return runAs(principal, Map.of(), work);
  }
}
