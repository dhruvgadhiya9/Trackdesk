// SECURITY-REVIEW-REQUIRED: invitations — role granting, token handling, acceptance.
package com.trackdesk.users.application;

import com.trackdesk.contracts.model.AcceptInvitationRequestDto;
import com.trackdesk.contracts.model.CreateInvitationRequestDto;
import com.trackdesk.contracts.model.InvitationDto;
import com.trackdesk.contracts.model.MeDto;
import com.trackdesk.customers.application.CustomerQueries;
import com.trackdesk.platform.audit.AuditService;
import com.trackdesk.platform.audit.Audited;
import com.trackdesk.platform.auth.AuthAdminClient;
import com.trackdesk.platform.notifications.EmailSender;
import com.trackdesk.platform.tenancy.TenantContext;
import com.trackdesk.platform.tenancy.TenantPrincipal;
import com.trackdesk.platform.tenancy.TenantTransactions;
import com.trackdesk.platform.web.ApiException;
import com.trackdesk.tenants.application.TenantQueries;
import com.trackdesk.users.domain.AppUser;
import com.trackdesk.users.domain.Invitation;
import com.trackdesk.users.domain.InvitationTokens;
import com.trackdesk.users.infrastructure.AppUserRepository;
import com.trackdesk.users.infrastructure.InvitationRepository;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Invite → email → accept. Acceptance runs in two transactions: (1) look up the invitation by token
 * hash with NO tenant (allowed only by the capability RLS policy), (2) join the tenant as the
 * invited role — the app_user insert policy re-checks that a valid invitation exists.
 */
@Service
public class InvitationService {

  static final String INVITE_TOKEN_SETTING = "app.invite_token_hash";

  private final InvitationRepository invitations;
  private final AppUserRepository users;
  private final CustomerQueries customers;
  private final TenantQueries tenants;
  private final EmailSender email;
  private final AuthAdminClient authAdmin;
  private final AuditService audit;
  private final TenantTransactions transactions;
  private final UserService userService;
  private final UserMapper mapper;
  private final Clock clock;
  private final String webBaseUrl;

  public InvitationService(
      InvitationRepository invitations,
      AppUserRepository users,
      CustomerQueries customers,
      TenantQueries tenants,
      EmailSender email,
      AuthAdminClient authAdmin,
      AuditService audit,
      TenantTransactions transactions,
      UserService userService,
      UserMapper mapper,
      Clock clock,
      @Value("${trackdesk.web-base-url}") String webBaseUrl) {
    this.invitations = invitations;
    this.users = users;
    this.customers = customers;
    this.tenants = tenants;
    this.email = email;
    this.authAdmin = authAdmin;
    this.audit = audit;
    this.transactions = transactions;
    this.userService = userService;
    this.mapper = mapper;
    this.clock = clock;
    this.webBaseUrl = webBaseUrl;
  }

  @Transactional(readOnly = true)
  public List<InvitationDto> listPending() {
    Instant now = clock.instant();
    return invitations.findPending(now).stream().map(i -> mapper.toDto(i, now)).toList();
  }

  @Transactional
  @Audited(action = "invitation.created", entityType = "invitation")
  public InvitationDto create(CreateInvitationRequestDto request) {
    TenantPrincipal inviter = TenantContext.requirePrincipal();
    String role = request.getRole().getValue();
    if ("company_owner".equals(role) && !"company_owner".equals(inviter.role())) {
      throw ApiException.forbidden("cannot-grant-role", "Only a company owner can invite owners");
    }
    if ("customer".equals(role)) {
      if (request.getCustomerId() == null) {
        throw ApiException.badRequest("customer-required", "customerId is required for customers");
      }
      if (!customers.exists(request.getCustomerId())) {
        throw ApiException.notFound("Customer");
      }
    }
    Instant now = clock.instant();
    invitations.findOpenForEmail(request.getEmail()).forEach(i -> i.revoke(now));

    String token = InvitationTokens.newToken();
    Invitation invitation =
        invitations.saveAndFlush(
            new Invitation(
                request.getEmail(),
                role,
                "customer".equals(role) ? request.getCustomerId() : null,
                InvitationTokens.hash(token),
                inviter.userId(),
                now));
    email.sendInvitation(
        invitation.getEmail(),
        tenants.currentTenantName().orElse("TrackDesk"),
        role,
        webBaseUrl + "/accept-invite?token=" + token);
    return mapper.toDto(invitation, now);
  }

  @Transactional
  @Audited(action = "invitation.revoked", entityType = "invitation", idParam = "invitationId")
  public void revoke(UUID invitationId) {
    Invitation invitation =
        invitations.findById(invitationId).orElseThrow(() -> ApiException.notFound("Invitation"));
    invitation.revoke(clock.instant());
  }

  /** Not transactional: it starts its own transactions under different tenant contexts. */
  public MeDto accept(AcceptInvitationRequestDto request) {
    TenantPrincipal caller = TenantContext.requirePrincipal();
    if (caller.hasTenant()) {
      throw ApiException.conflict("already-member", "You already belong to a company");
    }
    String hash = InvitationTokens.hash(request.getToken());
    Map<String, String> capability = Map.of(INVITE_TOKEN_SETTING, hash);
    Instant now = clock.instant();

    InvitationSnapshot found =
        transactions.runAs(
            caller,
            capability,
            () -> invitations.findByTokenHash(hash).map(InvitationSnapshot::of).orElse(null));
    if (found == null) {
      throw ApiException.notFound("Invitation");
    }
    switch (found.invitation().status(now)) {
      case ACCEPTED -> throw ApiException.gone("invitation-used", "Invitation already used");
      case REVOKED -> throw ApiException.gone("invitation-revoked", "Invitation was revoked");
      case EXPIRED -> throw ApiException.gone("invitation-expired", "Invitation has expired");
      case PENDING -> {}
    }
    if (!found.invitation().isFor(caller.email())) {
      throw ApiException.forbidden(
          "invitation-email-mismatch", "This invitation was sent to a different email address");
    }

    TenantPrincipal member =
        caller.joining(
            found.tenantId(), found.invitation().getRole(), found.invitation().getCustomerId());
    return transactions.runAs(
        member,
        capability,
        () -> {
          Invitation invitation = invitations.findByTokenHash(hash).orElseThrow();
          users.saveAndFlush(
              new AppUser(
                  caller.userId(),
                  caller.email(),
                  request.getFullName(),
                  invitation.getRole(),
                  invitation.getCustomerId()));
          invitation.accept(caller.userId(), now);
          invitations.saveAndFlush(invitation);
          audit.record("invitation.accepted", "invitation", invitation.getId(), Map.of());
          authAdmin.setMembership(
              caller.userId(), found.tenantId(), invitation.getRole(), invitation.getCustomerId());
          return userService.me();
        });
  }

  /** Detached copy so no entity leaves the first transaction. */
  private record InvitationSnapshot(UUID tenantId, Invitation invitation) {
    static InvitationSnapshot of(Invitation i) {
      return new InvitationSnapshot(i.getTenantId(), i);
    }
  }
}
