package com.trackdesk.customers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.contains;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.trackdesk.platform.audit.AuditEventRepository;
import com.trackdesk.platform.tenancy.TenantPrincipal;
import com.trackdesk.platform.tenancy.TenantTransactions;
import com.trackdesk.support.IntegrationTest;
import com.trackdesk.support.TestJwts.TestUser;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;

/** Gherkin: docs/prd/01-customers.md — one test per scenario. */
@DisplayName("Feature: Customers")
class CustomersApiIT extends IntegrationTest {

  @Autowired AuditEventRepository auditEvents;
  @Autowired TenantTransactions transactions;

  TestUser owner;
  TestUser ops;

  @BeforeEach
  void background() throws Exception {
    owner = tenants().newCompany("Customers Co " + UUID.randomUUID());
    ops = tenants().invite(owner, "ops_manager");
  }

  @Test
  @DisplayName("Create a customer")
  void create() throws Exception {
    String body =
        mvc.perform(
                post("/v1/customers")
                    .header("Authorization", tenants().bearer(ops))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        """
                        {"name":"Northside Academy","email":"fm@northside.example",
                         "billingAddress":{"line1":"1 School Lane","city":"Leeds","postcode":"ls1 4ap"}}
                        """))
            .andExpect(status().isCreated())
            .andExpect(header().exists("Location"))
            .andExpect(jsonPath("$.status").value("active"))
            .andExpect(jsonPath("$.version").value(0))
            .andExpect(jsonPath("$.billingAddress.postcode").value("LS1 4AP"))
            .andReturn()
            .getResponse()
            .getContentAsString();
    UUID id = UUID.fromString(json.readTree(body).get("id").asText());

    var audit =
        transactions.runAs(
            principal(ops),
            () -> auditEvents.findByEntityTypeAndEntityIdOrderByOccurredAtAsc("customer", id));
    assertThat(audit).extracting("action").containsExactly("customer.created");
    assertThat(audit.getFirst().getActorUserId()).isEqualTo(ops.userId());
  }

  @Test
  @DisplayName("Name is required")
  void nameRequired() throws Exception {
    mvc.perform(
            post("/v1/customers")
                .header("Authorization", tenants().bearer(ops))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"   \"}"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.errors[0].field").value("name"));
  }

  @Test
  @DisplayName("List customers with search and paging")
  void listWithSearch() throws Exception {
    create(ops, "Northside Academy");
    create(ops, "Oakwood Retail");
    create(ops, "North Park Offices");
    mvc.perform(
            get("/v1/customers?search=north&page=0&size=20")
                .header("Authorization", tenants().bearer(ops)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.items[*].name", contains("North Park Offices", "Northside Academy")))
        .andExpect(jsonPath("$.page.totalElements").value(2));
  }

  @Test
  @DisplayName("Search treats % and _ literally")
  void searchEscapesWildcards() throws Exception {
    create(ops, "100% Fire Ltd");
    create(ops, "1000 Fire Ltd");
    mvc.perform(
            get("/v1/customers")
                .param("search", "100%")
                .header("Authorization", tenants().bearer(ops)))
        .andExpect(jsonPath("$.page.totalElements").value(1));
  }

  @Test
  @DisplayName("Update a customer with optimistic locking")
  void updateOptimisticLock() throws Exception {
    UUID id = create(ops, "Oakwood Retail");
    String update = "{\"name\":\"Oakwood Retail\",\"phone\":\"0113 000 0000\",\"version\":0}";
    mvc.perform(
            put("/v1/customers/" + id)
                .header("Authorization", tenants().bearer(ops))
                .contentType(MediaType.APPLICATION_JSON)
                .content(update))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.version").value(1))
        .andExpect(jsonPath("$.phone").value("0113 000 0000"));
    mvc.perform(
            put("/v1/customers/" + id)
                .header("Authorization", tenants().bearer(ops))
                .contentType(MediaType.APPLICATION_JSON)
                .content(update))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("conflict"));
  }

  @Test
  @DisplayName("Archive a customer")
  void archive() throws Exception {
    UUID id = create(ops, "Oakwood Retail");
    mvc.perform(
            post("/v1/customers/" + id + "/archive").header("Authorization", tenants().bearer(ops)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.status").value("archived"));
    mvc.perform(get("/v1/customers").header("Authorization", tenants().bearer(ops)))
        .andExpect(jsonPath("$.page.totalElements").value(0));
    mvc.perform(get("/v1/customers?status=archived").header("Authorization", tenants().bearer(ops)))
        .andExpect(jsonPath("$.items[0].id").value(id.toString()));
  }

  @Test
  @DisplayName("Field worker cannot create customers")
  void fieldWorkerForbidden() throws Exception {
    TestUser worker = tenants().invite(owner, "field_worker");
    mvc.perform(
            post("/v1/customers")
                .header("Authorization", tenants().bearer(worker))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Nope\"}"))
        .andExpect(status().isForbidden());
  }

  @Test
  @DisplayName("Customer-role users see only their own customer record")
  void customerSeesOwnOnly() throws Exception {
    UUID mine = create(ops, "Mine Ltd");
    UUID other = create(ops, "Other Ltd");
    TestUser customerUser = tenants().invite(owner, "customer", mine);
    mvc.perform(get("/v1/customers").header("Authorization", tenants().bearer(customerUser)))
        .andExpect(jsonPath("$.page.totalElements").value(1))
        .andExpect(jsonPath("$.items[0].id").value(mine.toString()));
    mvc.perform(
            get("/v1/customers/" + other).header("Authorization", tenants().bearer(customerUser)))
        .andExpect(status().isNotFound());
  }

  @Test
  @DisplayName("Cross-tenant access is impossible")
  void crossTenant() throws Exception {
    TestUser ownerB = tenants().newCompany("Tenant B " + UUID.randomUUID());
    UUID secret = create(ownerB, "Secret Co");
    mvc.perform(get("/v1/customers/" + secret).header("Authorization", tenants().bearer(ops)))
        .andExpect(status().isNotFound());
    mvc.perform(
            put("/v1/customers/" + secret)
                .header("Authorization", tenants().bearer(ops))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Hijacked\",\"version\":0}"))
        .andExpect(status().isNotFound());
    mvc.perform(
            post("/v1/customers/" + secret + "/archive")
                .header("Authorization", tenants().bearer(ops)))
        .andExpect(status().isNotFound());
    mvc.perform(get("/v1/customers?search=secret").header("Authorization", tenants().bearer(ops)))
        .andExpect(jsonPath("$.page.totalElements").value(0));
  }

  private UUID create(TestUser as, String name) throws Exception {
    String body =
        mvc.perform(
                post("/v1/customers")
                    .header("Authorization", tenants().bearer(as))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json.writeValueAsString(java.util.Map.of("name", name))))
            .andExpect(status().isCreated())
            .andReturn()
            .getResponse()
            .getContentAsString();
    return UUID.fromString(json.readTree(body).get("id").asText());
  }

  private static TenantPrincipal principal(TestUser u) {
    return new TenantPrincipal(u.userId(), u.email(), u.tenantId(), u.role(), u.customerId());
  }
}
