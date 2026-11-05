package com.trackdesk.platform.tenancy;

import jakarta.persistence.EntityManagerFactory;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration(proxyBeanMethods = false)
public class TenancyConfig {

  /** Replaces Boot's default JPA transaction manager (it backs off when this bean exists). */
  @Bean
  public PlatformTransactionManager transactionManager(EntityManagerFactory emf) {
    return new TenantAwareJpaTransactionManager(emf);
  }

  @Bean
  public TenantContextFilter tenantContextFilter() {
    return new TenantContextFilter();
  }

  /**
   * The filter must run ONLY inside the Spring Security chain (after JWT validation). Without this
   * Boot would also register it as a plain servlet filter that could run first and mark the request
   * as already filtered.
   */
  @Bean
  public FilterRegistrationBean<TenantContextFilter> tenantContextFilterRegistration(
      TenantContextFilter filter) {
    FilterRegistrationBean<TenantContextFilter> registration = new FilterRegistrationBean<>(filter);
    registration.setEnabled(false);
    return registration;
  }
}
