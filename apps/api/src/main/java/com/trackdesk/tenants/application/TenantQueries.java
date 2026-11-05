package com.trackdesk.tenants.application;

import java.util.Optional;

/** Read API of the tenants module for other modules. */
public interface TenantQueries {

  /** Name of the caller's company, if any (RLS-scoped). */
  Optional<String> currentTenantName();
}
