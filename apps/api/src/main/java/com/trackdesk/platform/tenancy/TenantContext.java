// SECURITY-REVIEW-REQUIRED: tenant isolation — source of the values written to Postgres
// (app.tenant_id / app.user_id / app.role / app.customer_id) for RLS.
package com.trackdesk.platform.tenancy;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Supplier;

/**
 * Per-thread holder of the current {@link TenantPrincipal}. Set by {@link TenantContextFilter} from
 * the verified JWT and read by {@link TenantAwareJpaTransactionManager} at the start of every
 * transaction. Never set it from request input.
 */
public final class TenantContext {

  private static final ThreadLocal<TenantPrincipal> PRINCIPAL = new ThreadLocal<>();
  private static final ThreadLocal<Map<String, String>> EXTRA_SETTINGS =
      ThreadLocal.withInitial(Map::of);

  private TenantContext() {}

  public static Optional<TenantPrincipal> current() {
    return Optional.ofNullable(PRINCIPAL.get());
  }

  public static TenantPrincipal requirePrincipal() {
    return current().orElseThrow(() -> new MissingTenantContextException("No authenticated user"));
  }

  /** Current tenant id; throws (fail closed) if there is none. */
  public static UUID requireTenantId() {
    return current()
        .map(TenantPrincipal::tenantId)
        .orElseThrow(() -> new MissingTenantContextException("No tenant in context"));
  }

  /** Extra {@code app.*} settings (e.g. {@code app.invite_token_hash}) for capability policies. */
  public static Map<String, String> extraSettings() {
    return EXTRA_SETTINGS.get();
  }

  static void set(TenantPrincipal principal) {
    PRINCIPAL.set(principal);
  }

  static void clear() {
    PRINCIPAL.remove();
    EXTRA_SETTINGS.remove();
  }

  /**
   * Runs {@code work} as {@code principal} with extra DB settings, restoring the previous context
   * afterwards. Transactions must START inside {@code work} for the settings to apply.
   */
  public static <T> T callAs(
      TenantPrincipal principal, Map<String, String> extraSettings, Supplier<T> work) {
    for (String key : extraSettings.keySet()) {
      if (!key.startsWith("app.")) {
        throw new IllegalArgumentException("Only app.* settings are allowed: " + key);
      }
    }
    TenantPrincipal previous = PRINCIPAL.get();
    Map<String, String> previousSettings = EXTRA_SETTINGS.get();
    PRINCIPAL.set(principal);
    EXTRA_SETTINGS.set(Map.copyOf(extraSettings));
    try {
      return work.get();
    } finally {
      if (previous == null) {
        PRINCIPAL.remove();
      } else {
        PRINCIPAL.set(previous);
      }
      EXTRA_SETTINGS.set(previousSettings);
    }
  }

  public static <T> T callAs(TenantPrincipal principal, Supplier<T> work) {
    return callAs(principal, Map.of(), work);
  }

  /** Thrown when tenant-scoped work runs without a tenant (fail closed). */
  public static class MissingTenantContextException extends IllegalStateException {
    public MissingTenantContextException(String message) {
      super(message);
    }
  }
}
