"use client";

import { AlertTriangle, CircleDollarSign, ReceiptText, Wallet } from "lucide-react";
import { ListScreen } from "@/components/ListScreen";
import { PersonCell } from "@/components/PersonCell";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import type { Invoice } from "@/lib/mock";

export default function InvoicesPage() {
  return (
    <ListScreen<Invoice>
      crumbs={["Home", "Finance", "Invoices"]}
      title="Billing & Invoices"
      subtitle="Invoice flow: apply offer → apply tax → generate invoice."
      entity="Invoice"
      kpis={[
        { label: "Invoiced (Nov)", value: "$142.6k", delta: "+11%", icon: <ReceiptText className="size-5" /> },
        { label: "Collected", value: "$124.0k", delta: "+9%", icon: <CircleDollarSign className="size-5" />, tone: "success" },
        { label: "Outstanding", value: "$18.6k", delta: "9 invoices", deltaTone: "warning", icon: <Wallet className="size-5" />, tone: "warning" },
        { label: "Overdue", value: "$3,240", delta: "3 invoices", deltaTone: "danger", icon: <AlertTriangle className="size-5" />, tone: "danger" },
      ]}
      load={api.invoices}
      search={{ placeholder: "Search invoice number…", text: (i) => `${i.number} ${i.customer}` }}
      filters={[{ label: "Payment Status", get: (i) => i.status }, { label: "Customer", get: (i) => i.customer }]}
      columns={[
        { key: "no", header: "Invoice Number", render: (i) => <span className="font-semibold text-primary-700">{i.number}</span> },
        { key: "customer", header: "Customer", render: (i) => <PersonCell name={i.customer} /> },
        { key: "job", header: "Job", render: (i) => i.job },
        { key: "sub", header: "Subtotal", align: "right", render: (i) => i.subtotal },
        { key: "tax", header: "Tax", align: "right", render: (i) => i.tax },
        { key: "amount", header: "Amount", align: "right", render: (i) => <span className="font-bold text-ink">{i.amount}</span> },
        { key: "status", header: "Payment Status", render: (i) => <StatusBadge status={i.status} /> },
      ]}
    />
  );
}
