"use client";

import { Card } from "@trackdesk/ui";
import { ListScreen } from "@/components/ListScreen";
import { PersonCell } from "@/components/PersonCell";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import type { WorkOrder } from "@/lib/ops-mock";

const flow = ["Open", "Assigned", "In Progress", "Completion Pending Verification", "Completed", "Closed"];

export default function WorkOrdersPage() {
  return (
    <>
      <Card>
        <h2 className="m-0 mb-4 text-base font-bold text-ink">Status Flow</h2>
        <ol className="m-0 flex list-none flex-wrap items-center gap-3 p-0">
          {flow.map((s, i) => (
            <li key={s} className="flex items-center gap-3">
              <span className="rounded-full bg-primary-50 px-3 py-1.5 text-sm font-semibold text-primary-700">{s}</span>
              {i < flow.length - 1 && <span aria-hidden="true" className="text-subtle">→</span>}
            </li>
          ))}
        </ol>
      </Card>
      <ListScreen<WorkOrder>
        crumbs={["Home", "Jobs", "Work Orders"]}
        title="Work Order Management"
        subtitle="Monitor the work order lifecycle."
        entity="Work Order"
        canDelete={false}
        load={api.workOrders}
        search={{ placeholder: "Work order…", text: (w) => `${w.number} ${w.customer}` }}
        filters={[{ label: "Technician", get: (w) => w.technician }, { label: "Status", get: (w) => w.status }]}
        columns={[
          { key: "no", header: "Work Order", render: (w) => <span className="font-semibold text-primary-700">{w.number}</span> },
          { key: "customer", header: "Customer", render: (w) => w.customer },
          { key: "service", header: "Service", render: (w) => w.service },
          { key: "tech", header: "Technician", render: (w) => <PersonCell name={w.technician} /> },
          { key: "status", header: "Status", render: (w) => <StatusBadge status={w.status} /> },
          { key: "updated", header: "Updated", render: (w) => w.updated },
        ]}
      />
    </>
  );
}
