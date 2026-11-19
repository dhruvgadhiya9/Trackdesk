"use client";

import { DataTable, EmptyState, ErrorState, PageHeader, StatusBadge, TableSkeleton, useQuery } from "@trackdesk/ui";
import { api } from "@/lib/api";
import { money } from "@/lib/mock";
import { BillingTabs } from "../BillingTabs";

export default function PaymentHistoryPage() {
  const { state, retry } = useQuery(api.payments);
  return (
    <>
      <PageHeader crumbs={["Home", "Billing", "Payment History"]} title="Payment History" />
      <BillingTabs />
      {state.status === "loading" && <TableSkeleton rows={4} />}
      {state.status === "error" && <ErrorState message={state.error} onRetry={retry} />}
      {state.status === "success" && state.data.length === 0 && <EmptyState title="No payments yet" />}
      {state.status === "success" && state.data.length > 0 && (
        <DataTable
          caption="Payment history"
          rows={state.data}
          rowKey={(p) => p.id}
          columns={[
            { key: "id", header: "Payment ID", render: (p) => <span className="font-semibold text-primary-700">{p.id}</span> },
            { key: "i", header: "Invoice Number", render: (p) => p.invoice },
            { key: "a", header: "Amount", align: "right", render: (p) => <span className="font-bold text-ink">{money(p.amount)}</span> },
            { key: "d", header: "Payment Date", render: (p) => p.date },
            { key: "s", header: "Status", render: (p) => <StatusBadge status={p.status} /> },
          ]}
        />
      )}
    </>
  );
}
