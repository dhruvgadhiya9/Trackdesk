// SECURITY-REVIEW-REQUIRED: role -> permission authorities.
package com.trackdesk.platform.security;

import com.trackdesk.platform.tenancy.TenantContextFilter;
import com.trackdesk.platform.tenancy.TenantPrincipal;
import java.util.ArrayList;
import java.util.List;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

/**
 * Grants the permissions of the user's role (from the generated {@link Permission} matrix) as
 * authorities. Users without a tenant get no permissions (only onboarding endpoints work). Unknown
 * roles get nothing (fail closed).
 */
@Component
public class SupabaseJwtAuthenticationConverter
    implements Converter<Jwt, AbstractAuthenticationToken> {

  @Override
  public AbstractAuthenticationToken convert(Jwt jwt) {
    TenantPrincipal principal = TenantContextFilter.fromJwt(jwt);
    List<GrantedAuthority> authorities = new ArrayList<>();
    if (principal.hasTenant() && principal.role() != null) {
      authorities.add(new SimpleGrantedAuthority("ROLE_" + principal.role()));
      Permission.forRole(principal.role())
          .forEach(p -> authorities.add(new SimpleGrantedAuthority(p)));
    }
    return new JwtAuthenticationToken(jwt, authorities, principal.userId().toString());
  }
}
