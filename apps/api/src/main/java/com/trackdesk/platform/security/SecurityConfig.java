// SECURITY-REVIEW-REQUIRED: authentication (Supabase JWT), authorization defaults, CORS.
package com.trackdesk.platform.security;

import com.nimbusds.jose.JWSAlgorithm;
import com.trackdesk.platform.tenancy.TenantContextFilter;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration(proxyBeanMethods = false)
@EnableMethodSecurity
public class SecurityConfig {

  @Bean
  SecurityFilterChain apiSecurity(
      HttpSecurity http,
      SupabaseJwtAuthenticationConverter jwtConverter,
      TenantContextFilter tenantContextFilter)
      throws Exception {
    http.csrf(AbstractHttpConfigurer::disable)
        .cors(cors -> {})
        .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(
            auth ->
                auth.requestMatchers("/actuator/health/**", "/actuator/info")
                    .permitAll()
                    // Payment provider webhooks: authenticated by signature, not JWT (Sprint 6).
                    .requestMatchers(HttpMethod.POST, "/v1/webhooks/*")
                    .permitAll()
                    .anyRequest()
                    .authenticated())
        .oauth2ResourceServer(o -> o.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtConverter)))
        .addFilterAfter(tenantContextFilter, BearerTokenAuthenticationFilter.class);
    return http.build();
  }

  @Bean
  JwtDecoder jwtDecoder(SecurityProperties props, Environment env) {
    NimbusJwtDecoder decoder;
    if (props.jwkSetUri() != null && !props.jwkSetUri().isBlank()) {
      decoder =
          NimbusJwtDecoder.withJwkSetUri(props.jwkSetUri())
              .jwsAlgorithms(
                  algs -> {
                    algs.add(org.springframework.security.oauth2.jose.jws.SignatureAlgorithm.RS256);
                    algs.add(org.springframework.security.oauth2.jose.jws.SignatureAlgorithm.ES256);
                  })
              .build();
    } else if (props.hmacSecret() != null && !props.hmacSecret().isBlank()) {
      boolean devProfile =
          Arrays.stream(env.getActiveProfiles())
              .anyMatch(p -> p.equals("local") || p.equals("test"));
      if (!devProfile) {
        throw new IllegalStateException(
            "HS256 JWT secret is only allowed in local/test profiles; configure jwk-set-uri");
      }
      SecretKeySpec key =
          new SecretKeySpec(
              props.hmacSecret().getBytes(StandardCharsets.UTF_8), JWSAlgorithm.HS256.getName());
      decoder = NimbusJwtDecoder.withSecretKey(key).macAlgorithm(MacAlgorithm.HS256).build();
    } else {
      throw new IllegalStateException(
          "Configure trackdesk.security.jwk-set-uri (or hmac-secret for local/test)");
    }

    List<OAuth2TokenValidator<Jwt>> validators = new ArrayList<>();
    validators.add(
        props.issuer() == null || props.issuer().isBlank()
            ? JwtValidators.createDefault()
            : JwtValidators.createDefaultWithIssuer(props.issuer()));
    validators.add(audienceValidator(props.audience()));
    decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(validators));
    return decoder;
  }

  private static OAuth2TokenValidator<Jwt> audienceValidator(String audience) {
    OAuth2Error error = new OAuth2Error("invalid_token", "Invalid audience", null);
    return jwt ->
        jwt.getAudience() != null && jwt.getAudience().contains(audience)
            ? OAuth2TokenValidatorResult.success()
            : OAuth2TokenValidatorResult.failure(error);
  }

  @Bean
  CorsConfigurationSource corsConfigurationSource(SecurityProperties props) {
    CorsConfiguration cors = new CorsConfiguration();
    cors.setAllowedOrigins(props.allowedOrigins());
    cors.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    cors.setAllowedHeaders(List.of("Authorization", "Content-Type", "Idempotency-Key"));
    cors.setExposedHeaders(List.of("X-Request-Id"));
    cors.setMaxAge(3600L);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/v1/**", cors);
    return source;
  }
}
