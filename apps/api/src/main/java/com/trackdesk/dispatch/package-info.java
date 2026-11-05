/**
 * Dispatch — SCAFFOLD (Sprint 3). PRD: docs/prd/09-scheduling.md, 10-dispatch-board.md. Assignment
 * rules (pure Java) + PostGIS distance queries in the repository.
 *
 * <p>Follow the customers reference module: api/ (controller implementing the generated interface),
 * application/ (service, mapper, events), domain/ (entities, rules), infrastructure/ (repositories,
 * adapters). The table(s) already exist with RLS in V3__v1_module_scaffolds.sql.
 */
@ApplicationModule(displayName = "Dispatch")
package com.trackdesk.dispatch;

import org.springframework.modulith.ApplicationModule;
