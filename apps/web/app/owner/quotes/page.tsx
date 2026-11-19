"use client";

import { CheckCircle2, Clock, Trophy, XCircle } from "lucide-react";
import { ListScreen } from "@/components/ListScreen";
import { PersonCell } from "@/components/PersonCell";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import type { Quote } from "@/lib/mock";

export default function QuotesPage() {
  return (
    <ListScreen<Quote>
      crumbs={["Home", "Operations", "Quotations"]}
      title="Quotation Management"
      subtitle="Audit log keeps created by, updated by, version changes and approval history."
      entity="Quotation"
      kpis={[
        { label: "Pending Approval", value: "17", icon: <Clock className="size-5" />, tone: "warning" },
        { label: "Approved (30d)", value: "64", delta: "+12%", icon: <CheckCircle2 className="size-5" />, tone: "success" },
        { label: "Rejected (30d)", value: "9", delta: "-3", icon: <XCircle className="size-5" />, tone: "danger" },
        { label: "Win Rate", value: "87%", delta: "+4%", icon: <Trophy className="size-5" /> },
      ]}
      load={api.quotes}
      search={{ placeholder: "Search quote number…", text: (q) => `${q.number} ${q.customer}` }}
      filters={[{ label: "Status", get: (q) => q.status }, { label: "Customer", get: (q) => q.customer }]}
      columns={[
        { key: "no", header: "Quote Number", render: (q) => <span className="font-semibold text-primary-700">{q.number}</span> },
        { key: "customer", header: "Customer", render: (q) => <PersonCell name={q.customer} /> },
        { key: "job", header: "Job", render: (q) => q.job },
        { key: "amount", header: "Amount", align: "right", render: (q) => <span className="font-bold text-ink">{q.amount}</span> },
        { key: "version", header: "Version", render: (q) => q.version },
        { key: "status", header: "Approval Status", render: (q) => <StatusBadge status={q.status} /> },
      ]}
    />
  );
}
