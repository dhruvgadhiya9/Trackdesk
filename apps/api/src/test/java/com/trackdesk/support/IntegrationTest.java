package com.trackdesk.support;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trackdesk.platform.auth.AuthAdminClient;
import com.trackdesk.platform.auth.FakeAuthAdminClient;
import com.trackdesk.platform.notifications.EmailSender;
import com.trackdesk.platform.notifications.FakeEmailSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Base for API integration tests: full Spring context, MockMvc, real Postgres+PostGIS
 * (Testcontainers) migrated by Flyway as the owner role, and the API connected as the non-superuser
 * {@code trackdesk_app} role — so RLS is exercised exactly as in production.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Import(TestJwts.class)
public abstract class IntegrationTest {

  @Autowired protected MockMvc mvc;
  @Autowired protected ObjectMapper json;
  @Autowired protected TestJwts jwts;
  @Autowired private AuthAdminClient authAdminClient;
  @Autowired private EmailSender emailSender;

  @DynamicPropertySource
  static void database(DynamicPropertyRegistry registry) {
    var pg = PostgresContainer.get();
    registry.add("spring.datasource.url", pg::getJdbcUrl);
    registry.add("spring.datasource.username", () -> PostgresContainer.APP_USER);
    registry.add("spring.datasource.password", () -> PostgresContainer.APP_PASSWORD);
    registry.add("spring.flyway.url", pg::getJdbcUrl);
    registry.add("spring.flyway.user", () -> PostgresContainer.OWNER_USER);
    registry.add("spring.flyway.password", () -> PostgresContainer.OWNER_PASSWORD);
  }

  protected FakeAuthAdminClient authAdmin() {
    return (FakeAuthAdminClient) authAdminClient;
  }

  protected FakeEmailSender email() {
    return (FakeEmailSender) emailSender;
  }

  protected TestTenants tenants() {
    return new TestTenants(mvc, json, jwts, authAdmin(), email());
  }
}
