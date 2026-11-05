/**
 * Chat — SCAFFOLD (Sprint 6). PRD: docs/prd/22-chat.md. History/moderation API; live delivery
 * through Supabase Realtime (RLS-scoped).
 *
 * <p>Follow the customers reference module: api/ (controller implementing the generated interface),
 * application/ (service, mapper, events), domain/ (entities, rules), infrastructure/ (repositories,
 * adapters). The table(s) already exist with RLS in V3__v1_module_scaffolds.sql.
 */
@ApplicationModule(displayName = "Chat")
package com.trackdesk.chat;

import org.springframework.modulith.ApplicationModule;
