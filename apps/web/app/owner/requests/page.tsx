"use client";

import { AlertTriangle, ArrowRightLeft, Clock, Inbox } from "lucide-react";
import { ListScreen } from "@/components/ListScreen";
import { PersonCell } from "@/components/PersonCell";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import type { ServiceRequest } from "@/lib/mock";

export default function RequestsPage() {
  return (
    <ListScreen<ServiceRequest>
      crumbs={["Home", "Operations", "Service Requests"]}
      title="Service Requests"
      subtitle="Every incoming request from portal, QR, link, voice or staff."
      entity="Request"
      createHref="/owner/requests/new"
      createLabel="Create Request"
      kpis={[
        { label: "New Today", value: "14", delta: "+5", icon: <Inbox className="size-5" /> },
        { label: "Emergency", value: "5", delta: "Live", deltaTone: "danger", icon: <AlertTriangle className="size-5" />, tone: "danger" },
        { label: "Awaiting Assignment", value: "9", icon: <Clock className="size-5" />, tone: "warning" },
        { label: "Converted to Jobs", value: "86%", delta: "+3%", icon: <ArrowRightLeft className="size-5" />, tone: "success" },
      ]}
      load={api.requests}
      search={{ placeholder: "Search request number…", text: (r) => `${r.number} ${r.customer}` }}
      filters={[
        { label: "Customer", get: (r) => r.customer },
        { label: "Priority", get: (r) => r.priority },
        { label: "Status", get: (r) => r.status },
      ]}
      columns={[
        { key: "no", header: "Request No", render: (r) => <span className="font-semibold text-primary-700">{r.number}</span> },
        { key: "customer", header: "Customer", render: (r) => <PersonCell name={r.customer} /> },
        { key: "property", header: "Property", render: (r) => r.property },
        { key: "service", header: "Service", render: (r) => r.service },
        { key: "priority", header: "Priority", render: (r) => <StatusBadge status={r.priority} /> },
        { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
        { key: "created", header: "Created", render: (r) => r.created },
      ]}
    />
  );
}
