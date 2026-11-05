/**
 * Quotes — SCAFFOLD (Sprint 6). PRD: docs/prd/18-quotes.md. Money as BigDecimal, UK VAT, HALF_UP
 * per line.
 *
 * <p>Follow the customers reference module: api/ (controller implementing the generated interface),
 * application/ (service, mapper, events), domain/ (entities, rules), infrastructure/ (repositories,
 * adapters). The table(s) already exist with RLS in V3__v1_module_scaffolds.sql.
 */
@ApplicationModule(displayName = "Quotes")
package com.trackdesk.quotes;

import org.springframework.modulith.ApplicationModule;
