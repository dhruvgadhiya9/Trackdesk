package com.trackdesk.platform.audit;

import java.util.List;
import java.util.UUID;
import org.springframework.data.repository.Repository;

/** Append-only: exposes save and reads only (no delete, no update methods). */
public interface AuditEventRepository extends Repository<AuditEvent, UUID> {

  AuditEvent save(AuditEvent event);

  List<AuditEvent> findByEntityTypeAndEntityIdOrderByOccurredAtAsc(
      String entityType, UUID entityId);

  List<AuditEvent> findByActionOrderByOccurredAtAsc(String action);
}
