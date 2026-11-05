/**
 * Jobs — SCAFFOLD (Sprint 2). PRD: docs/prd/06-jobs.md. Job aggregate and the explicit lifecycle
 * state machine (see domain.JobStatus).
 *
 * <p>Follow the customers reference module: api/ (controller implementing the generated interface),
 * application/ (service, mapper, events), domain/ (entities, rules), infrastructure/ (repositories,
 * adapters). The table(s) already exist with RLS in V3__v1_module_scaffolds.sql.
 */
@ApplicationModule(displayName = "Jobs")
package com.trackdesk.jobs;

import org.springframework.modulith.ApplicationModule;
