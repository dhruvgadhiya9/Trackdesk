"use client";

import Link from "next/link";
import { useState } from "react";
import { FileText, MapPin, Plus } from "lucide-react";
import { buttonClass, Card, CardHeader, DataTable, EmptyState, InfoItem, PageHeader, StatusBadge, Tabs } from "@trackdesk/ui";
import { pastJobs, requests, warranties, type Property } from "@/lib/mock";

const tabs = ["Property Information", "Service History", "Warranty History", "Documents"] as const;
const docs = [
  { name: "Service report · JOB-0977.pdf", meta: "02 Aug 2026 · 412 KB" },
  { name: "Warranty certificate · WAR-0302.pdf", meta: "02 Aug 2026 · 188 KB" },
];

export function PropertyDetails({ property: p }: { property: Property }) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Property Information");
  const history = [
    ...requests.filter((r) => r.propertyId === p.id && r.stage !== "Completed").map((r) => ({ id: r.id, date: r.scheduled, service: r.service, status: r.stage === "Technician En Route" ? "En Route" : r.stage })),
    ...pastJobs.filter((j) => j.propertyId === p.id).map((j) => ({ id: j.id, date: j.date, service: j.service, status: j.status })),
  ];
  const warr = warranties.filter((w) => w.propertyId === p.id);

  const historyTable = history.length ? (
    <DataTable caption="Service history" rows={history} rowKey={(h) => h.id} columns={[
      { key: "d", header: "Date", render: (h) => h.date },
      { key: "s", header: "Service", render: (h) => <span className="font-semibold text-ink">{h.service}</span> },
      { key: "st", header: "Status", render: (h) => <StatusBadge status={h.status} /> },
    ]} />
  ) : <EmptyState title="No services yet" message="Request a service for this property to get started." />;

  const docsCard = (
    <Card>
      <CardHeader title="Documents" />
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {docs.map((d) => (
          <li key={d.name} className="flex items-center gap-3 rounded-lg border border-line px-4 py-3">
            <FileText aria-hidden="true" className="size-5 text-primary-600" />
            <span className="flex flex-col"><span className="text-sm font-semibold text-ink">{d.name}</span><span className="text-xs text-muted">{d.meta}</span></span>
          </li>
        ))}
      </ul>
    </Card>
  );

  return (
    <>
      <PageHeader
        crumbs={["Home", "Properties", p.name]}
        title={p.name}
        actions={<Link href={`/requests/new?property=${p.id}`} className={buttonClass("primary")}><Plus aria-hidden="true" className="size-4" />Request Service Here</Link>}
      />
      <Tabs label="Property sections" tabs={tabs} value={tab} onChange={setTab} />
      {tab === "Property Information" && (
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="flex min-w-0 flex-col gap-6">
            <Card>
              <CardHeader title="Property Information" />
              <dl className="m-0 grid gap-5 sm:grid-cols-3">
                <InfoItem label="Property Type">{p.type}</InfoItem>
                <InfoItem label="Category">{p.category}</InfoItem>
                <InfoItem label="Address">{p.address}</InfoItem>
                <InfoItem label="City">{p.city}</InfoItem>
                <InfoItem label="Landmark">{p.landmark ?? "—"}</InfoItem>
                <InfoItem label="Access">{p.access ?? "—"}</InfoItem>
              </dl>
            </Card>
            <div className="flex flex-col gap-3"><h2 className="m-0 text-base font-bold text-ink">Service History</h2>{historyTable}</div>
          </div>
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader title="Location" />
              <div className="flex h-44 flex-col items-center justify-center gap-2 rounded-lg bg-surface-3 text-sm text-muted" role="img" aria-label={`Map of ${p.address}`}>
                <MapPin aria-hidden="true" className="size-7 text-primary-600" />{p.address}
              </div>
            </Card>
            {docsCard}
          </div>
        </div>
      )}
      {tab === "Service History" && historyTable}
      {tab === "Warranty History" && (warr.length ? (
        <DataTable caption="Warranty history" rows={warr} rowKey={(w) => w.id} columns={[
          { key: "id", header: "Warranty", render: (w) => <Link href={`/warranty/${w.id}`} className="font-semibold">{w.id}</Link> },
          { key: "s", header: "Service", render: (w) => w.service },
          { key: "e", header: "Expiry", render: (w) => w.expiry },
          { key: "st", header: "Status", render: (w) => <StatusBadge status={w.status} /> },
        ]} />
      ) : <EmptyState title="No warranties for this property" />)}
      {tab === "Documents" && docsCard}
    </>
  );
}
