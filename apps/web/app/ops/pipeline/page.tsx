"use client";

import { ListScreen } from "@/components/ListScreen";
import { PersonCell } from "@/components/PersonCell";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import type { OpsJob } from "@/lib/ops-mock";

export default function OpsPipelinePage() {
  return (
    <ListScreen<OpsJob>
      crumbs={["Home", "Jobs", "Job Pipeline"]}
      title="Job Pipeline Board"
      subtitle="Listing view of all active jobs."
      entity="Job"
      canDelete={false}
      rowHref={(j) => `/ops/jobs/${j.id}`}
      load={api.opsJobs}
      search={{ placeholder: "Job number…", text: (j) => `${j.number} ${j.customer}` }}
      filters={[
        { label: "Customer", get: (j) => j.customer },
        { label: "Technician", get: (j) => j.technician },
        { label: "Status", get: (j) => j.status },
        { label: "Priority", get: (j) => j.priority },
      ]}
      columns={[
        { key: "no", header: "Job Number", render: (j) => <span className="font-semibold text-primary-700">{j.number}</span> },
        { key: "customer", header: "Customer", render: (j) => j.customer },
        { key: "property", header: "Property", render: (j) => j.property },
        { key: "service", header: "Service", render: (j) => j.service },
        { key: "priority", header: "Priority", render: (j) => <StatusBadge status={j.priority} /> },
        { key: "tech", header: "Technician", render: (j) => <PersonCell name={j.technician} /> },
        { key: "sched", header: "Scheduled", render: (j) => j.scheduled },
        { key: "status", header: "Current Status", render: (j) => <StatusBadge status={j.status} /> },
        { key: "hc", header: "Happy Code Status", render: (j) => <StatusBadge status={j.happyCode} /> },
      ]}
    />
  );
}
