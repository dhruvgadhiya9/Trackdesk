package com.trackdesk.tenants.api;

import com.trackdesk.contracts.api.TenantsApi;
import com.trackdesk.contracts.model.CreateTenantRequestDto;
import com.trackdesk.contracts.model.TenantDto;
import com.trackdesk.platform.security.Permission;
import com.trackdesk.tenants.application.TenantOnboardingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TenantsController implements TenantsApi {

  private final TenantOnboardingService service;

  public TenantsController(TenantOnboardingService service) {
    this.service = service;
  }

  /** Any authenticated user WITHOUT a tenant (checked in the service). */
  @Override
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<TenantDto> createTenant(CreateTenantRequestDto request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(service.createTenant(request));
  }

  @Override
  @PreAuthorize("hasAuthority('" + Permission.TENANT_READ + "')")
  public ResponseEntity<TenantDto> getCurrentTenant() {
    return ResponseEntity.ok(service.current());
  }
}
