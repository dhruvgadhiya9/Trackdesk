package com.trackdesk.platform.auth;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/** In-memory adapter for local/test. Records the membership a real provider would store. */
public class FakeAuthAdminClient implements AuthAdminClient {

  private static final Logger log = LoggerFactory.getLogger(FakeAuthAdminClient.class);

  /** Snapshot of the claims a refreshed token would carry. */
  public record Membership(UUID tenantId, String role, UUID customerId) {}

  private final Map<UUID, Membership> memberships = new ConcurrentHashMap<>();

  @Override
  public void setMembership(UUID userId, UUID tenantId, String role, UUID customerId) {
    memberships.put(userId, new Membership(tenantId, role, customerId));
    log.info("[fake-auth-admin] user {} -> tenant {} role {}", userId, tenantId, role);
  }

  @Override
  public void clearMembership(UUID userId) {
    memberships.remove(userId);
  }

  public Optional<Membership> membership(UUID userId) {
    return Optional.ofNullable(memberships.get(userId));
  }
}
