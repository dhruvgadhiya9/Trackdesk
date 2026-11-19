import { Badge, type Tone } from "@trackdesk/ui";

const toneByStatus: Record<string, Tone> = {
  Active: "success", Paid: "success", Approved: "success", Completed: "success", Delivered: "success",
  Converted: "success", Refunded: "success", Resolved: "success", Available: "success",
  Inactive: "neutral", Disabled: "neutral", Draft: "neutral", Closed: "neutral", Expired: "neutral",
  Pending: "warning", Partial: "warning", Expiring: "warning", "On Hold": "warning", Reviewed: "warning",
  "Manager Reviewed": "warning", Medium: "warning", Busy: "warning", Unpaid: "warning",
  Overdue: "danger", Failed: "danger", Rejected: "danger", Emergency: "danger", Escalated: "danger", High: "danger",
  New: "info", Open: "info", Regular: "info", Low: "neutral", Leave: "neutral",
  Assigned: "primary", "In Progress": "violet",
  Shared: "success", Verified: "success", "Override Approved": "warning", Generated: "info", "Not Generated": "neutral",
  "Pending Verification": "warning", Present: "success", Late: "warning", Review: "danger", "On Leave": "neutral",
  Published: "success", Trial: "info", "Renewal Due": "warning", Suspended: "danger", Moderate: "warning", Overloaded: "danger", "In Service": "warning", "On Job": "violet",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge tone={toneByStatus[status] ?? "neutral"} dot>
      {status}
    </Badge>
  );
}
