package com.trackdesk.users.api;

import com.trackdesk.contracts.api.UsersApi;
import com.trackdesk.contracts.model.AcceptInvitationRequestDto;
import com.trackdesk.contracts.model.CreateInvitationRequestDto;
import com.trackdesk.contracts.model.InvitationDto;
import com.trackdesk.contracts.model.MeDto;
import com.trackdesk.contracts.model.UserDto;
import com.trackdesk.contracts.model.UserPageDto;
import com.trackdesk.platform.security.Permission;
import com.trackdesk.users.application.InvitationService;
import com.trackdesk.users.application.UserService;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RestController;

/** updateUser is not overridden yet (Sprint 1) and returns 501 from the generated default. */
@RestController
public class UsersController implements UsersApi {

  private final UserService users;
  private final InvitationService invitations;

  public UsersController(UserService users, InvitationService invitations) {
    this.users = users;
    this.invitations = invitations;
  }

  @Override
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<MeDto> getMe() {
    return ResponseEntity.ok(users.me());
  }

  @Override
  @PreAuthorize("hasAuthority('" + Permission.USERS_READ + "')")
  public ResponseEntity<UserPageDto> listUsers(Integer page, Integer size) {
    return ResponseEntity.ok(users.list(page, size));
  }

  @Override
  @PreAuthorize("hasAuthority('" + Permission.USERS_READ + "')")
  public ResponseEntity<UserDto> getUser(UUID userId) {
    return ResponseEntity.ok(users.get(userId));
  }

  @Override
  @PreAuthorize("hasAuthority('" + Permission.USERS_INVITE + "')")
  public ResponseEntity<List<InvitationDto>> listInvitations() {
    return ResponseEntity.ok(invitations.listPending());
  }

  @Override
  @PreAuthorize("hasAuthority('" + Permission.USERS_INVITE + "')")
  public ResponseEntity<InvitationDto> createInvitation(CreateInvitationRequestDto request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(invitations.create(request));
  }

  @Override
  @PreAuthorize("hasAuthority('" + Permission.USERS_INVITE + "')")
  public ResponseEntity<Void> revokeInvitation(UUID invitationId) {
    invitations.revoke(invitationId);
    return ResponseEntity.noContent().build();
  }

  /** Any authenticated user WITHOUT a tenant (checked in the service). */
  @Override
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<MeDto> acceptInvitation(AcceptInvitationRequestDto request) {
    return ResponseEntity.ok(invitations.accept(request));
  }
}
