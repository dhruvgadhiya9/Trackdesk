package com.trackdesk.platform.web;

import com.trackdesk.platform.tenancy.TenantContext;
import jakarta.validation.ConstraintViolationException;
import java.net.URI;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/** Renders every error as RFC 9457 Problem Details with a stable {@code code} and request id. */
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

  private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);
  private static final String TYPE_BASE = "https://trackdesk.app/problems/";

  @ExceptionHandler(ApiException.class)
  ResponseEntity<ProblemDetail> handleApi(ApiException ex) {
    return problem(ex.status(), ex.code(), ex.getMessage(), null);
  }

  @ExceptionHandler({AccessDeniedException.class, AuthorizationDeniedException.class})
  ResponseEntity<ProblemDetail> handleDenied(RuntimeException ex) {
    return problem(
        HttpStatus.FORBIDDEN, "forbidden", "You do not have permission for this action", null);
  }

  @ExceptionHandler(OptimisticLockingFailureException.class)
  ResponseEntity<ProblemDetail> handleOptimisticLock(OptimisticLockingFailureException ex) {
    return problem(
        HttpStatus.CONFLICT,
        "conflict",
        "The resource was modified by someone else; reload and retry",
        null);
  }

  @ExceptionHandler(DataIntegrityViolationException.class)
  ResponseEntity<ProblemDetail> handleIntegrity(DataIntegrityViolationException ex) {
    log.info("Data integrity violation: {}", ex.getMostSpecificCause().getMessage());
    return problem(
        HttpStatus.CONFLICT,
        "duplicate-or-invalid-reference",
        "Conflicts with existing data",
        null);
  }

  @ExceptionHandler(TenantContext.MissingTenantContextException.class)
  ResponseEntity<ProblemDetail> handleNoTenant(TenantContext.MissingTenantContextException ex) {
    return problem(HttpStatus.FORBIDDEN, "no-tenant", "Create or join a company first", null);
  }

  @ExceptionHandler(ConstraintViolationException.class)
  ResponseEntity<ProblemDetail> handleConstraint(ConstraintViolationException ex) {
    List<Map<String, String>> errors =
        ex.getConstraintViolations().stream()
            .map(v -> Map.of("field", v.getPropertyPath().toString(), "message", v.getMessage()))
            .toList();
    return problem(HttpStatus.BAD_REQUEST, "validation", "Request validation failed", errors);
  }

  @Override
  protected ResponseEntity<Object> handleMethodArgumentNotValid(
      MethodArgumentNotValidException ex,
      HttpHeaders headers,
      HttpStatusCode status,
      WebRequest request) {
    List<Map<String, String>> errors =
        ex.getBindingResult().getFieldErrors().stream()
            .map(
                e ->
                    Map.of(
                        "field",
                        e.getField(),
                        "message",
                        e.getDefaultMessage() == null ? "invalid" : e.getDefaultMessage()))
            .toList();
    return ResponseEntity.badRequest()
        .body(build(HttpStatus.BAD_REQUEST, "validation", "Request validation failed", errors));
  }

  @Override
  protected ResponseEntity<Object> handleExceptionInternal(
      Exception ex,
      @Nullable Object body,
      HttpHeaders headers,
      HttpStatusCode statusCode,
      WebRequest request) {
    ResponseEntity<Object> response =
        super.handleExceptionInternal(ex, body, headers, statusCode, request);
    if (response != null && response.getBody() instanceof ProblemDetail pd) {
      decorate(pd, "http-" + statusCode.value());
    }
    return response;
  }

  @ExceptionHandler(Exception.class)
  ResponseEntity<ProblemDetail> handleUnexpected(Exception ex) {
    log.error("Unhandled error", ex);
    return problem(HttpStatus.INTERNAL_SERVER_ERROR, "internal", "Unexpected error", null);
  }

  private ResponseEntity<ProblemDetail> problem(
      HttpStatus status, String code, String detail, @Nullable List<Map<String, String>> errors) {
    return ResponseEntity.status(status).body(build(status, code, detail, errors));
  }

  private ProblemDetail build(
      HttpStatus status, String code, String detail, @Nullable List<Map<String, String>> errors) {
    ProblemDetail pd = ProblemDetail.forStatusAndDetail(status, detail);
    pd.setTitle(status.getReasonPhrase());
    decorate(pd, code);
    if (errors != null) {
      pd.setProperty("errors", errors);
    }
    return pd;
  }

  private void decorate(ProblemDetail pd, String code) {
    pd.setType(URI.create(TYPE_BASE + code));
    pd.setProperty("code", code);
    String requestId = MDC.get(RequestIdFilter.MDC_KEY);
    if (requestId != null) {
      pd.setProperty("requestId", requestId);
    }
  }
}
