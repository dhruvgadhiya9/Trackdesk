// SECURITY-REVIEW-REQUIRED: audit log — append-only (no setters; DB grants + trigger).
package com.trackdesk.platform.audit;

import com.trackdesk.platform.persistence.TenantScopedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Immutable
@Table(name = "audit_event")
public class AuditEvent extends TenantScopedEntity {

  @Column(name = "occurred_at", nullable = false, updatable = false)
  private Instant occurredAt;

  @Column(name = "actor_user_id", updatable = false)
  private UUID actorUserId;

  @Column(name = "actor_role", updatable = false)
  private String actorRole;

  @Column(name = "action", nullable = false, updatable = false)
  private String action;

  @Column(name = "entity_type", nullable = false, updatable = false)
  private String entityType;

  @Column(name = "entity_id", updatable = false)
  private UUID entityId;

  @Column(name = "request_id", updatable = false)
  private String requestId;

  @JdbcTypeCode(SqlTypes.JSON)
  @Column(name = "details", nullable = false, updatable = false)
  private Map<String, Object> details;

  protected AuditEvent() {}

  public AuditEvent(
      UUID actorUserId,
      String actorRole,
      String action,
      String entityType,
      UUID entityId,
      String requestId,
      Map<String, Object> details) {
    this.occurredAt = Instant.now();
    this.actorUserId = actorUserId;
    this.actorRole = actorRole;
    this.action = action;
    this.entityType = entityType;
    this.entityId = entityId;
    this.requestId = requestId;
    this.details = details == null ? Map.of() : Map.copyOf(details);
  }

  public Instant getOccurredAt() {
    return occurredAt;
  }

  public UUID getActorUserId() {
    return actorUserId;
  }

  public String getAction() {
    return action;
  }

  public String getEntityType() {
    return entityType;
  }

  public UUID getEntityId() {
    return entityId;
  }
}
