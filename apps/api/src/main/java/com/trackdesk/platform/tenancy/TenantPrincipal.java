package com.trackdesk.platform.tenancy;

import java.util.Optional;
import java.util.UUID;

/**
 * The verified caller. Built only from a validated JWT (or by trusted server code during
 * onboarding/invite acceptance). {@code tenantId}/{@code role} are null for a signed-up user who
 * has not created or joined a company yet.
 *
 * @param userId Supabase auth user id ({@code sub})
 * @param email verified email from the JWT
 * @param tenantId {@code app_metadata.tenant_id}
 * @param role {@code app_metadata.role}
 * @param customerId {@code app_metadata.customer_id} (customer role only)
 */
public record TenantPrincipal(
    UUID userId, String email, UUID tenantId, String role, UUID customerId) {

  public boolean hasTenant() {
    return tenantId != null;
  }

  public Optional<UUID> tenant() {
    return Optional.ofNullable(tenantId);
  }

  /** Copy with a tenant membership, used when onboarding or accepting an invitation. */
  public TenantPrincipal joining(UUID newTenantId, String newRole, UUID newCustomerId) {
    return new TenantPrincipal(userId, email, newTenantId, newRole, newCustomerId);
  }
}
