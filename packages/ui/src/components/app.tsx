import type { ReactNode } from "react";
import { Avatar, Badge, type Tone } from "./primitives";

/* ---------------------------------------------------------------- StatusBadge */

const toneByStatus: Record<string, Tone> = {
  Active: "success", Paid: "success", Approved: "success", Completed: "success", Delivered: "success",
  Converted: "success", Refunded: "success", Resolved: "success", Available: "success", Shared: "success",
  Verified: "success", Present: "success", Published: "success",
  Inactive: "neutral", Disabled: "neutral", Draft: "neutral", Closed: "neutral", Expired: "neutral",
  "Not Generated": "neutral", "On Leave": "neutral", Low: "neutral", Leave: "neutral",
  Pending: "warning", Partial: "warning", Expiring: "warning", "On Hold": "warning", Reviewed: "warning",
  "Manager Reviewed": "warning", Medium: "warning", Busy: "warning", Unpaid: "warning", "Override Approved": "warning",
  "Pending Verification": "warning", Late: "warning", Moderate: "warning", "In Service": "warning", "Renewal Due": "warning",
  Overdue: "danger", Failed: "danger", Rejected: "danger", Emergency: "danger", Escalated: "danger", High: "danger",
  Review: "danger", Overloaded: "danger", Suspended: "danger",
  New: "info", Open: "info", Regular: "info", Generated: "info", Trial: "info",
  Assigned: "primary", "In Progress": "violet", "On Job": "violet", "En Route": "primary",
};

/** Status pill with a colour mapped from the status label. Unknown labels render neutral. */
export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge tone={toneByStatus[status] ?? "neutral"} dot>
      {status}
    </Badge>
  );
}

/* ---------------------------------------------------------------- PersonCell */

export function PersonCell({ name, sub }: { name: string | null; sub?: string }) {
  if (!name) return <span className="text-subtle">—</span>;
  return (
    <span className="flex items-center gap-2.5">
      <Avatar name={name} size="sm" />
      <span className="flex flex-col">
        <span className="font-semibold text-ink">{name}</span>
        {sub && <span className="text-xs text-muted">{sub}</span>}
      </span>
    </span>
  );
}

/* ---------------------------------------------------------------- InfoItem */

/** Label/value pair for detail cards. Use inside a <dl>. */
export function InfoItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</dt>
      <dd className="m-0 text-sm font-semibold text-ink">{children}</dd>
    </div>
  );
}
