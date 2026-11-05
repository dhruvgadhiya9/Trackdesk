package com.trackdesk.platform.audit;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Marks a state-changing application-service method. After it returns successfully an append-only
 * {@code audit_event} row is written in the caller's tenant. The entity id is taken from the return
 * value's {@code getId()} (if any), otherwise from a {@code UUID} argument named like {@link
 * #idParam()}.
 */
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Audited {

  /** e.g. "customer.created". */
  String action();

  /** e.g. "customer". */
  String entityType();

  /** Name of the UUID parameter that identifies the entity when the return value has no id. */
  String idParam() default "";
}
