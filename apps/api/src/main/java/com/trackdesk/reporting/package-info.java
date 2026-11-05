/**
 * Reporting — SCAFFOLD (Sprint 6). PRD: docs/prd/21-reporting.md. Read-only, tenant-scoped
 * repository queries.
 *
 * <p>Follow the customers reference module: api/ (controller implementing the generated interface),
 * application/ (service, mapper, events), domain/ (entities, rules), infrastructure/ (repositories,
 * adapters). The table(s) already exist with RLS in V3__v1_module_scaffolds.sql.
 */
@ApplicationModule(displayName = "Reporting")
package com.trackdesk.reporting;

import org.springframework.modulith.ApplicationModule;
