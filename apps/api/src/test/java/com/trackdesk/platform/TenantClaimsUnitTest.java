package com.trackdesk.platform;

import static org.assertj.core.api.Assertions.assertThat;

import com.trackdesk.platform.security.Permission;
import com.trackdesk.platform.security.SupabaseJwtAuthenticationConverter;
import com.trackdesk.platform.tenancy.TenantContextFilter;
import com.trackdesk.platform.tenancy.TenantPrincipal;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

/** JWT claim → TenantPrincipal / authorities mapping. Malformed input must fail closed. */
class TenantClaimsUnitTest {

  static Jwt jwt(Map<String, Object> appMetadata) {
    return Jwt.withTokenValue("t")
        .header("alg", "HS256")
        .subject("11111111-1111-4111-8111-111111111111")
        .claim("email", "a@example.test")
        .claim("app_metadata", appMetadata)
        .issuedAt(Instant.now())
        .expiresAt(Instant.now().plusSeconds(60))
        .build();
  }

  @Test
  void memberClaims() {
    UUID tenant = UUID.randomUUID();
    TenantPrincipal p =
        TenantContextFilter.fromJwt(
            jwt(Map.of("tenant_id", tenant.toString(), "role", "ops_manager")));
    assertThat(p.tenantId()).isEqualTo(tenant);
    assertThat(p.role()).isEqualTo("ops_manager");
  }

  @Test
  void malformedTenantFailsClosed() {
    TenantPrincipal p =
        TenantContextFilter.fromJwt(
            jwt(Map.of("tenant_id", "not-a-uuid", "role", "company_owner")));
    assertThat(p.hasTenant()).isFalse();
    assertThat(p.role()).as("role ignored without a tenant").isNull();
  }

  @Test
  void roleWithoutTenantGrantsNothing() {
    var auth =
        new SupabaseJwtAuthenticationConverter().convert(jwt(Map.of("role", "company_owner")));
    assertThat(auth.getAuthorities()).isEmpty();
  }

  @Test
  void unknownRoleGrantsNothing() {
    var auth =
        new SupabaseJwtAuthenticationConverter()
            .convert(jwt(Map.of("tenant_id", UUID.randomUUID().toString(), "role", "superadmin")));
    assertThat(auth.getAuthorities())
        .extracting(GrantedAuthority::getAuthority)
        .containsExactly("ROLE_superadmin");
  }

  @Test
  void ownerGetsMatrixPermissions() {
    var auth =
        new SupabaseJwtAuthenticationConverter()
            .convert(
                jwt(Map.of("tenant_id", UUID.randomUUID().toString(), "role", "company_owner")));
    assertThat(auth.getAuthorities())
        .extracting(GrantedAuthority::getAuthority)
        .contains(Permission.CUSTOMERS_CREATE, Permission.USERS_MANAGE)
        .doesNotContain(Permission.LOCATION_REPORT, Permission.FEATUREFLAGS_MANAGE);
  }
}
