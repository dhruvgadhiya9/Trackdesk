/**
 * Verification (Happy Code) — SCAFFOLD (Sprint 5). PRD: docs/prd/15-happy-code.md.
 * SECURITY-REVIEW-REQUIRED: OTP hashing, attempt and rate limits.
 *
 * <p>Follow the customers reference module: api/ (controller implementing the generated interface),
 * application/ (service, mapper, events), domain/ (entities, rules), infrastructure/ (repositories,
 * adapters). The table(s) already exist with RLS in V3__v1_module_scaffolds.sql.
 */
@ApplicationModule(displayName = "Verification (Happy Code)")
package com.trackdesk.verification;

import org.springframework.modulith.ApplicationModule;
