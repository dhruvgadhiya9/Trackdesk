/**
 * Compliance — SCAFFOLD (Sprint 5). PRD: docs/prd/17-compliance-certificates.md.
 * SECURITY-REVIEW-REQUIRED and compliance advisor sign-off: immutable, versioned certificates.
 *
 * <p>Follow the customers reference module: api/ (controller implementing the generated interface),
 * application/ (service, mapper, events), domain/ (entities, rules), infrastructure/ (repositories,
 * adapters). The table(s) already exist with RLS in V3__v1_module_scaffolds.sql.
 */
@ApplicationModule(displayName = "Compliance")
package com.trackdesk.compliance;

import org.springframework.modulith.ApplicationModule;
