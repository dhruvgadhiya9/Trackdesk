"use client";

import Link from "next/link";
import { BadgePercent, CheckCircle2, CreditCard, Wallet } from "lucide-react";
import { buttonClass, DataTable, ErrorState, KpiGrid, PageHeader, StatusBadge, TableSkeleton, useQuery } from "@trackdesk/ui";
import { api } from "@/lib/api";
import { money } from "@/lib/mock";
import { BillingTabs } from "./BillingTabs";

export default function InvoicesPage() {
  const { state, retry } = useQuery(api.invoices);
  const unpaid = state.status === "success" ? state.data.filter((i) => i.status === "Unpaid") : [];
  const outstanding = unpaid.reduce((a, i) => a + i.amount, 0);
  return (
    <>
      <PageHeader
        crumbs={["Home", "Billing", "Invoices"]}
        title="Invoices"
        actions={
          unpaid[0] && (
            <Link href={`/billing/pay/${unpaid[0].id}`} className={buttonClass("primary")}>
              <CreditCard aria-hidden="true" className="size-4" />
              Pay Outstanding
            </Link>
          )
        }
      />
      <BillingTabs />
      <KpiGrid
        items={[
          { label: "Outstanding", value: money(outstanding), delta: `${unpaid.length} invoice${unpaid.length === 1 ? "" : "s"}`, deltaTone: "warning", icon: <Wallet className="size-5" />, tone: "warning" },
          { label: "Paid This Year", value: "$1,145.01", icon: <CheckCircle2 className="size-5" />, tone: "success" },
          { label: "Saved with Offers", value: "$85.00", icon: <BadgePercent className="size-5" />, tone: "violet" },
        ]}
      />
      {state.status === "loading" && <TableSkeleton rows={4} />}
      {state.status === "error" && <ErrorState message={state.error} onRetry={retry} />}
      {state.status === "success" && (
        <DataTable
          caption="Invoices"
          rows={state.data}
          rowKey={(i) => i.id}
          columns={[
            { key: "id", header: "Invoice Number", render: (i) => <span className="font-semibold text-primary-700">{i.id}</span> },
            { key: "s", header: "Service", render: (i) => i.service },
            { key: "a", header: "Amount", align: "right", render: (i) => <span className="font-bold text-ink">{money(i.amount)}</span> },
            { key: "st", header: "Status", render: (i) => <StatusBadge status={i.status} /> },
            { key: "d", header: "Invoice Date", render: (i) => i.date },
            {
              key: "act",
              header: "Actions",
              align: "right",
              render: (i) =>
                i.status === "Unpaid" ? (
                  <Link href={`/billing/pay/${i.id}`} className={buttonClass("primary", "sm")}>Pay</Link>
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
