"use client";

import { useState } from "react";
import clsx from "clsx";
import { CircleDollarSign, Download, Landmark, Percent, TrendingUp } from "lucide-react";
import { Button, Card, CardHeader, DataTable, KpiGrid, PageHeader, Tabs } from "@trackdesk/ui";

const sections = ["Revenue", "Customers", "Services", "Branches", "Technicians", "Offers", "Taxes"] as const;
const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N"];
const monthly = [84, 92, 98, 104, 101, 110, 112, 118, 116, 120, 125];
const byBranch = [
  { name: "Dallas HQ", pct: 48, jobs: "1,204", revenue: "$566k", tax: "$46.7k", offers: 148, rating: "4.9" },
  { name: "Houston North", pct: 27, jobs: "688", revenue: "$318k", tax: "$26.2k", offers: 91, rating: "4.8" },
  { name: "Austin Central", pct: 18, jobs: "452", revenue: "$212k", tax: "$17.5k", offers: 57, rating: "4.8" },
  { name: "San Antonio", pct: 7, jobs: "190", revenue: "$84k", tax: "$6.0k", offers: 16, rating: "4.6" },
];
const branchColors = ["bg-primary-600", "bg-violet-600", "bg-info-500", "bg-warning-500"];

function downloadCsv() {
  // Client-side CSV export of the branch table. Excel/PDF exports need the reporting API (not built yet).
  const header = "Branch,Jobs,Revenue,Tax Collected,Offer Usage,Avg Rating";
  const rows = byBranch.map((b) => [b.name, b.jobs.replace(",", ""), b.revenue, b.tax, b.offers, b.rating].join(","));
  const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "trackdesk-branch-report.csv";
  a.click();
  URL.revokeObjectURL(a.href);
}

export default function ReportsPage() {
  const [section, setSection] = useState<(typeof sections)[number]>("Revenue");
  const max = Math.max(...monthly);
  return (
    <>
      <PageHeader
        crumbs={["Home", "Insights", "Reports"]}
        title="Reports & Analytics"
        subtitle="Revenue, customer, service, branch, offer and tax reports · Jan – Nov 2026"
        actions={
          <>
            <Button variant="secondary" icon={<Download aria-hidden="true" className="size-4" />} onClick={downloadCsv}>CSV</Button>
            <Button variant="secondary" disabled title="Available when the reporting API ships">Excel</Button>
            <Button variant="secondary" disabled title="Available when the reporting API ships">PDF</Button>
          </>
        }
      />
      <Tabs label="Report type" tabs={sections} value={section} onChange={setSection} />
      <KpiGrid
        items={[
          { label: "Revenue", value: "$1.18M", delta: "+18%", icon: <CircleDollarSign className="size-5" />, tone: "success" },
          { label: "Avg. Job Value", value: "$412", delta: "+6%", icon: <TrendingUp className="size-5" /> },
          { label: "Tax Collected", value: "$96.4k", icon: <Landmark className="size-5" />, tone: "violet" },
          { label: "Discounts Given", value: "$22.1k", icon: <Percent className="size-5" />, tone: "warning" },
        ]}
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader title="Revenue by Month ($k)" />
          <div className="flex h-56 items-end gap-2" role="img" aria-label={`Monthly revenue from $${monthly[0]}k in January to $${monthly.at(-1)}k in November`}>
            {monthly.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="text-xs font-semibold text-muted">{v}</span>
                <div className="w-full rounded-t-md bg-primary-600" style={{ height: `${(v / max) * 170}px` }} />
                <span className="text-xs text-muted">{months[i]}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title="By Branch (%)" subtitle="$1.18M revenue" />
          <div className="flex h-3 overflow-hidden rounded-full" aria-hidden="true">
            {byBranch.map((b, i) => <span key={b.name} className={branchColors[i]} style={{ width: `${b.pct}%` }} />)}
          </div>
          <ul className="m-0 mt-4 flex list-none flex-col gap-2.5 p-0">
            {byBranch.map((b, i) => (
              <li key={b.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-ink-2"><span aria-hidden="true" className={clsx("size-2.5 rounded-full", branchColors[i])} />{b.name}</span>
                <span className="font-bold text-ink">{b.pct}%</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <DataTable
        caption="Branch performance"
        rows={byBranch}
        rowKey={(b) => b.name}
        columns={[
          { key: "b", header: "Branch", render: (b) => <span className="font-semibold text-ink">{b.name}</span> },
          { key: "j", header: "Jobs", align: "right", render: (b) => b.jobs },
          { key: "r", header: "Revenue", align: "right", render: (b) => b.revenue },
          { key: "t", header: "Tax Collected", align: "right", render: (b) => b.tax },
          { key: "o", header: "Offer Usage", align: "right", render: (b) => b.offers },
          { key: "a", header: "Avg. Rating", align: "right", render: (b) => b.rating },
        ]}
      />
    </>
  );
}
