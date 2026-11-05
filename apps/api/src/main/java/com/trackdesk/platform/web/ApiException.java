package com.trackdesk.platform.web;

import org.springframework.http.HttpStatus;

/**
 * Base for domain/application errors rendered as RFC 9457 Problem Details by {@link
 * GlobalExceptionHandler}. {@code code} is a stable machine-readable identifier.
 */
public class ApiException extends RuntimeException {

  private final HttpStatus status;
  private final String code;

  public ApiException(HttpStatus status, String code, String detail) {
    super(detail);
    this.status = status;
    this.code = code;
  }

  public HttpStatus status() {
    return status;
  }

  public String code() {
    return code;
  }

  /** 404 — also used for other tenants' resources (never reveal existence). */
  public static ApiException notFound(String what) {
    return new ApiException(HttpStatus.NOT_FOUND, "not-found", what + " not found");
  }

  public static ApiException conflict(String code, String detail) {
    return new ApiException(HttpStatus.CONFLICT, code, detail);
  }

  public static ApiException forbidden(String code, String detail) {
    return new ApiException(HttpStatus.FORBIDDEN, code, detail);
  }

  public static ApiException gone(String code, String detail) {
    return new ApiException(HttpStatus.GONE, code, detail);
  }

  public static ApiException badRequest(String code, String detail) {
    return new ApiException(HttpStatus.BAD_REQUEST, code, detail);
  }
}
