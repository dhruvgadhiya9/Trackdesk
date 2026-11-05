// SECURITY-REVIEW-REQUIRED: writes tenant/role claims into Supabase Auth app_metadata.
package com.trackdesk.platform.auth;

import java.util.UUID;

/**
 * Port to the identity provider's admin API. {@code app_metadata} is writable only server-side
 * (service-role key), so users cannot grant themselves a tenant or role. After a change the client
 * must refresh its session to receive a token with the new claims.
 */
public interface AuthAdminClient {

  void setMembership(UUID userId, UUID tenantId, String role, UUID customerId);

  void clearMembership(UUID userId);
}
