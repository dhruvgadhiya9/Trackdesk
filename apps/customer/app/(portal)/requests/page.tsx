"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus } from "lucide-react";
import { buttonClass, DataTable, EmptyState, ErrorState, PageHeader, PersonCell, StatusBadge, TableSkeleton, Tabs, useQuery } from "@trackdesk/ui";
import { api } from "@/lib/api";
import { invoices, money, propertyById, quotes } from "@/lib/mock";

const tabs = ["Active Requests", "Previous Jobs", "Previous Quotations", "Previous Invoices"] as const;

export default function RequestsPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Active Requests");
  const reqs = useQuery(api.requests);
  const jobs = useQuery(api.pastJobs);
  const active = reqs.state.status === "success" ? reqs.state.data.filter((r) => r.stage !== "Completed") : [];

  return (
    <>
      <PageHeader
        crumbs={["Home", "Requests"]}
        title="Requests & Service History"
        subtitle="Track open requests and look back at previous work."
        actions={
          <Link href="/requests/new" className={buttonClass("primary")}>
            <Plus aria-hidden="true" className="size-4" />
            Request Service
          </Link>
        }
      />
      <Tabs label="Request views" tabs={tabs} value={tab} onChange={setTab} />

      {tab === "Active Requests" &&
        (reqs.state.status === "loading" ? (
          <TableSkeleton rows={3} />
        ) : reqs.state.status === "error" ? (
          <ErrorState message={reqs.state.error} onRetry={reqs.retry} />
        ) : active.length === 0 ? (
          <EmptyState
            title="No open requests"
            message="Need something fixed? Request a service any time."
            action={<Link href="/requests/new" className={buttonClass("primary")}>Request Service</Link>}
          />
        ) : (
          <DataTable
            caption="Active requests"
            rows={active}
            rowKey={(r) => r.id}
            columns={[
              { key: "id", header: "Request", render: (r) => <Link href={`/requests/${r.id}`} className="font-semibold">{r.id}</Link> },
              { key: "s", header: "Service", render: (r) => r.service },
              { key: "p", header: "Property", render: (r) => propertyById(r.propertyId)?.name },
              { key: "pr", header: "Priority", render: (r) => <StatusBadge status={r.priority} /> },
              { key: "st", header: "Status", render: (r) => <StatusBadge status={r.stage === "Technician En Route" ? "En Route" : r.stage} /> },
              { key: "u", header: "Updated", render: (r) => r.updated },
            ]}
          />
        ))}

      {tab === "Previous Jobs" &&
        (jobs.state.status === "loading" ? (
          <TableSkeleton rows={4} />
        ) : jobs.state.status === "error" ? (
          <ErrorState message={jobs.state.error} onRetry={jobs.retry} />
        ) : (
          <DataTable
            caption="Previous jobs"
            rows={jobs.state.data}
            rowKey={(j) => j.id}
            columns={[
              { key: "id", header: "Job Number", render: (j) => <span className="font-semibold text-primary-700">{j.id}</span> },
              { key: "s", header: "Service", render: (j) => j.service },
              { key: "p", header: "Property", render: (j) => propertyById(j.propertyId)?.name },
              { key: "d", header: "Date", render: (j) => j.date },
              { key: "t", header: "Technician", render: (j) => <PersonCell name={j.technician} /> },
              { key: "st", header: "Status", render: (j) => <StatusBadge status={j.status} /> },
              {
                key: "fb",
                header: "Feedback",
                render: (j) =>
                  j.id === "JOB-1042" ? (
                    <Link href="/requests/REQ-3290/feedback" className="text-sm font-bold">Rate service</Link>
                  ) : (
                    <span className="text-subtle">—</span>
                  ),
              },
            ]}
          />
        ))}

      {tab === "Previous Quotations" && (
        <DataTable
          caption="Previous quotations"
          rows={quotes}
          rowKey={(q) => q.id}
          columns={[
            { key: "id", header: "Quote", render: (q) => <Link href={`/quotes/${q.id}`} className="font-semibold">{q.id}</Link> },
            { key: "s", header: "Service", render: (q) => q.service },
            { key: "a", header: "Amount", align: "right", render: (q) => money(q.amount) },
            { key: "st", header: "Status", render: (q) => <StatusBadge status={q.status} /> },
          ]}
        />
      )}

      {tab === "Previous Invoices" && (
        <DataTable
          caption="Previous invoices"
          rows={invoices}
          rowKey={(i) => i.id}
          columns={[
            { key: "id", header: "Invoice", render: (i) => <span className="font-semibold text-primary-700">{i.id}</span> },
            { key: "s", header: "Service", render: (i) => i.service },
            { key: "a", header: "Amount", align: "right", render: (i) => money(i.amount) },
            { key: "st", header: "Status", render: (i) => <StatusBadge status={i.status} /> },
          ]}
        />
      )}
    </>
  );
}
