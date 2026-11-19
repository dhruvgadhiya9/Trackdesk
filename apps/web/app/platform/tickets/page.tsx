"use client";

import { AlertTriangle, Clock, Inbox, ShieldCheck } from "lucide-react";
import { ListScreen } from "@/components/ListScreen";
import { PersonCell } from "@/components/PersonCell";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import type { Ticket } from "@/lib/platform-mock";

export default function PlatformTicketsPage() {
  return (
    <ListScreen<Ticket>
      crumbs={["Home", "Support", "Tickets"]}
      title="Support Tickets"
      subtitle="Monitor all company support tickets and SLAs."
      entity="Ticket"
      canDelete={false}
      rowHref={(t) => `/platform/tickets/${t.id}`}
      kpis={[
        { label: "Open", value: "42", delta: "+6", deltaTone: "warning", icon: <Inbox className="size-5" />, tone: "info" },
        { label: "Pending", value: "18", delta: "-2", icon: <Clock className="size-5" />, tone: "warning" },
        { label: "Escalated", value: "7", delta: "+1", deltaTone: "danger", icon: <AlertTriangle className="size-5" />, tone: "danger" },
        { label: "SLA Compliance", value: "94.2%", delta: "+1.4%", icon: <ShieldCheck className="size-5" />, tone: "success" },
      ]}
      load={api.platformTickets}
      search={{ placeholder: "Search ticket ID or subject…", text: (t) => `${t.id} ${t.subject}` }}
      filters={[
        { label: "Company", get: (t) => t.company },
        { label: "Priority", get: (t) => t.priority },
        { label: "Status", get: (t) => t.status },
        { label: "Agent", get: (t) => t.agent },
      ]}
      columns={[
        { key: "id", header: "Ticket ID", render: (t) => <span className="font-semibold text-primary-700">{t.id}</span> },
        { key: "c", header: "Company", render: (t) => <PersonCell name={t.company} /> },
        { key: "s", header: "Subject", render: (t) => t.subject },
        { key: "p", header: "Priority", render: (t) => <StatusBadge status={t.priority} /> },
        { key: "st", header: "Status", render: (t) => <StatusBadge status={t.status} /> },
        { key: "a", header: "Assigned To", render: (t) => <PersonCell name={t.agent} /> },
        {
          key: "sla",
          header: "SLA Remaining",
          render: (t) => <span className={t.sla.startsWith("0h") ? "font-bold text-danger-700" : ""}>{t.sla}</span>,
        },
      ]}
    />
  );
}
