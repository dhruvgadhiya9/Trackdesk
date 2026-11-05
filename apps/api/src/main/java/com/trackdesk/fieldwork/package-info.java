/**
 * Field work — SCAFFOLD (Sprint 4). PRD: docs/prd/12-job-execution.md, 13-gps-geofence.md,
 * 14-offline-sync.md. SECURITY-REVIEW-REQUIRED: location data, consent, working-hours gating,
 * offline idempotency.
 *
 * <p>Follow the customers reference module: api/ (controller implementing the generated interface),
 * application/ (service, mapper, events), domain/ (entities, rules), infrastructure/ (repositories,
 * adapters). The table(s) already exist with RLS in V3__v1_module_scaffolds.sql.
 */
@ApplicationModule(displayName = "Field work")
package com.trackdesk.fieldwork;

import org.springframework.modulith.ApplicationModule;
