// SECURITY-REVIEW-REQUIRED: tenant onboarding — creates a tenant and grants company_owner.
package com.trackdesk.tenants.application;

import com.trackdesk.contracts.model.CreateTenantRequestDto;
import com.trackdesk.contracts.model.TenantDto;
import com.trackdesk.platform.audit.AuditService;
import com.trackdesk.platform.auth.AuthAdminClient;
import com.trackdesk.platform.tenancy.TenantContext;
import com.trackdesk.platform.tenancy.TenantPrincipal;
import com.trackdesk.platform.tenancy.TenantTransactions;
import com.trackdesk.platform.web.ApiException;
import com.trackdesk.tenants.application.TenantEvents.TenantCreated;
import com.trackdesk.tenants.domain.Tenant;
import com.trackdesk.tenants.infrastructure.TenantRepository;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Sign up → create company. The caller (authenticated, no tenant yet) becomes company_owner.
 *
 * <p>Steps, in ONE transaction run as the new tenant (so RLS insert checks pass): insert tenant →
 * {@link TenantCreated} (users module inserts the owner) → audit → flush → set the owner's
 * app_metadata via the auth admin API as the last step before commit, so a failure rolls back.
 */
@Service
public class TenantOnboardingService implements TenantQueries {

  public static final String OWNER_ROLE = "company_owner";

  private final TenantRepository tenants;
  private final TenantTransactions transactions;
  private final ApplicationEventPublisher events;
  private final AuditService audit;
  private final AuthAdminClient authAdmin;
  private final TenantMapper mapper;

  public TenantOnboardingService(
      TenantRepository tenants,
      TenantTransactions transactions,
      ApplicationEventPublisher events,
      AuditService audit,
      AuthAdminClient authAdmin,
      TenantMapper mapper) {
    this.tenants = tenants;
    this.transactions = transactions;
    this.events = events;
    this.audit = audit;
    this.authAdmin = authAdmin;
    this.mapper = mapper;
  }

  public TenantDto createTenant(CreateTenantRequestDto request) {
    TenantPrincipal caller = TenantContext.requirePrincipal();
    if (caller.hasTenant()) {
      throw ApiException.conflict("already-member", "You already belong to a company");
    }
    UUID tenantId = UUID.randomUUID();
    TenantPrincipal owner = caller.joining(tenantId, OWNER_ROLE, null);
    try {
      return transactions.runAs(
          owner,
          () -> {
            Tenant tenant = tenants.save(Tenant.create(tenantId, request.getName()));
            events.publishEvent(
                new TenantCreated(
                    tenantId, caller.userId(), caller.email(), request.getFullName()));
            audit.record("tenant.created", "tenant", tenantId, Map.of("name", tenant.getName()));
            tenants.flush();
            authAdmin.setMembership(caller.userId(), tenantId, OWNER_ROLE, null);
            return mapper.toDto(tenant);
          });
    } catch (DataIntegrityViolationException e) {
      // e.g. this auth user already has an app_user row in another tenant.
      throw ApiException.conflict("already-member", "You already belong to a company");
    }
  }

  @Transactional(readOnly = true)
  public TenantDto current() {
    UUID tenantId = TenantContext.requireTenantId();
    return tenants
        .findById(tenantId)
        .map(mapper::toDto)
        .orElseThrow(() -> ApiException.notFound("Tenant"));
  }

  @Override
  @Transactional(readOnly = true)
  public Optional<String> currentTenantName() {
    return TenantContext.current()
        .flatMap(TenantPrincipal::tenant)
        .flatMap(tenants::findById)
        .map(Tenant::getName);
  }
}
