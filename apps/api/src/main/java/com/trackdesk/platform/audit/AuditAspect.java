package com.trackdesk.platform.audit;

import java.lang.reflect.Method;
import java.util.Map;
import java.util.UUID;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;

/**
 * Records an audit event after every successful {@link Audited} method. Runs in the same
 * transaction when the service is transactional (so a rollback also drops the audit row).
 */
@Aspect
@Component
public class AuditAspect {

  private final AuditService auditService;

  public AuditAspect(AuditService auditService) {
    this.auditService = auditService;
  }

  @AfterReturning(pointcut = "@annotation(audited)", returning = "result")
  public void audit(JoinPoint joinPoint, Audited audited, Object result) {
    UUID entityId = idFromResult(result);
    if (entityId == null && !audited.idParam().isEmpty()) {
      entityId = idFromArgs(joinPoint, audited.idParam());
    }
    auditService.record(audited.action(), audited.entityType(), entityId, Map.of());
  }

  private static UUID idFromResult(Object result) {
    if (result == null) {
      return null;
    }
    if (result instanceof UUID id) {
      return id;
    }
    try {
      Method getId = result.getClass().getMethod("getId");
      return getId.invoke(result) instanceof UUID id ? id : null;
    } catch (ReflectiveOperationException e) {
      return null;
    }
  }

  private static UUID idFromArgs(JoinPoint joinPoint, String name) {
    String[] names = ((MethodSignature) joinPoint.getSignature()).getParameterNames();
    Object[] args = joinPoint.getArgs();
    for (int i = 0; i < names.length; i++) {
      if (names[i].equals(name) && args[i] instanceof UUID id) {
        return id;
      }
    }
    return null;
  }
}
