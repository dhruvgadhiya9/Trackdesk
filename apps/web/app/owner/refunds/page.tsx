"use client";

import { Card } from "@trackdesk/ui";
import { ListScreen } from "@/components/ListScreen";
import { PersonCell } from "@/components/PersonCell";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import type { Refund } from "@/lib/mock";

const steps = ["Refund Request", "Manager Review", "Finance Processing", "Refund Completed"];

export default function RefundsPage() {
  return (
    <>
      <ListScreen<Refund>
        crumbs={["Home", "Finance", "Refunds"]}
        title="Refund Management"
        subtitle="Approve or reject refund requests."
        entity="Refund"
        canDelete={false}
        load={api.refunds}
        search={{ placeholder: "Search refund or invoice…", text: (r) => `${r.number} ${r.invoice} ${r.customer}` }}
        filters={[{ label: "Status", get: (r) => r.status }]}
        columns={[
          { key: "no", header: "Refund ID", render: (r) => <span className="font-semibold text-primary-700">{r.number}</span> },
          { key: "invoice", header: "Invoice", render: (r) => r.invoice },
          { key: "customer", header: "Customer", render: (r) => <PersonCell name={r.customer} /> },
          { key: "amount", header: "Amount", align: "right", render: (r) => <span className="font-bold text-ink">{r.amount}</span> },
          { key: "reason", header: "Reason", render: (r) => r.reason },
          { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
      />
      <Card>
        <h2 className="m-0 mb-4 text-base font-bold text-ink">Refund workflow</h2>
        <ol className="m-0 flex list-none flex-wrap items-center gap-3 p-0">
          {steps.map((s, i) => (
            <li key={s} className="flex items-center gap-3">
              <span className="inline-flex size-7 items-center justify-center rounded-full bg-primary-50 text-sm font-bold text-primary-700">{i + 1}</span>
              <span className="text-sm font-semibold text-ink-2">{s}</span>
              {i < steps.length - 1 && <span aria-hidden="true" className="h-px w-8 bg-line-strong" />}
            </li>
          ))}
        </ol>
      </Card>
    </>
  );
}
