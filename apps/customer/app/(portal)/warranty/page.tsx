"use client";

import Link from "next/link";
import { DataTable, EmptyState, ErrorState, PageHeader, StatusBadge, TableSkeleton, useQuery } from "@trackdesk/ui";
import { api } from "@/lib/api";
import { propertyById } from "@/lib/mock";

export default function WarrantyPage() {
  const { state, retry } = useQuery(api.warranties);
  return (
    <>
      <PageHeader crumbs={["Home", "Warranty"]} title="Warranties" subtitle="Warranties issued for your completed services." />
      {state.status === "loading" && <TableSkeleton rows={3} />}
      {state.status === "error" && <ErrorState message={state.error} onRetry={retry} />}
      {state.status === "success" && state.data.length === 0 && <EmptyState title="No warranties yet" message="Warranties appear here after a completed service." />}
      {state.status === "success" && state.data.length > 0 && (
        <DataTable
          caption="Warranties"
          rows={state.data}
          rowKey={(w) => w.id}
          columns={[
            { key: "id", header: "Warranty Number", render: (w) => <span className="font-semibold text-primary-700">{w.id}</span> },
            { key: "s", header: "Service", render: (w) => w.service },
            { key: "p", header: "Property", render: (w) => propertyById(w.propertyId)?.name },
            { key: "sd", header: "Start Date", render: (w) => w.start },
            { key: "ed", header: "Expiry Date", render: (w) => w.expiry },
            { key: "st", header: "Status", render: (w) => <StatusBadge status={w.status} /> },
            { key: "a", header: "Actions", align: "right", render: (w) => <Link href={`/warranty/${w.id}`} className="text-sm font-bold">View certificate</Link> },
          ]}
        />
      )}
    </>
  );
}
