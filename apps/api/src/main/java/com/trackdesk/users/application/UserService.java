package com.trackdesk.users.application;

import com.trackdesk.contracts.model.MeDto;
import com.trackdesk.contracts.model.RoleDto;
import com.trackdesk.contracts.model.UserDto;
import com.trackdesk.contracts.model.UserPageDto;
import com.trackdesk.platform.security.Permission;
import com.trackdesk.platform.tenancy.TenantContext;
import com.trackdesk.platform.tenancy.TenantPrincipal;
import com.trackdesk.platform.web.ApiException;
import com.trackdesk.platform.web.Pages;
import com.trackdesk.tenants.application.TenantEvents.TenantCreated;
import com.trackdesk.tenants.application.TenantQueries;
import com.trackdesk.users.domain.AppUser;
import com.trackdesk.users.infrastructure.AppUserRepository;
import java.util.ArrayList;
import java.util.UUID;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

  private final AppUserRepository users;
  private final TenantQueries tenants;
  private final UserMapper mapper;

  public UserService(AppUserRepository users, TenantQueries tenants, UserMapper mapper) {
    this.users = users;
    this.tenants = tenants;
    this.mapper = mapper;
  }

  /** Works for users without a company too (they get no permissions until onboarding). */
  @Transactional(readOnly = true)
  public MeDto me() {
    TenantPrincipal p = TenantContext.requirePrincipal();
    MeDto me = new MeDto().userId(p.userId()).email(p.email()).permissions(new ArrayList<>());
    if (!p.hasTenant()) {
      return me;
    }
    users.findById(p.userId()).ifPresent(u -> me.email(u.getEmail()).fullName(u.getFullName()));
    me.tenantId(p.tenantId()).tenantName(tenants.currentTenantName().orElse(null));
    if (p.role() != null) {
      me.role(RoleDto.fromValue(p.role()));
      me.permissions(Permission.forRole(p.role()).stream().sorted().toList());
    }
    return me;
  }

  @Transactional(readOnly = true)
  public UserPageDto list(Integer page, Integer size) {
    Page<AppUser> result = users.findAll(Pages.of(page, size, Sort.by("email")));
    return new UserPageDto().items(result.map(mapper::toDto).getContent()).page(Pages.meta(result));
  }

  @Transactional(readOnly = true)
  public UserDto get(UUID id) {
    return users.findById(id).map(mapper::toDto).orElseThrow(() -> ApiException.notFound("User"));
  }

  /**
   * Provisions the company owner inside the onboarding transaction (synchronous listener; the
   * tenant context is already the new tenant).
   */
  @EventListener
  @Transactional(propagation = Propagation.MANDATORY)
  public void onTenantCreated(TenantCreated event) {
    users.save(
        new AppUser(
            event.ownerUserId(), event.ownerEmail(), event.ownerFullName(), "company_owner", null));
  }
}
