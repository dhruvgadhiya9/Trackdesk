"use client";

import { useState } from "react";
import clsx from "clsx";
import { Download } from "lucide-react";
import { Button, Card, CardHeader, DataTable, PageHeader, Tabs } from "@trackdesk/ui";

const sections = ["Company Growth", "Revenue", "Subscriptions", "Tickets"] as const;
const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N"];
const newCompanies = [9, 11, 12, 11, 13, 12, 11, 13, 15, 19, 17];
const industries = [
  { name: "HVAC & Plumbing", value: 112, color: "bg-primary-600" },
  { name: "Electrical & Solar", value: 78, color: "bg-violet-600" },
  { name: "Cleaning & Facilities", value: 58, color: "bg-info-500" },
];
const monthly = [
  { id: "nov", month: "November", added: 17, churned: 2, industry: "HVAC & Plumbing", country: "United States" },
  { id: "oct", month: "October", added: 19, churned: 3, industry: "Electrical & Solar", country: "Canada" },
  { id: "sep", month: "September", added: 15, churned: 1, industry: "HVAC & Plumbing", country: "United States" },
];
const summaries = [
  { title: "Revenue Report", stats: [["Revenue", "$942k"], ["Renewals", "$318k"], ["Refunds", "$6.4k"]] },
  { title: "Subscription Report", stats: [["Active Plans", "231"], ["Expiring", "14"], ["Cancelled", "11"]] },
  { title: "Ticket Report", stats: [["Resolution", "5h 12m"], ["SLA", "94.2%"], ["Escalations", "23"]] },
];

function exportCsv() {
  const csv = ["Month,New Companies,Churned,Net Growth,Top Industry,Top Country", ...monthly.map((m) => [m.month, m.added, m.churned, m.added - m.churned, `"${m.industry}"`, m.country].join(","))].join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = "trackdesk-platform-growth.csv";
  a.click();
  URL.revokeObjectURL(a.href);
}

export default function PlatformReportsPage() {
  const [section, setSection] = useState<(typeof sections)[number]>("Company Growth");
  const max = Math.max(...newCompanies);
  const totalInd = industries.reduce((a, i) => a + i.value, 0);
  return (
    <>
      <PageHeader
        crumbs={["Home", "Platform", "Reports"]}
        title="Reports"
        subtitle="Company growth, revenue, subscription and ticket analytics · Jan – Nov 2026"
        actions={
          <Button variant="secondary" icon={<Download aria-hidden="true" className="size-4" />} onClick={exportCsv}>
            Export CSV
          </Button>
        }
      />
      <Tabs label="Report type" tabs={sections} value={section} onChange={setSection} />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader title="New Companies per Month" />
          <div className="flex h-56 items-end gap-2" role="img" aria-label={`New companies per month, from ${newCompanies[0]} in January to ${newCompanies.at(-1)} in November`}>
            {newCompanies.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="text-xs font-semibold text-muted">{v}</span>
                <div className="w-full rounded-t-md bg-primary-600" style={{ height: `${(v / max) * 170}px` }} />
                <span className="text-xs text-muted">{months[i]}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title="By Industry" subtitle={`${totalInd} companies`} />
          <div className="flex h-3 overflow-hidden rounded-full" aria-hidden="true">
            {industries.map((i) => (
              <span key={i.name} className={i.color} style={{ width: `${(i.value / totalInd) * 100}%` }} />
            ))}
          </div>
          <ul className="m-0 mt-4 flex list-none flex-col gap-2.5 p-0">
            {industries.map((i) => (
              <li key={i.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-ink-2">
                  <span aria-hidden="true" className={clsx("size-2.5 rounded-full", i.color)} />
                  {i.name}
                </span>
                <span className="font-bold text-ink">{i.value}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {summaries.map((s) => (
          <Card key={s.title}>
            <h2 className="m-0 mb-4 text-sm font-bold text-ink">{s.title}</h2>
            <dl className="m-0 grid grid-cols-3 gap-3">
              {s.stats.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs font-medium text-muted">{k}</dt>
                  <dd className="m-0 text-lg font-extrabold text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>
        ))}
      </div>
      <DataTable
        caption="Monthly company growth"
        rows={monthly}
        rowKey={(m) => m.id}
        columns={[
          { key: "m", header: "Month", render: (m) => <span className="font-semibold text-ink">{m.month}</span> },
          { key: "n", header: "New Companies", align: "right", render: (m) => m.added },
          { key: "c", header: "Churned", align: "right", render: (m) => m.churned },
          { key: "g", header: "Net Growth", align: "right", render: (m) => <span className="font-bold text-success-700">+{m.added - m.churned}</span> },
          { key: "i", header: "Top Industry", render: (m) => m.industry },
          { key: "co", header: "Top Country", render: (m) => m.country },
        ]}
      />
    </>
  );
}
