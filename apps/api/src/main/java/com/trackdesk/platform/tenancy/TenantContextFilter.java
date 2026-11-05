// SECURITY-REVIEW-REQUIRED: tenant isolation — maps the VERIFIED JWT to TenantContext.
package com.trackdesk.platform.tenancy;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;
import java.util.UUID;
import org.slf4j.MDC;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Runs after bearer-token authentication. Reads {@code sub}, {@code email} and {@code
 * app_metadata.{tenant_id,role,customer_id}} from the validated JWT into {@link TenantContext} and
 * the logging MDC; always clears both at the end of the request.
 */
public class TenantContextFilter extends OncePerRequestFilter {

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws ServletException, IOException {
    try {
      Authentication auth = SecurityContextHolder.getContext().getAuthentication();
      if (auth instanceof JwtAuthenticationToken token) {
        TenantPrincipal principal = fromJwt(token.getToken());
        TenantContext.set(principal);
        MDC.put("user_id", principal.userId().toString());
        if (principal.hasTenant()) {
          MDC.put("tenant_id", principal.tenantId().toString());
        }
      }
      chain.doFilter(request, response);
    } finally {
      TenantContext.clear();
      MDC.remove("user_id");
      MDC.remove("tenant_id");
    }
  }

  /** Extracts the principal from verified claims. Malformed ids fail closed (no tenant). */
  public static TenantPrincipal fromJwt(Jwt jwt) {
    UUID userId = UUID.fromString(jwt.getSubject());
    Map<String, Object> appMetadata = jwt.getClaimAsMap("app_metadata");
    UUID tenantId = null;
    String role = null;
    UUID customerId = null;
    if (appMetadata != null) {
      tenantId = parseUuid(appMetadata.get("tenant_id"));
      role = tenantId == null ? null : asString(appMetadata.get("role"));
      customerId = tenantId == null ? null : parseUuid(appMetadata.get("customer_id"));
    }
    return new TenantPrincipal(userId, jwt.getClaimAsString("email"), tenantId, role, customerId);
  }

  private static String asString(Object value) {
    return value instanceof String s && !s.isBlank() ? s : null;
  }

  private static UUID parseUuid(Object value) {
    String s = asString(value);
    if (s == null) {
      return null;
    }
    try {
      return UUID.fromString(s);
    } catch (IllegalArgumentException e) {
      return null;
    }
  }
}
