package com.trackdesk.platform.security;

import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * @param jwkSetUri Supabase JWKS URL (staging/prod), e.g.
 *     https://PROJECT.supabase.co/auth/v1/.well-known/jwks.json
 * @param hmacSecret legacy HS256 secret — ONLY allowed with the local/test profiles
 * @param issuer expected {@code iss} (optional)
 * @param audience expected {@code aud}; Supabase uses "authenticated"
 * @param allowedOrigins CORS origins for the web apps
 */
@ConfigurationProperties("trackdesk.security")
public record SecurityProperties(
    String jwkSetUri,
    String hmacSecret,
    String issuer,
    String audience,
    List<String> allowedOrigins) {

  public SecurityProperties {
    audience = audience == null || audience.isBlank() ? "authenticated" : audience;
    allowedOrigins = allowedOrigins == null ? List.of() : List.copyOf(allowedOrigins);
  }
}
