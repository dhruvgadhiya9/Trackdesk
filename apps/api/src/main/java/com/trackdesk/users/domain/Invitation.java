// SECURITY-REVIEW-REQUIRED: invitation lifecycle (only the token hash is persisted).
package com.trackdesk.users.domain;

import com.trackdesk.platform.persistence.TenantScopedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "invitation")
public class Invitation extends TenantScopedEntity {

  public static final Duration VALIDITY = Duration.ofDays(7);

  public enum Status {
    PENDING,
    ACCEPTED,
    REVOKED,
    EXPIRED
  }

  @Column(nullable = false)
  private String email;

  @Column(nullable = false)
  private String role;

  private UUID customerId;

  @Column(nullable = false, updatable = false)
  private String tokenHash;

  @Column(nullable = false, updatable = false)
  private UUID invitedBy;

  @Column(nullable = false)
  private Instant expiresAt;

  private Instant acceptedAt;
  private UUID acceptedUserId;
  private Instant revokedAt;

  @CreationTimestamp
  @Column(nullable = false, updatable = false)
  private Instant createdAt;

  protected Invitation() {}

  public Invitation(
      String email, String role, UUID customerId, String tokenHash, UUID invitedBy, Instant now) {
    this.email = email.trim().toLowerCase();
    this.role = role;
    this.customerId = customerId;
    this.tokenHash = tokenHash;
    this.invitedBy = invitedBy;
    this.expiresAt = now.plus(VALIDITY);
  }

  public Status status(Instant now) {
    if (acceptedAt != null) {
      return Status.ACCEPTED;
    }
    if (revokedAt != null) {
      return Status.REVOKED;
    }
    return now.isAfter(expiresAt) ? Status.EXPIRED : Status.PENDING;
  }

  public void accept(UUID userId, Instant now) {
    if (status(now) != Status.PENDING) {
      throw new IllegalStateException("Invitation is " + status(now));
    }
    this.acceptedAt = now;
    this.acceptedUserId = userId;
  }

  public void revoke(Instant now) {
    if (status(now) == Status.PENDING) {
      this.revokedAt = now;
    }
  }

  public boolean isFor(String otherEmail) {
    return otherEmail != null && email.equalsIgnoreCase(otherEmail.trim());
  }

  public String getEmail() {
    return email;
  }

  public String getRole() {
    return role;
  }

  public UUID getCustomerId() {
    return customerId;
  }

  public Instant getExpiresAt() {
    return expiresAt;
  }
}
