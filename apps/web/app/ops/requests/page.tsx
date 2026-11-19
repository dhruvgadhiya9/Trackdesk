"use client";

import { ListScreen } from "@/components/ListScreen";
import { PersonCell } from "@/components/PersonCell";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import type { OpsRequest } from "@/lib/ops-mock";

export default function OpsRequestsPage() {
  return (
    <ListScreen<OpsRequest>
      crumbs={["Home", "Requests", "Service Requests"]}
      title="Service Requests"
      subtitle="Manage all incoming customer service requests."
      entity="Request"
      createHref="/ops/requests/new"
      createLabel="Create Request"
      canDelete={false}
      rowHref={(r) => `/ops/requests/${r.id}`}
      load={api.opsRequests}
      search={{ placeholder: "Request number…", text: (r) => `${r.number} ${r.customer}` }}
      filters={[
        { label: "Customer", get: (r) => r.customer },
        { label: "Priority", get: (r) => r.priority },
        { label: "Status", get: (r) => r.status },
      ]}
      columns={[
        { key: "no", header: "Request No", render: (r) => <span className="font-semibold text-primary-700">{r.number}</span> },
        { key: "customer", header: "Customer", render: (r) => <PersonCell name={r.customer} /> },
        { key: "property", header: "Property", render: (r) => r.property },
        {
          key: "service",
          header: "Service Type",
          render: (r) => (r.classified ? r.service : <span className="font-semibold text-warning-700">Unclassified — {r.service}</span>),
        },
        { key: "priority", header: "Priority", render: (r) => <StatusBadge status={r.priority} /> },
        { key: "branch", header: "Branch", render: (r) => r.branch },
        { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
        { key: "created", header: "Created", render: (r) => r.created },
      ]}
    />
  );
}
