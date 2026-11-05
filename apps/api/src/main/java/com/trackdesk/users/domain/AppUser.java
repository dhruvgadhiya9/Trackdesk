package com.trackdesk.users.domain;

import com.trackdesk.platform.persistence.TenantScopedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

/** A member of a tenant. {@code id} is the Supabase auth user id. */
@Entity
@Table(name = "app_user")
public class AppUser extends TenantScopedEntity {

  @Column(nullable = false)
  private String email;

  private String fullName;
  private String phone;

  @Column(nullable = false)
  private String role;

  @Column(nullable = false)
  private String status;

  private UUID customerId;

  @CreationTimestamp
  @Column(nullable = false, updatable = false)
  private Instant createdAt;

  @UpdateTimestamp
  @Column(nullable = false)
  private Instant updatedAt;

  protected AppUser() {}

  public AppUser(UUID authUserId, String email, String fullName, String role, UUID customerId) {
    super(authUserId);
    if (email == null || email.isBlank()) {
      throw new IllegalArgumentException("email is required");
    }
    if ("customer".equals(role) && customerId == null) {
      throw new IllegalArgumentException("customer users must be linked to a customer");
    }
    this.email = email.trim().toLowerCase();
    this.fullName = fullName == null || fullName.isBlank() ? null : fullName.trim();
    this.role = role;
    this.status = "active";
    this.customerId = customerId;
  }

  public String getEmail() {
    return email;
  }

  public String getFullName() {
    return fullName;
  }

  public String getPhone() {
    return phone;
  }

  public String getRole() {
    return role;
  }

  public String getStatus() {
    return status;
  }

  public UUID getCustomerId() {
    return customerId;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }
}
