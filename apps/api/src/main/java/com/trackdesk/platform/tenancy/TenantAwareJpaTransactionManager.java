// SECURITY-REVIEW-REQUIRED: tenant isolation — writes RLS settings at the start of EVERY
// transaction and enables the Hibernate tenant filter (second layer).
package com.trackdesk.platform.tenancy;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import java.sql.PreparedStatement;
import java.util.LinkedHashMap;
import java.util.Map;
import org.hibernate.Session;
import org.springframework.orm.jpa.EntityManagerHolder;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.support.TransactionSynchronizationManager;

/**
 * JPA transaction manager that runs {@code select set_config('app.tenant_id', ?, true)} (plus
 * {@code app.user_id}, {@code app.role}, {@code app.customer_id} and any extra {@code app.*}
 * settings) as the first statement of every transaction. {@code is_local = true} scopes the values
 * to the transaction, so a pooled connection never leaks a tenant to the next borrower.
 *
 * <p>With no principal every value is written as {@code ''}, which the RLS helpers treat as NULL:
 * queries fail closed (return no rows / reject writes).
 */
public class TenantAwareJpaTransactionManager extends JpaTransactionManager {

  static final String TENANT_FILTER = "tenantFilter";

  public TenantAwareJpaTransactionManager(EntityManagerFactory emf) {
    super(emf);
  }

  @Override
  protected void doBegin(Object transaction, TransactionDefinition definition) {
    super.doBegin(transaction, definition);
    EntityManagerHolder holder =
        (EntityManagerHolder)
            TransactionSynchronizationManager.getResource(obtainEntityManagerFactory());
    if (holder == null) {
      throw new IllegalStateException("No EntityManager bound after transaction begin");
    }
    applyTenantSettings(holder.getEntityManager());
  }

  private void applyTenantSettings(EntityManager entityManager) {
    TenantPrincipal principal = TenantContext.current().orElse(null);
    Map<String, String> settings = new LinkedHashMap<>();
    settings.put("app.tenant_id", principal == null ? null : str(principal.tenantId()));
    settings.put("app.user_id", principal == null ? null : str(principal.userId()));
    settings.put("app.role", principal == null || !principal.hasTenant() ? null : principal.role());
    settings.put("app.customer_id", principal == null ? null : str(principal.customerId()));
    settings.put("app.invite_token_hash", null);
    settings.putAll(TenantContext.extraSettings());

    Session session = entityManager.unwrap(Session.class);
    session.doWork(
        connection -> {
          for (Map.Entry<String, String> setting : settings.entrySet()) {
            try (PreparedStatement ps =
                connection.prepareStatement("select set_config(?, ?, true)")) {
              ps.setString(1, setting.getKey());
              ps.setString(2, setting.getValue() == null ? "" : setting.getValue());
              ps.execute();
            }
          }
        });

    if (principal != null && principal.hasTenant()) {
      session.enableFilter(TENANT_FILTER).setParameter("tenantId", principal.tenantId());
    } else {
      session.disableFilter(TENANT_FILTER);
    }
  }

  private static String str(Object value) {
    return value == null ? null : value.toString();
  }
}
