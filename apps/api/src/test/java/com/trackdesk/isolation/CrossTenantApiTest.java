// SECURITY-REVIEW-REQUIRED: API-level tenant isolation proof for every implemented endpoint.
package com.trackdesk.isolation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.trackdesk.support.IntegrationTest;
import com.trackdesk.support.PostgresContainer;
import com.trackdesk.support.TestJwts.TestUser;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.lang.reflect.Method;
import java.sql.DriverManager;
import java.util.Arrays;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.UUID;
import java.util.stream.Collectors;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

/**
 * For every IMPLEMENTED endpoint (a controller method that overrides its generated interface),
 * tenant A's credentials must never read, change or reference tenant B's data. {@link
 * #everyImplementedEndpointHasACrossTenantTest()} fails when a new endpoint is implemented without
 * a test here.
 */
@Tag("isolation")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@DisplayName("Tenant isolation at the API (cross-tenant access per endpoint)")
class CrossTenantApiTest extends IntegrationTest {

  /** operationIds (from the OpenAPI spec) covered by the annotated test. */
  @Retention(RetentionPolicy.RUNTIME)
  @Target(ElementType.METHOD)
  @interface Covers {
    String[] value();
  }

  @Autowired
  @Qualifier("requestMappingHandlerMapping")
  RequestMappingHandlerMapping handlerMapping;

  TestUser ownerA;
  TestUser opsA;
  TestUser ownerB;
  TestUser workerB;
  UUID customerB;
  UUID invitationB;
  String inviteTokenB;

  @BeforeAll
  void twoTenants() throws Exception {
    ownerA = tenants().newCompany("Tenant A " + UUID.randomUUID());
    opsA = tenants().invite(ownerA, "ops_manager");
    ownerB = tenants().newCompany("Tenant B " + UUID.randomUUID());
    workerB = tenants().invite(ownerB, "field_worker");
    customerB = createCustomer(ownerB, "Secret B Customer");

    String pendingEmail =
        "pending-b-" + UUID.randomUUID().toString().substring(0, 6) + "@example.test";
    String body =
        mvc.perform(
                post("/v1/invitations")
                    .header("Authorization", tenants().bearer(ownerB))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        json.writeValueAsString(
                            Map.of("email", pendingEmail, "role", "ops_manager"))))
            .andExpect(status().isCreated())
            .andReturn()
            .getResponse()
            .getContentAsString();
    invitationB = UUID.fromString(json.readTree(body).get("id").asText());
    inviteTokenB = tenants().tokenFor(pendingEmail);
  }

  @Test
  @Covers({"listCustomers", "getCustomer", "updateCustomer", "archiveCustomer", "createCustomer"})
  @DisplayName("customers: A cannot list, get, update or archive B's customer")
  void customers() throws Exception {
    mvc.perform(get("/v1/customers").header("Authorization", tenants().bearer(opsA)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.items[*].id", not(hasItem(customerB.toString()))));
    mvc.perform(get("/v1/customers/" + customerB).header("Authorization", tenants().bearer(opsA)))
        .andExpect(status().isNotFound());
    mvc.perform(
            put("/v1/customers/" + customerB)
                .header("Authorization", tenants().bearer(opsA))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Hijacked\",\"version\":0}"))
        .andExpect(status().isNotFound());
    mvc.perform(
            post("/v1/customers/" + customerB + "/archive")
                .header("Authorization", tenants().bearer(opsA)))
        .andExpect(status().isNotFound());

    // A customer created by A is invisible to B.
    UUID customerA = createCustomer(opsA, "A Only");
    mvc.perform(get("/v1/customers/" + customerA).header("Authorization", tenants().bearer(ownerB)))
        .andExpect(status().isNotFound());
    // B's data unchanged.
    mvc.perform(get("/v1/customers/" + customerB).header("Authorization", tenants().bearer(ownerB)))
        .andExpect(jsonPath("$.name").value("Secret B Customer"))
        .andExpect(jsonPath("$.status").value("active"));
  }

  @Test
  @Covers({"listUsers", "getUser"})
  @DisplayName("users: A cannot list or get B's users")
  void users() throws Exception {
    mvc.perform(get("/v1/users?size=100").header("Authorization", tenants().bearer(ownerA)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.items[*].id", not(hasItem(workerB.userId().toString()))))
        .andExpect(jsonPath("$.items[*].id", not(hasItem(ownerB.userId().toString()))));
    mvc.perform(
            get("/v1/users/" + workerB.userId()).header("Authorization", tenants().bearer(ownerA)))
        .andExpect(status().isNotFound());
  }

  @Test
  @Covers({"listInvitations", "revokeInvitation", "createInvitation"})
  @DisplayName("invitations: A cannot list or revoke B's invitations, or invite into B's customer")
  void invitations() throws Exception {
    mvc.perform(get("/v1/invitations").header("Authorization", tenants().bearer(ownerA)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[*].id", not(hasItem(invitationB.toString()))));
    mvc.perform(
            delete("/v1/invitations/" + invitationB)
                .header("Authorization", tenants().bearer(ownerA)))
        .andExpect(status().isNotFound());
    mvc.perform(get("/v1/invitations").header("Authorization", tenants().bearer(ownerB)))
        .andExpect(jsonPath("$[*].id", hasItem(invitationB.toString())));
    mvc.perform(
            post("/v1/invitations")
                .header("Authorization", tenants().bearer(ownerA))
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    json.writeValueAsString(
                        Map.of(
                            "email", "x@example.test",
                            "role", "customer",
                            "customerId", customerB.toString()))))
        .andExpect(status().isNotFound());
  }

  @Test
  @Covers({"acceptInvitation", "createTenant"})
  @DisplayName("a member of A cannot join B with B's invite token, nor create another tenant")
  void acceptAndCreateTenant() throws Exception {
    mvc.perform(
            post("/v1/invitations/accept")
                .header("Authorization", tenants().bearer(opsA))
                .contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(Map.of("token", inviteTokenB))))
        .andExpect(status().isConflict());
    mvc.perform(
            post("/v1/tenants")
                .header("Authorization", tenants().bearer(opsA))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Escape Co\"}"))
        .andExpect(status().isConflict());
  }

  @Test
  @Covers({"getCurrentTenant", "getMe"})
  @DisplayName("tenant/me: A only ever sees its own tenant")
  void tenantAndMe() throws Exception {
    mvc.perform(get("/v1/tenants/current").header("Authorization", tenants().bearer(opsA)))
        .andExpect(jsonPath("$.id").value(opsA.tenantId().toString()));
    mvc.perform(get("/v1/me").header("Authorization", tenants().bearer(opsA)))
        .andExpect(jsonPath("$.tenantId").value(opsA.tenantId().toString()));
    // Defence in depth: a token whose tenant claim does not match the user's membership
    // (e.g. stale claims) resolves no profile from the other tenant.
    TestUser mismatched =
        new TestUser(opsA.userId(), opsA.email(), ownerB.tenantId(), "ops_manager", null);
    mvc.perform(get("/v1/me").header("Authorization", tenants().bearer(mismatched)))
        .andExpect(jsonPath("$.fullName").doesNotExist());
  }

  @Test
  @Covers({"getFeatureFlags"})
  @DisplayName("feature flags: B's per-tenant override never leaks to A")
  void featureFlags() throws Exception {
    var pg = PostgresContainer.get();
    try (var c = DriverManager.getConnection(pg.getJdbcUrl(), pg.getUsername(), pg.getPassword());
        var ps =
            c.prepareStatement(
                "insert into tenant_feature_flag (tenant_id, flag_key, enabled) values (?, 'payments', true) on conflict do nothing")) {
      ps.setObject(1, ownerB.tenantId());
      ps.executeUpdate();
    }
    mvc.perform(get("/v1/feature-flags").header("Authorization", tenants().bearer(ownerB)))
        .andExpect(jsonPath("$.flags.payments").value(true));
    mvc.perform(get("/v1/feature-flags").header("Authorization", tenants().bearer(opsA)))
        .andExpect(jsonPath("$.flags.payments").value(false));
  }

  @Test
  @DisplayName("Coverage: every implemented endpoint has a cross-tenant test in this class")
  void everyImplementedEndpointHasACrossTenantTest() {
    Set<String> implemented =
        handlerMapping.getHandlerMethods().values().stream()
            .map(HandlerMethod::getMethod)
            .filter(m -> m.getDeclaringClass().getPackageName().startsWith("com.trackdesk"))
            .filter(m -> !m.getDeclaringClass().isInterface())
            .map(Method::getName)
            .collect(Collectors.toCollection(TreeSet::new));
    Set<String> covered =
        Arrays.stream(getClass().getDeclaredMethods())
            .filter(m -> m.isAnnotationPresent(Covers.class))
            .flatMap(m -> Arrays.stream(m.getAnnotation(Covers.class).value()))
            .collect(Collectors.toCollection(TreeSet::new));
    assertThat(implemented).as("implemented endpoints").isNotEmpty();
    assertThat(covered)
        .as("Add a cross-tenant test (with @Covers) for each newly implemented endpoint")
        .containsAll(implemented);
  }

  @Test
  @DisplayName("Scaffolded endpoints return 501 and still require authentication")
  void scaffoldsAreClosed() throws Exception {
    mvc.perform(get("/v1/jobs")).andExpect(status().isUnauthorized());
    mvc.perform(get("/v1/jobs").header("Authorization", tenants().bearer(opsA)))
        .andExpect(status().isNotImplemented());
  }

  private UUID createCustomer(TestUser as, String name) throws Exception {
    String body =
        mvc.perform(
                post("/v1/customers")
                    .header("Authorization", tenants().bearer(as))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json.writeValueAsString(Map.of("name", name))))
            .andExpect(status().isCreated())
            .andReturn()
            .getResponse()
            .getContentAsString();
    return UUID.fromString(json.readTree(body).get("id").asText());
  }
}
