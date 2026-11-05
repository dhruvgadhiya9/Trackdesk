/**
 * Assets — SCAFFOLD (Sprint 1). PRD: docs/prd/03-assets.md. BS 5839 / BS 5266 asset types with
 * PostGIS location.
 *
 * <p>Follow the customers reference module: api/ (controller implementing the generated interface),
 * application/ (service, mapper, events), domain/ (entities, rules), infrastructure/ (repositories,
 * adapters). The table(s) already exist with RLS in V3__v1_module_scaffolds.sql.
 */
@ApplicationModule(displayName = "Assets")
package com.trackdesk.assets;

import org.springframework.modulith.ApplicationModule;
