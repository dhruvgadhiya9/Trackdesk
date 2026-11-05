package com.trackdesk.jobs.domain;

/**
 * Job lifecycle states (docs/prd/06-jobs.md). Sprint 2 adds the explicit transition table and unit
 * tests for every allowed and forbidden transition.
 */
public enum JobStatus {
  DRAFT,
  SCHEDULED,
  DISPATCHED,
  EN_ROUTE,
  ON_SITE,
  COMPLETED,
  VERIFIED,
  INVOICED,
  CANCELLED,
  OVERDUE
}
