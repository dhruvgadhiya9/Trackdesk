"use client";

import { Download } from "lucide-react";
import { Button } from "@trackdesk/ui";
import { ListScreen } from "@/components/ListScreen";
import { PersonCell } from "@/components/PersonCell";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import type { Job } from "@/lib/mock";

export default function PipelinePage() {
  return (
    <ListScreen<Job>
      crumbs={["Home", "Operations", "Job Pipeline"]}
      title="Job Pipeline Board"
      subtitle="Main operations screen — click a row to open job details."
      entity="Job"
      canDelete={false}
      headerActions={<Button variant="secondary" icon={<Download aria-hidden="true" className="size-4" />}>Export</Button>}
      tabs={{ label: "Status", get: (j) => j.status, values: ["All Jobs", "Open", "Assigned", "In Progress", "On Hold", "Completed"] }}
      load={api.jobs}
      rowHref={(j) => `/owner/jobs/${j.id}`}
      search={{ placeholder: "Search job number…", text: (j) => `${j.number} ${j.customer}` }}
      filters={[
        { label: "Technician", get: (j) => j.technician ?? "Unassigned" },
        { label: "Priority", get: (j) => j.priority },
      ]}
      columns={[
        { key: "no", header: "Job Number", render: (j) => <span className="font-semibold text-primary-700">{j.number}</span> },
        { key: "customer", header: "Customer", render: (j) => j.customer },
        { key: "property", header: "Property", render: (j) => j.property },
        { key: "service", header: "Service", render: (j) => j.service },
        { key: "tech", header: "Technician", render: (j) => <PersonCell name={j.technician} /> },
        { key: "priority", header: "Priority", render: (j) => <StatusBadge status={j.priority} /> },
        { key: "status", header: "Status", render: (j) => <StatusBadge status={j.status} /> },
        { key: "sched", header: "Scheduled", render: (j) => j.scheduled },
      ]}
    />
  );
}
