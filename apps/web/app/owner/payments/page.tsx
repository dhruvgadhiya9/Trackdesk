"use client";

import { CircleDollarSign, CreditCard, PiggyBank, XCircle, Download } from "lucide-react";
import { Button } from "@trackdesk/ui";
import { ListScreen } from "@/components/ListScreen";
import { PersonCell } from "@/components/PersonCell";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import type { Payment } from "@/lib/mock";

export default function PaymentsPage() {
  return (
    <ListScreen<Payment>
      crumbs={["Home", "Finance", "Payments"]}
      title="Payment Management"
      subtitle="Payments collected online and receipts generated automatically."
      entity="Payment"
      canDelete={false}
      headerActions={<Button variant="secondary" icon={<Download aria-hidden="true" className="size-4" />}>Export</Button>}
      kpis={[
        { label: "Received Today", value: "$7,420", delta: "+12%", icon: <CircleDollarSign className="size-5" />, tone: "success" },
        { label: "Online (Stripe)", value: "82%", delta: "+6%", icon: <CreditCard className="size-5" /> },
        { label: "Advance Payments", value: "$21.3k", icon: <PiggyBank className="size-5" />, tone: "violet" },
        { label: "Failed", value: "2", icon: <XCircle className="size-5" />, tone: "danger" },
      ]}
      load={api.payments}
      search={{ placeholder: "Search payment or invoice…", text: (p) => `${p.number} ${p.invoice} ${p.customer}` }}
      filters={[{ label: "Method", get: (p) => p.method.split(" · ")[0]! }, { label: "Status", get: (p) => p.status }]}
      columns={[
        { key: "no", header: "Payment Number", render: (p) => <span className="font-semibold text-primary-700">{p.number}</span> },
        { key: "customer", header: "Customer", render: (p) => <PersonCell name={p.customer} /> },
        { key: "invoice", header: "Invoice", render: (p) => p.invoice },
        { key: "amount", header: "Amount", align: "right", render: (p) => <span className="font-bold text-ink">{p.amount}</span> },
        { key: "method", header: "Payment Method", render: (p) => p.method },
        { key: "terms", header: "Terms", render: (p) => p.terms },
        { key: "date", header: "Date", render: (p) => p.date },
        { key: "status", header: "Status", render: (p) => <StatusBadge status={p.status} /> },
      ]}
    />
  );
}
