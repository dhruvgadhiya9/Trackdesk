/**
 * Customers — the REFERENCE MODULE. Every other module copies this shape:
 *
 * <ul>
 *   <li>{@code api/} controller implementing the generated {@code CustomersApi}, with
 *       {@code @PreAuthorize} using {@code Permission} constants. No repository access.
 *   <li>{@code application/} transactional service (+ {@code @Audited}), MapStruct mapper, public
 *       query interface for other modules ({@link
 *       com.trackdesk.customers.application.CustomerQueries}) and events. This is the module's only
 *       public surface.
 *   <li>{@code domain/} entity + rules (plain Java).
 *   <li>{@code infrastructure/} Spring Data repository — the only place queries live.
 * </ul>
 *
 * PRD: docs/prd/01-customers.md · Contract: packages/contracts/openapi/customers.yaml · Migration:
 * V2__customers.sql
 */
@ApplicationModule(displayName = "Customers")
package com.trackdesk.customers;

import org.springframework.modulith.ApplicationModule;
