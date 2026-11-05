package com.trackdesk.platform.audit;

import com.trackdesk.platform.tenancy.TenantContext;
import com.trackdesk.platform.tenancy.TenantPrincipal;
import com.trackdesk.platform.web.RequestIdFilter;
import java.util.Map;
import java.util.UUID;
import org.slf4j.MDC;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Writes audit events in the current tenant (joins the caller's transaction if present). */
@Service
public class AuditService {

  private final AuditEventRepository repository;

  public AuditService(AuditEventRepository repository) {
    this.repository = repository;
  }

  @Transactional
  public void record(String action, String entityType, UUID entityId, Map<String, Object> details) {
    TenantPrincipal p = TenantContext.requirePrincipal();
    repository.save(
        new AuditEvent(
            p.userId(),
            p.role(),
            action,
            entityType,
            entityId,
            MDC.get(RequestIdFilter.MDC_KEY),
            details));
  }
}
