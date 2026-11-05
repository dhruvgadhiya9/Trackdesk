package com.trackdesk.support;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.TestComponent;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

/** Mints Supabase-shaped HS256 tokens signed with the TEST-only secret. */
@TestComponent
public class TestJwts {

  private final NimbusJwtEncoder encoder;

  public TestJwts(@Value("${trackdesk.security.hmac-secret}") String secret) {
    this.encoder =
        new NimbusJwtEncoder(new ImmutableSecret<>(secret.getBytes(StandardCharsets.UTF_8)));
  }

  /** A signed-up user with no company yet. */
  public String tenantless(UUID userId, String email) {
    return mint(userId, email, null, null, null);
  }

  public String member(TestUser user) {
    return mint(user.userId(), user.email(), user.tenantId(), user.role(), user.customerId());
  }

  public String mint(UUID userId, String email, UUID tenantId, String role, UUID customerId) {
    Map<String, Object> appMetadata = new HashMap<>();
    appMetadata.put("provider", "email");
    if (tenantId != null) {
      appMetadata.put("tenant_id", tenantId.toString());
      appMetadata.put("role", role);
    }
    if (customerId != null) {
      appMetadata.put("customer_id", customerId.toString());
    }
    Instant now = Instant.now();
    JwtClaimsSet claims =
        JwtClaimsSet.builder()
            .subject(userId.toString())
            .audience(List.of("authenticated"))
            .issuedAt(now)
            .expiresAt(now.plusSeconds(900))
            .claim("email", email)
            .claim("role", "authenticated")
            .claim("app_metadata", appMetadata)
            .build();
    JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
    return encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
  }

  /** A user with membership in a tenant. */
  public record TestUser(UUID userId, String email, UUID tenantId, String role, UUID customerId) {
    public TestUser withRole(String newRole) {
      return new TestUser(userId, email, tenantId, newRole, customerId);
    }
  }
}
