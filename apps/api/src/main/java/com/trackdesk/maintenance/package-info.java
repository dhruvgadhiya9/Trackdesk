/**
 * Planned maintenance — SCAFFOLD (Sprint 2). PRD: docs/prd/08-pm-schedules.md. PM schedules; job
 * generation via @Scheduled + ShedLock (idempotent).
 *
 * <p>Follow the customers reference module: api/ (controller implementing the generated interface),
 * application/ (service, mapper, events), domain/ (entities, rules), infrastructure/ (repositories,
 * adapters). The table(s) already exist with RLS in V3__v1_module_scaffolds.sql.
 */
@ApplicationModule(displayName = "Planned maintenance")
package com.trackdesk.maintenance;

import org.springframework.modulith.ApplicationModule;
