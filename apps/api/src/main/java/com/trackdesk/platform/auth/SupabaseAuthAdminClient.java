// SECURITY-REVIEW-REQUIRED: uses the Supabase service-role key (secret from env/vault only).
package com.trackdesk.platform.auth;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestClient;

/**
 * Supabase Auth admin adapter: {@code PUT /auth/v1/admin/users/{id}} with {@code app_metadata}.
 * Requires the service-role key, which must never reach a client app.
 */
public class SupabaseAuthAdminClient implements AuthAdminClient {

  private final RestClient http;

  public SupabaseAuthAdminClient(String supabaseUrl, String serviceRoleKey) {
    this.http =
        RestClient.builder()
            .baseUrl(supabaseUrl + "/auth/v1/admin")
            .defaultHeader("apikey", serviceRoleKey)
            .defaultHeader("Authorization", "Bearer " + serviceRoleKey)
            .build();
  }

  @Override
  public void setMembership(UUID userId, UUID tenantId, String role, UUID customerId) {
    Map<String, Object> appMetadata = new HashMap<>();
    appMetadata.put("tenant_id", tenantId.toString());
    appMetadata.put("role", role);
    appMetadata.put("customer_id", customerId == null ? null : customerId.toString());
    update(userId, appMetadata);
  }

  @Override
  public void clearMembership(UUID userId) {
    Map<String, Object> appMetadata = new HashMap<>();
    appMetadata.put("tenant_id", null);
    appMetadata.put("role", null);
    appMetadata.put("customer_id", null);
    update(userId, appMetadata);
  }

  private void update(UUID userId, Map<String, Object> appMetadata) {
    http.put()
        .uri("/users/{id}", userId)
        .contentType(MediaType.APPLICATION_JSON)
        .body(Map.of("app_metadata", appMetadata))
        .retrieve()
        .toBodilessEntity();
  }
}
