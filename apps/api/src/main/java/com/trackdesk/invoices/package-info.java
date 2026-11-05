/**
 * Invoices — SCAFFOLD (Sprint 6). PRD: docs/prd/19-invoices.md. Money as BigDecimal, UK VAT,
 * HALF_UP per line.
 *
 * <p>Follow the customers reference module: api/ (controller implementing the generated interface),
 * application/ (service, mapper, events), domain/ (entities, rules), infrastructure/ (repositories,
 * adapters). The table(s) already exist with RLS in V3__v1_module_scaffolds.sql.
 */
@ApplicationModule(displayName = "Invoices")
package com.trackdesk.invoices;

import org.springframework.modulith.ApplicationModule;
