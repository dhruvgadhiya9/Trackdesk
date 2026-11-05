/**
 * Customer portal — SCAFFOLD (Sprint 5). PRD: docs/prd/16-customer-portal.md. Customer-role
 * queries; RLS restricts rows to the user's own customer.
 *
 * <p>Follow the customers reference module: api/ (controller implementing the generated interface),
 * application/ (service, mapper, events), domain/ (entities, rules), infrastructure/ (repositories,
 * adapters). The table(s) already exist with RLS in V3__v1_module_scaffolds.sql.
 */
@ApplicationModule(displayName = "Customer portal")
package com.trackdesk.portal;

import org.springframework.modulith.ApplicationModule;
