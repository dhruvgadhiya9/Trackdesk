package com.trackdesk.tenants;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.trackdesk.platform.audit.AuditEventRepository;
import com.trackdesk.platform.tenancy.TenantContext;
import com.trackdesk.platform.tenancy.TenantPrincipal;
import com.trackdesk.platform.tenancy.TenantTransactions;
import com.trackdesk.support.IntegrationTest;
import com.trackdesk.support.TestJwts.TestUser;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;

/** Gherkin: docs/prd/00-tenant-onboarding.md — Phase 3 gate flow. */
@DisplayName("Feature: Tenant onboarding")
class OnboardingApiIT extends IntegrationTest {

  @Autowired AuditEventRepository auditEvents;
  @Autowired TenantTransactions transactions;

  @Test
  @DisplayName("Owner creates a company after sign-up")
  void ownerCreatesCompany() throws Exception {
    UUID userId = UUID.randomUUID();
    String email = "founder-" + userId.toString().substring(0, 6) + "@example.test";

    String body =
        mvc.perform(
                post("/v1/tenants")
                    .header("Authorization", "Bearer " + jwts.tenantless(userId, email))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"name\":\"Acme Fire Ltd\",\"fullName\":\"Ada Owner\"}"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.name").value("Acme Fire Ltd"))
            .andExpect(jsonPath("$.countryCode").value("GB"))
            .andExpect(jsonPath("$.status").value("active"))
            .andReturn()
            .getResponse()
            .getContentAsString();
    UUID tenantId = UUID.fromString(json.readTree(body).get("id").asText());

    var membership = authAdmin().membership(userId).orElseThrow();
    assertThat(membership.tenantId()).isEqualTo(tenantId);
    assertThat(membership.role()).isEqualTo("company_owner");

    TestUser owner = tenants().refreshed(userId, email);
    mvc.perform(get("/v1/me").header("Authorization", tenants().bearer(owner)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.tenantId").value(tenantId.toString()))
        .andExpect(jsonPath("$.tenantName").value("Acme Fire Ltd"))
        .andExpect(jsonPath("$.role").value("company_owner"))
        .andExpect(jsonPath("$.fullName").value("Ada Owner"))
        .andExpect(jsonPath("$.permissions").isNotEmpty());

    var events =
        transactions.runAs(
            new TenantPrincipal(userId, email, tenantId, "company_owner", null),
            () -> auditEvents.findByActionOrderByOccurredAtAsc("tenant.created"));
    assertThat(events).hasSize(1);
    assertThat(events.getFirst().getEntityId()).isEqualTo(tenantId);
  }

  @Test
  @DisplayName("A user who already belongs to a company cannot create another")
  void alreadyMember() throws Exception {
    TestUser owner = tenants().newCompany("First Co");
    mvc.perform(
            post("/v1/tenants")
                .header("Authorization", tenants().bearer(owner))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Second Co\"}"))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("already-member"));
  }

  @Test
  @DisplayName("Stale token: user with a company but tenantless token cannot create a second one")
  void staleTokenCannotCreateSecondCompany() throws Exception {
    TestUser owner = tenants().newCompany("Stale Co");
    mvc.perform(
            post("/v1/tenants")
                .header("Authorization", "Bearer " + jwts.tenantless(owner.userId(), owner.email()))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Second Co\"}"))
        .andExpect(status().isConflict());
  }

  @Test
  @DisplayName("Company name is validated")
  void nameValidated() throws Exception {
    mvc.perform(
            post("/v1/tenants")
                .header(
                    "Authorization",
                    "Bearer " + jwts.tenantless(UUID.randomUUID(), "x@example.test"))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"A\"}"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("validation"))
        .andExpect(jsonPath("$.errors[0].field").value("name"));
  }

  @Test
  @DisplayName("Owner invites a field worker; the invitee accepts and logs in")
  void inviteAndAccept() throws Exception {
    TestUser owner = tenants().newCompany("Invite Co");
    TestUser worker = tenants().invite(owner, "field_worker");

    assertThat(worker.tenantId()).isEqualTo(owner.tenantId());
    assertThat(worker.role()).isEqualTo("field_worker");
    mvc.perform(get("/v1/me").header("Authorization", tenants().bearer(worker)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.role").value("field_worker"))
        .andExpect(jsonPath("$.tenantName").value("Invite Co"));
    mvc.perform(get("/v1/users").header("Authorization", tenants().bearer(owner)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.page.totalElements").value(2));
  }

  @Test
  @DisplayName("Field worker cannot invite")
  void fieldWorkerCannotInvite() throws Exception {
    TestUser owner = tenants().newCompany("Perm Co");
    TestUser worker = tenants().invite(owner, "field_worker");
    mvc.perform(
            post("/v1/invitations")
                .header("Authorization", tenants().bearer(worker))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"a@example.test\",\"role\":\"field_worker\"}"))
        .andExpect(status().isForbidden());
  }

  @Test
  @DisplayName("Ops manager cannot invite a company owner")
  void opsCannotGrantOwner() throws Exception {
    TestUser owner = tenants().newCompany("Grant Co");
    TestUser ops = tenants().invite(owner, "ops_manager");
    mvc.perform(
            post("/v1/invitations")
                .header("Authorization", tenants().bearer(ops))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"b@example.test\",\"role\":\"company_owner\"}"))
        .andExpect(status().isForbidden())
        .andExpect(jsonPath("$.code").value("cannot-grant-role"));
  }

  @Test
  @DisplayName("Used, mismatched and unknown invitations are rejected")
  void invalidInvitations() throws Exception {
    TestUser owner = tenants().newCompany("Reject Co");
    String inviteeEmail = "late-" + UUID.randomUUID().toString().substring(0, 6) + "@example.test";
    mvc.perform(
            post("/v1/invitations")
                .header("Authorization", tenants().bearer(owner))
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    json.writeValueAsString(Map.of("email", inviteeEmail, "role", "ops_manager"))))
        .andExpect(status().isCreated());
    String token = tenants().tokenFor(inviteeEmail);

    // Different email than the invitation.
    mvc.perform(
            post("/v1/invitations/accept")
                .header(
                    "Authorization",
                    "Bearer " + jwts.tenantless(UUID.randomUUID(), "someone-else@example.test"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(Map.of("token", token))))
        .andExpect(status().isForbidden())
        .andExpect(jsonPath("$.code").value("invitation-email-mismatch"));

    // Unknown token.
    mvc.perform(
            post("/v1/invitations/accept")
                .header(
                    "Authorization", "Bearer " + jwts.tenantless(UUID.randomUUID(), inviteeEmail))
                .contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(Map.of("token", "x".repeat(43)))))
        .andExpect(status().isNotFound());

    // Accept once, then reuse.
    UUID invitee = UUID.randomUUID();
    mvc.perform(
            post("/v1/invitations/accept")
                .header("Authorization", "Bearer " + jwts.tenantless(invitee, inviteeEmail))
                .contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(Map.of("token", token))))
        .andExpect(status().isOk());
    mvc.perform(
            post("/v1/invitations/accept")
                .header(
                    "Authorization", "Bearer " + jwts.tenantless(UUID.randomUUID(), inviteeEmail))
                .contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(Map.of("token", token))))
        .andExpect(status().isGone())
        .andExpect(jsonPath("$.code").value("invitation-used"));
  }

  @Test
  @DisplayName("Signed-up user without a company has no permissions")
  void tenantlessUserHasNoAccess() throws Exception {
    String token = jwts.tenantless(UUID.randomUUID(), "new@example.test");
    mvc.perform(get("/v1/me").header("Authorization", "Bearer " + token))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.permissions").isEmpty());
    mvc.perform(get("/v1/customers").header("Authorization", "Bearer " + token))
        .andExpect(status().isForbidden());
  }

  @Test
  @DisplayName("Requests without a valid token are rejected")
  void unauthenticated() throws Exception {
    mvc.perform(get("/v1/me")).andExpect(status().isUnauthorized());
    mvc.perform(get("/v1/me").header("Authorization", "Bearer not-a-jwt"))
        .andExpect(status().isUnauthorized());
    assertThat(TenantContext.current()).isEmpty();
  }
}
