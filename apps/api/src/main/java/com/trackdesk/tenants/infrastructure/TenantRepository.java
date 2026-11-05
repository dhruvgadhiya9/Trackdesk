package com.trackdesk.tenants.infrastructure;

import com.trackdesk.tenants.domain.Tenant;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

/** RLS: a caller can only ever read their own tenant row. */
public interface TenantRepository extends JpaRepository<Tenant, UUID> {}
