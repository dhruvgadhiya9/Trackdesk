package com.trackdesk.customers.application;

import java.util.UUID;

/** Application events published by the customers module (Spring application events). */
public final class CustomerEvents {

  private CustomerEvents() {}

  public record CustomerCreated(UUID tenantId, UUID customerId) {}

  public record CustomerArchived(UUID tenantId, UUID customerId) {}
}
