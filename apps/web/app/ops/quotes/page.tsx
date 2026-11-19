"use client";

import { ListScreen } from "@/components/ListScreen";
import { PersonCell } from "@/components/PersonCell";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import type { OpsQuote } from "@/lib/ops-mock";

export default function OpsQuotesPage() {
  return (
    <ListScreen<OpsQuote>
      crumbs={["Home", "Jobs", "Quotations"]}
      title="Quotations"
      subtitle="Quotations created from technician checklists."
      entity="Quotation"
      createHref="/ops/quotes/new"
      createLabel="Create Quote"
      editHref={() => "/ops/quotes/new"}
      canDelete={false}
      load={api.opsQuotes}
      search={{ placeholder: "Quote number…", text: (q) => `${q.number} ${q.customer}` }}
      filters={[
        { label: "Status", get: (q) => q.status },
        { label: "Customer", get: (q) => q.customer },
        { label: "Technician", get: (q) => q.technician },
      ]}
      columns={[
        { key: "no", header: "Quote No", render: (q) => <span className="font-semibold text-primary-700">{q.number}</span> },
        { key: "customer", header: "Customer", render: (q) => <PersonCell name={q.customer} /> },
        { key: "job", header: "Job No", render: (q) => q.job },
        { key: "amount", header: "Amount", align: "right", render: (q) => <span className="font-bold text-ink">{q.amount}</span> },
        { key: "version", header: "Version", render: (q) => q.version },
        { key: "status", header: "Status", render: (q) => <StatusBadge status={q.status} /> },
        { key: "created", header: "Created", render: (q) => q.created },
      ]}
    />
  );
}
