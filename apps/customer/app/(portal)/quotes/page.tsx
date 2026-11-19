"use client";

import Link from "next/link";
import { useState } from "react";
import { DataTable, EmptyState, ErrorState, PageHeader, StatusBadge, TableSkeleton, Tabs, useQuery } from "@trackdesk/ui";
import { api } from "@/lib/api";
import { money } from "@/lib/mock";

const tabs = ["All", "Pending", "Approved", "Rejected", "Expired"] as const;

export default function QuotesPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const { state, retry } = useQuery(api.quotes);
  const rows = state.status === "success" ? state.data.filter((q) => tab === "All" || q.status === tab) : [];
  return (
    <>
      <PageHeader crumbs={["Home", "Quotes"]} title="Quotations" subtitle="Review and approve quotations from your service provider." />
      <Tabs label="Quote status" tabs={tabs} value={tab} onChange={setTab} />
      {state.status === "loading" && <TableSkeleton rows={4} />}
      {state.status === "error" && <ErrorState message={state.error} onRetry={retry} />}
      {state.status === "success" && rows.length === 0 && <EmptyState title={`No ${tab === "All" ? "" : tab.toLowerCase() + " "}quotations`} />}
      {state.status === "success" && rows.length > 0 && (
        <DataTable
          caption="Quotations"
          rows={rows}
          rowKey={(q) => q.id}
          columns={[
            { key: "id", header: "Quote Number", render: (q) => <span className="font-semibold text-primary-700">{q.id}</span> },
            { key: "s", header: "Service", render: (q) => q.service },
            { key: "a", header: "Amount", align: "right", render: (q) => <span className="font-bold text-ink">{money(q.amount)}</span> },
            { key: "st", header: "Status", render: (q) => <StatusBadge status={q.status} /> },
            { key: "d", header: "Date", render: (q) => q.date },
            {
              key: "act",
              header: "Actions",
              align: "right",
              render: (q) =>
                q.lines ? (
                  <Link href={`/quotes/${q.id}`} className="text-sm font-bold">
                    {q.status === "Pending" ? "Review" : "View"}
                  </Link>
                ) : (
                  <span className="text-subtle">—</span>
                ),
            },
          ]}
        />
      )}
    </>
  );
}
