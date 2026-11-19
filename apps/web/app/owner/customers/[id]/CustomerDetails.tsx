"use client";

import Link from "next/link";
import { useState } from "react";
import { FilePlus2, Pencil } from "lucide-react";
import { Badge, buttonClass, Card, CardHeader, DataTable, EmptyState, PageHeader, Tabs } from "@trackdesk/ui";
import { PersonCell } from "@/components/PersonCell";
import { StatusBadge } from "@/components/StatusBadge";
import { invoices, jobs, payments, properties, quotes, type Customer } from "@/lib/mock";

const tabs = ["Overview", "Properties", "Service History", "Quotations", "Invoices", "Payments"] as const;

function Info({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</dt>
      <dd className="m-0 text-sm font-semibold text-ink">{children}</dd>
    </div>
  );
}

export function CustomerDetails({ customer: c }: { customer: Customer }) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Overview");
  const props = properties.filter((p) => p.customer === c.name);
  const history = jobs.filter((j) => j.customer === c.name);
  const custQuotes = quotes.filter((q) => q.customer === c.name);
  const custInvoices = invoices.filter((i) => i.customer === c.name);
  const custPayments = payments.filter((p) => p.customer === c.name);

  const propertyTable = props.length ? (
    <DataTable caption="Linked properties" rows={props} rowKey={(p) => p.id} columns={[
      { key: "name", header: "Property", render: (p) => <span className="font-semibold text-ink">{p.name}</span> },
      { key: "type", header: "Type", render: (p) => p.type },
      { key: "addr", header: "Address", render: (p) => p.address },
      { key: "jobs", header: "Active Jobs", render: (p) => p.activeJobs },
    ]} />
  ) : <EmptyState title="No properties" message="Add a property to raise service requests." />;

  const historyTable = history.length ? (
    <DataTable caption="Service history" rows={history} rowKey={(j) => j.id} columns={[
      { key: "no", header: "Job No", render: (j) => <Link href={`/owner/jobs/${j.id}`} className="font-semibold">{j.number}</Link> },
      { key: "svc", header: "Service", render: (j) => j.service },
      { key: "date", header: "Date", render: (j) => j.scheduled },
      { key: "tech", header: "Technician", render: (j) => <PersonCell name={j.technician} /> },
      { key: "status", header: "Status", render: (j) => <StatusBadge status={j.status} /> },
    ]} />
  ) : <EmptyState title="No service history yet" />;

  return (
    <>
      <PageHeader
        crumbs={["Home", "Customers", c.name]}
        title={c.name}
        subtitle={`${c.type} · ${c.code} · Customer portal ${c.portal ? "enabled" : "disabled"}`}
        actions={
          <Link href="/owner/requests/new" className={buttonClass("primary")}>
            <FilePlus2 aria-hidden="true" className="size-4" /> Raise Service Request
          </Link>
        }
      />
      <Tabs label="Customer sections" tabs={tabs} value={tab} onChange={setTab} />
      {tab === "Overview" && (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="flex min-w-0 flex-col gap-6">
            <Card>
              <CardHeader title="Customer Information" actions={<Link href="/owner/customers/new" className={buttonClass("secondary", "sm")}><Pencil aria-hidden="true" className="size-3.5" /> Edit</Link>} />
              <dl className="m-0 grid gap-5 sm:grid-cols-3">
                <Info label="Customer Code">{c.code}</Info>
                <Info label="Customer Type">{c.type}</Info>
                <Info label="Email">{c.email}</Info>
                <Info label="Mobile">{c.mobile}</Info>
                <Info label="Billing Address">{c.address}</Info>
                <Info label="Portal Access">{c.portal ? "Enabled" : "Disabled"}</Info>
                <Info label="Status"><StatusBadge status={c.status} /></Info>
                <Info label="Customer Since">{c.since}</Info>
                <Info label="Lifetime Value">{c.lifetimeValue}</Info>
              </dl>
            </Card>
            <div className="flex flex-col gap-3"><h2 className="m-0 text-base font-bold text-ink">Linked Properties</h2>{propertyTable}</div>
            <div className="flex flex-col gap-3"><h2 className="m-0 text-base font-bold text-ink">Service History</h2>{historyTable}</div>
          </div>
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader title="Recurring Services" actions={<Badge tone="success" dot>Active</Badge>} />
              <dl className="m-0 grid grid-cols-2 gap-4">
                <Info label="Contract">AMC-HVAC-Gold</Info>
                <Info label="Visits">4 / year</Info>
                <Info label="Next Visit">12 Jan 2027</Info>
                <Info label="Valid Till">31 Mar 2027</Info>
              </dl>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-3" role="progressbar" aria-valuenow={2} aria-valuemin={0} aria-valuemax={4} aria-label="Visits completed">
                <div className="h-full w-1/2 rounded-full bg-primary-600" />
              </div>
              <p className="m-0 mt-2 text-xs text-muted">2 of 4 visits completed</p>
            </Card>
            <Card>
              <CardHeader title="Documents" />
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {custQuotes.map((q) => (
                  <li key={q.id} className="flex items-center justify-between gap-2 text-sm"><span className="font-semibold text-ink">{q.number} · {q.amount}</span><StatusBadge status={q.status} /></li>
                ))}
                {custInvoices.map((i) => (
                  <li key={i.id} className="flex items-center justify-between gap-2 text-sm"><span className="font-semibold text-ink">{i.number} · {i.amount}</span><StatusBadge status={i.status} /></li>
                ))}
                {custQuotes.length + custInvoices.length === 0 && <li className="text-sm text-muted">No documents yet.</li>}
              </ul>
            </Card>
          </div>
        </div>
      )}
      {tab === "Properties" && propertyTable}
      {tab === "Service History" && historyTable}
      {tab === "Quotations" && (custQuotes.length ? (
        <DataTable caption="Quotations" rows={custQuotes} rowKey={(q) => q.id} columns={[
          { key: "no", header: "Quote", render: (q) => q.number },
          { key: "job", header: "Job", render: (q) => q.job },
          { key: "amt", header: "Amount", align: "right", render: (q) => q.amount },
          { key: "status", header: "Status", render: (q) => <StatusBadge status={q.status} /> },
        ]} />
      ) : <EmptyState title="No quotations" />)}
      {tab === "Invoices" && (custInvoices.length ? (
        <DataTable caption="Invoices" rows={custInvoices} rowKey={(i) => i.id} columns={[
          { key: "no", header: "Invoice", render: (i) => i.number },
          { key: "job", header: "Job", render: (i) => i.job },
          { key: "amt", header: "Amount", align: "right", render: (i) => i.amount },
          { key: "status", header: "Status", render: (i) => <StatusBadge status={i.status} /> },
        ]} />
      ) : <EmptyState title="No invoices" />)}
      {tab === "Payments" && (custPayments.length ? (
        <DataTable caption="Payments" rows={custPayments} rowKey={(p) => p.id} columns={[
          { key: "no", header: "Payment", render: (p) => p.number },
          { key: "inv", header: "Invoice", render: (p) => p.invoice },
          { key: "amt", header: "Amount", align: "right", render: (p) => p.amount },
          { key: "method", header: "Method", render: (p) => p.method },
          { key: "status", header: "Status", render: (p) => <StatusBadge status={p.status} /> },
        ]} />
      ) : <EmptyState title="No payments" />)}
    </>
  );
}
