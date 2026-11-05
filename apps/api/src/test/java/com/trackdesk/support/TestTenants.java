package com.trackdesk.support;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.trackdesk.platform.auth.FakeAuthAdminClient;
import com.trackdesk.platform.notifications.FakeEmailSender;
import com.trackdesk.support.TestJwts.TestUser;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Creates tenants and users THROUGH THE API (sign up → create company → invite → accept), so every
 * test starts from the real onboarding path. Synthetic data only.
 */
public class TestTenants {

  private final MockMvc mvc;
  private final ObjectMapper json;
  private final TestJwts jwts;
  private final FakeAuthAdminClient authAdmin;
  private final FakeEmailSender email;

  TestTenants(
      MockMvc mvc,
      ObjectMapper json,
      TestJwts jwts,
      FakeAuthAdminClient authAdmin,
      FakeEmailSender email) {
    this.mvc = mvc;
    this.json = json;
    this.jwts = jwts;
    this.authAdmin = authAdmin;
    this.email = email;
  }

  /** Signs up a new owner and creates a company; returns the owner with refreshed claims. */
  public TestUser newCompany(String name) throws Exception {
    UUID userId = UUID.randomUUID();
    String ownerEmail = "owner-" + userId.toString().substring(0, 8) + "@example.test";
    mvc.perform(
            post("/v1/tenants")
                .header("Authorization", "Bearer " + jwts.tenantless(userId, ownerEmail))
                .contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(Map.of("name", name, "fullName", "Test Owner"))))
        .andExpect(status().isCreated());
    return refreshed(userId, ownerEmail);
  }

  /** Invites {@code role} into the inviter's tenant and accepts it as a brand-new auth user. */
  public TestUser invite(TestUser inviter, String role) throws Exception {
    return invite(inviter, role, null);
  }

  public TestUser invite(TestUser inviter, String role, UUID customerId) throws Exception {
    UUID userId = UUID.randomUUID();
    String inviteeEmail = role + "-" + userId.toString().substring(0, 8) + "@example.test";
    Map<String, Object> body =
        customerId == null
            ? Map.of("email", inviteeEmail, "role", role)
            : Map.of("email", inviteeEmail, "role", role, "customerId", customerId.toString());
    mvc.perform(
            post("/v1/invitations")
                .header("Authorization", "Bearer " + jwts.member(inviter))
                .contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(body)))
        .andExpect(status().isCreated());
    String token = tokenFor(inviteeEmail);
    mvc.perform(
            post("/v1/invitations/accept")
                .header("Authorization", "Bearer " + jwts.tenantless(userId, inviteeEmail))
                .contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(Map.of("token", token))))
        .andExpect(status().isOk());
    return refreshed(userId, inviteeEmail);
  }

  public String tokenFor(String inviteeEmail) {
    String url = email.lastInvitationTo(inviteeEmail).orElseThrow().acceptUrl();
    return url.substring(url.indexOf("token=") + "token=".length());
  }

  /** Simulates the client refreshing its session after app_metadata changed. */
  public TestUser refreshed(UUID userId, String userEmail) {
    FakeAuthAdminClient.Membership m = authAdmin.membership(userId).orElseThrow();
    return new TestUser(userId, userEmail, m.tenantId(), m.role(), m.customerId());
  }

  public String bearer(TestUser user) {
    return "Bearer " + jwts.member(user);
  }

  public JsonNode read(String body) throws Exception {
    return json.readTree(body);
  }
}
