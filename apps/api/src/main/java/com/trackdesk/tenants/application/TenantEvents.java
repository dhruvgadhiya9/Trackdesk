package com.trackdesk.tenants.application;

import java.util.UUID;

public final class TenantEvents {

  private TenantEvents() {}

  /**
   * Published synchronously inside the onboarding transaction (tenant context already set to the
   * new tenant). The users module listens and provisions the owner's {@code app_user} row.
   */
  public record TenantCreated(
      UUID tenantId, UUID ownerUserId, String ownerEmail, String ownerFullName) {}
}
