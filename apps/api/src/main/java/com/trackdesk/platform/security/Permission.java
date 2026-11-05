// GENERATED from packages/contracts/permissions.yaml by gen-permissions.mjs — DO NOT EDIT.
// SECURITY-REVIEW-REQUIRED: role permission matrix.
package com.trackdesk.platform.security;

import java.util.Map;
import java.util.Set;

/**
 * Permission constants (Spring Security authorities) and the role → permission matrix. Use as
 * {@code @PreAuthorize("hasAuthority('" + Permission.CUSTOMERS_READ + "')")}.
 */
public final class Permission {

  private Permission() {}

  /** View assets. Roles: company_owner, ops_manager, field_worker, customer. */
  public static final String ASSETS_READ = "assets:read";

  /** Create and update assets. Roles: company_owner, ops_manager. */
  public static final String ASSETS_WRITE = "assets:write";

  /** Read the audit log. Roles: company_owner. */
  public static final String AUDIT_READ = "audit:read";

  /** Hide messages. Roles: company_owner, ops_manager. */
  public static final String CHAT_MODERATE = "chat:moderate";

  /** Read conversations you participate in. Roles: company_owner, ops_manager, field_worker, customer. */
  public static final String CHAT_READ = "chat:read";

  /** Send messages. Roles: company_owner, ops_manager, field_worker, customer. */
  public static final String CHAT_WRITE = "chat:write";

  /** Issue and correct certificates. Roles: company_owner, ops_manager. */
  public static final String COMPLIANCE_ISSUE = "compliance:issue";

  /** View certificates and records. Roles: company_owner, ops_manager, customer. */
  public static final String COMPLIANCE_READ = "compliance:read";

  /** Archive customers. Roles: company_owner, ops_manager. */
  public static final String CUSTOMERS_ARCHIVE = "customers:archive";

  /** Create customers. Roles: company_owner, ops_manager. */
  public static final String CUSTOMERS_CREATE = "customers:create";

  /** View customers. Roles: company_owner, ops_manager, field_worker, customer. */
  public static final String CUSTOMERS_READ = "customers:read";

  /** Update customers. Roles: company_owner, ops_manager. */
  public static final String CUSTOMERS_UPDATE = "customers:update";

  /** Assign and schedule jobs. Roles: company_owner, ops_manager. */
  public static final String DISPATCH_ASSIGN = "dispatch:assign";

  /** View the dispatch board and suggestions. Roles: company_owner, ops_manager. */
  public static final String DISPATCH_READ = "dispatch:read";

  /** Manage feature flags per tenant. Roles: portal_owner. */
  public static final String FEATUREFLAGS_MANAGE = "featureflags:manage";

  /** Read effective feature flags. Roles: company_owner, ops_manager, field_worker, customer, portal_owner. */
  public static final String FEATUREFLAGS_READ = "featureflags:read";

  /** Execute assigned jobs (checklists. Roles: field_worker. */
  public static final String FIELDWORK_EXECUTE = "fieldwork:execute";

  /** View invoices. Roles: company_owner, ops_manager, customer. */
  public static final String INVOICES_READ = "invoices:read";

  /** Create and issue invoices. Roles: company_owner, ops_manager. */
  public static final String INVOICES_WRITE = "invoices:write";

  /** View jobs. Roles: company_owner, ops_manager, field_worker, customer. */
  public static final String JOBS_READ = "jobs:read";

  /** Change job status (field workers limited to own jobs and field transitions). Roles: company_owner, ops_manager, field_worker. */
  public static final String JOBS_TRANSITION = "jobs:transition";

  /** Create and edit jobs. Roles: company_owner, ops_manager. */
  public static final String JOBS_WRITE = "jobs:write";

  /** View technician locations. Roles: company_owner, ops_manager. */
  public static final String LOCATION_READ = "location:read";

  /** Report own location (with consent). Roles: field_worker. */
  public static final String LOCATION_REPORT = "location:report";

  /** View PM schedules. Roles: company_owner, ops_manager, customer. */
  public static final String MAINTENANCE_READ = "maintenance:read";

  /** Manage PM schedules. Roles: company_owner, ops_manager. */
  public static final String MAINTENANCE_WRITE = "maintenance:write";

  /** Create pay links. Roles: company_owner, ops_manager, customer. */
  public static final String PAYMENTS_COLLECT = "payments:collect";

  /** View payments. Roles: company_owner, ops_manager, customer. */
  public static final String PAYMENTS_READ = "payments:read";

  /** List tenants (platform admin). Roles: portal_owner. */
  public static final String PLATFORM_TENANTS_READ = "platform:tenants:read";

  /** Use the customer portal. Roles: customer. */
  public static final String PORTAL_ACCESS = "portal:access";

  /** Request a job from the portal. Roles: customer. */
  public static final String PORTAL_REQUEST_JOB = "portal:request-job";

  /** Accept a quote. Roles: company_owner, ops_manager, customer. */
  public static final String QUOTES_ACCEPT = "quotes:accept";

  /** View quotes. Roles: company_owner, ops_manager, customer. */
  public static final String QUOTES_READ = "quotes:read";

  /** Create and send quotes. Roles: company_owner, ops_manager. */
  public static final String QUOTES_WRITE = "quotes:write";

  /** View reports. Roles: company_owner, ops_manager. */
  public static final String REPORTING_READ = "reporting:read";

  /** View sites. Roles: company_owner, ops_manager, field_worker, customer. */
  public static final String SITES_READ = "sites:read";

  /** Create and update sites. Roles: company_owner, ops_manager. */
  public static final String SITES_WRITE = "sites:write";

  /** View teams. Roles: company_owner, ops_manager, field_worker. */
  public static final String TEAMS_READ = "teams:read";

  /** Manage teams. Roles: company_owner, ops_manager. */
  public static final String TEAMS_WRITE = "teams:write";

  /** Read own company profile. Roles: company_owner, ops_manager, field_worker, customer. */
  public static final String TENANT_READ = "tenant:read";

  /** Invite users and manage invitations. Roles: company_owner, ops_manager. */
  public static final String USERS_INVITE = "users:invite";

  /** Change roles and disable users. Roles: company_owner. */
  public static final String USERS_MANAGE = "users:manage";

  /** List and view users. Roles: company_owner, ops_manager. */
  public static final String USERS_READ = "users:read";

  /** Verify a job without a Happy Code (reason required). Roles: company_owner, ops_manager. */
  public static final String VERIFICATION_OVERRIDE = "verification:override";

  /** Send and verify Happy Codes. Roles: company_owner, ops_manager, field_worker. */
  public static final String VERIFICATION_VERIFY = "verification:verify";

  /** View work orders. Roles: company_owner, ops_manager, customer. */
  public static final String WORKORDERS_READ = "workorders:read";

  /** Manage work orders. Roles: company_owner, ops_manager. */
  public static final String WORKORDERS_WRITE = "workorders:write";

  /** Role names, as used in the JWT {@code app_metadata.role} claim. */
  public static final Set<String> ROLES =
      Set.of("company_owner", "ops_manager", "field_worker", "customer", "portal_owner");

  private static final Map<String, Set<String>> MATRIX =
      Map.ofEntries(
          Map.entry(
              "company_owner",
              Set.of(
                  ASSETS_READ,
                  ASSETS_WRITE,
                  AUDIT_READ,
                  CHAT_MODERATE,
                  CHAT_READ,
                  CHAT_WRITE,
                  COMPLIANCE_ISSUE,
                  COMPLIANCE_READ,
                  CUSTOMERS_ARCHIVE,
                  CUSTOMERS_CREATE,
                  CUSTOMERS_READ,
                  CUSTOMERS_UPDATE,
                  DISPATCH_ASSIGN,
                  DISPATCH_READ,
                  FEATUREFLAGS_READ,
                  INVOICES_READ,
                  INVOICES_WRITE,
                  JOBS_READ,
                  JOBS_TRANSITION,
                  JOBS_WRITE,
                  LOCATION_READ,
                  MAINTENANCE_READ,
                  MAINTENANCE_WRITE,
                  PAYMENTS_COLLECT,
                  PAYMENTS_READ,
                  QUOTES_ACCEPT,
                  QUOTES_READ,
                  QUOTES_WRITE,
                  REPORTING_READ,
                  SITES_READ,
                  SITES_WRITE,
                  TEAMS_READ,
                  TEAMS_WRITE,
                  TENANT_READ,
                  USERS_INVITE,
                  USERS_MANAGE,
                  USERS_READ,
                  VERIFICATION_OVERRIDE,
                  VERIFICATION_VERIFY,
                  WORKORDERS_READ,
                  WORKORDERS_WRITE)),
          Map.entry(
              "ops_manager",
              Set.of(
                  ASSETS_READ,
                  ASSETS_WRITE,
                  CHAT_MODERATE,
                  CHAT_READ,
                  CHAT_WRITE,
                  COMPLIANCE_ISSUE,
                  COMPLIANCE_READ,
                  CUSTOMERS_ARCHIVE,
                  CUSTOMERS_CREATE,
                  CUSTOMERS_READ,
                  CUSTOMERS_UPDATE,
                  DISPATCH_ASSIGN,
                  DISPATCH_READ,
                  FEATUREFLAGS_READ,
                  INVOICES_READ,
                  INVOICES_WRITE,
                  JOBS_READ,
                  JOBS_TRANSITION,
                  JOBS_WRITE,
                  LOCATION_READ,
                  MAINTENANCE_READ,
                  MAINTENANCE_WRITE,
                  PAYMENTS_COLLECT,
                  PAYMENTS_READ,
                  QUOTES_ACCEPT,
                  QUOTES_READ,
                  QUOTES_WRITE,
                  REPORTING_READ,
                  SITES_READ,
                  SITES_WRITE,
                  TEAMS_READ,
                  TEAMS_WRITE,
                  TENANT_READ,
                  USERS_INVITE,
                  USERS_READ,
                  VERIFICATION_OVERRIDE,
                  VERIFICATION_VERIFY,
                  WORKORDERS_READ,
                  WORKORDERS_WRITE)),
          Map.entry(
              "field_worker",
              Set.of(
                  ASSETS_READ,
                  CHAT_READ,
                  CHAT_WRITE,
                  CUSTOMERS_READ,
                  FEATUREFLAGS_READ,
                  FIELDWORK_EXECUTE,
                  JOBS_READ,
                  JOBS_TRANSITION,
                  LOCATION_REPORT,
                  SITES_READ,
                  TEAMS_READ,
                  TENANT_READ,
                  VERIFICATION_VERIFY)),
          Map.entry(
              "customer",
              Set.of(
                  ASSETS_READ,
                  CHAT_READ,
                  CHAT_WRITE,
                  COMPLIANCE_READ,
                  CUSTOMERS_READ,
                  FEATUREFLAGS_READ,
                  INVOICES_READ,
                  JOBS_READ,
                  MAINTENANCE_READ,
                  PAYMENTS_COLLECT,
                  PAYMENTS_READ,
                  PORTAL_ACCESS,
                  PORTAL_REQUEST_JOB,
                  QUOTES_ACCEPT,
                  QUOTES_READ,
                  SITES_READ,
                  TENANT_READ,
                  WORKORDERS_READ)),
          Map.entry(
              "portal_owner",
              Set.of(
                  FEATUREFLAGS_MANAGE,
                  FEATUREFLAGS_READ,
                  PLATFORM_TENANTS_READ)));

  /** Permissions granted to a role; empty for unknown roles (fail closed). */
  public static Set<String> forRole(String role) {
    return role == null ? Set.of() : MATRIX.getOrDefault(role, Set.of());
  }
}
