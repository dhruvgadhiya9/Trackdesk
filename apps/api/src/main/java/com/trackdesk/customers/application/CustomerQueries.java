package com.trackdesk.customers.application;

import java.util.UUID;

/** Read API of the customers module for other modules (e.g. users validating invitations). */
public interface CustomerQueries {

  /** True if the customer exists and is visible to the caller (same tenant, via RLS). */
  boolean exists(UUID customerId);
}
