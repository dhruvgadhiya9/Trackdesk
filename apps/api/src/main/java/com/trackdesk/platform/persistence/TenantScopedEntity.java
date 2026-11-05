// SECURITY-REVIEW-REQUIRED: tenant isolation — base class for every tenant-scoped entity.
package com.trackdesk.platform.persistence;

import com.trackdesk.platform.tenancy.TenantContext;
import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PostLoad;
import jakarta.persistence.PostPersist;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Transient;
import java.util.Objects;
import java.util.UUID;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;
import org.springframework.data.domain.Persistable;

/**
 * Base for tenant-scoped entities. {@code tenant_id} is taken from {@link TenantContext} on persist
 * and is never updatable. The Hibernate {@code tenantFilter} (enabled per transaction by
 * TenantAwareJpaTransactionManager) is a second layer on top of Postgres RLS — never a replacement
 * for it.
 */
@MappedSuperclass
@FilterDef(
    name = "tenantFilter",
    parameters = @ParamDef(name = "tenantId", type = UUID.class),
    defaultCondition = "tenant_id = :tenantId")
@Filter(name = "tenantFilter")
public abstract class TenantScopedEntity implements Persistable<UUID> {

  @Id
  @Column(name = "id", nullable = false, updatable = false)
  private UUID id;

  @Column(name = "tenant_id", nullable = false, updatable = false)
  private UUID tenantId;

  @Transient private boolean isNew = true;

  protected TenantScopedEntity() {
    this.id = UUID.randomUUID();
  }

  protected TenantScopedEntity(UUID id) {
    this.id = Objects.requireNonNull(id, "id");
  }

  @PrePersist
  void assignTenant() {
    UUID current = TenantContext.requireTenantId();
    if (tenantId == null) {
      tenantId = current;
    } else if (!tenantId.equals(current)) {
      throw new IllegalStateException("Entity tenant does not match the current tenant");
    }
  }

  @PostLoad
  @PostPersist
  void markNotNew() {
    this.isNew = false;
  }

  @Override
  public UUID getId() {
    return id;
  }

  public UUID getTenantId() {
    return tenantId;
  }

  @Override
  public boolean isNew() {
    return isNew;
  }

  @Override
  public boolean equals(Object o) {
    return this == o || (o instanceof TenantScopedEntity other && id.equals(other.id));
  }

  @Override
  public int hashCode() {
    return id.hashCode();
  }
}
