package com.trackdesk.platform;

import com.trackdesk.platform.auth.AuthAdminClient;
import com.trackdesk.platform.auth.FakeAuthAdminClient;
import com.trackdesk.platform.auth.SupabaseAuthAdminClient;
import com.trackdesk.platform.notifications.EmailSender;
import com.trackdesk.platform.notifications.FakeEmailSender;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

/**
 * Chooses real vs fake adapters by property. Fakes are the default so a misconfigured environment
 * never calls a real provider by accident; staging/prod set provider=supabase.
 */
@Configuration(proxyBeanMethods = false)
public class IntegrationAdaptersConfig {

  @Bean
  @ConditionalOnProperty(name = "trackdesk.auth-admin.provider", havingValue = "supabase")
  AuthAdminClient supabaseAuthAdminClient(
      @Value("${trackdesk.auth-admin.supabase-url}") String url,
      @Value("${trackdesk.auth-admin.service-role-key}") String serviceRoleKey) {
    return new SupabaseAuthAdminClient(url, serviceRoleKey);
  }

  @Bean
  @ConditionalOnProperty(
      name = "trackdesk.auth-admin.provider",
      havingValue = "fake",
      matchIfMissing = true)
  AuthAdminClient fakeAuthAdminClient() {
    return new FakeAuthAdminClient();
  }

  @Bean
  EmailSender emailSender(
      @Value("${trackdesk.email.log-links:false}") boolean logLinks, Environment env) {
    // TODO(Sprint 1): real provider adapter (UK/EU region) behind trackdesk.email.provider.
    boolean local = env.matchesProfiles("local");
    return new FakeEmailSender(logLinks && local);
  }
}
