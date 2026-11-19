"use client";

import Link from "next/link";
import { useState } from "react";
import clsx from "clsx";
import { Building2, CreditCard, LifeBuoy } from "lucide-react";
import { buttonClass, Card, CardHeader, DataTable, PageHeader, Tabs } from "@trackdesk/ui";
import { LineChart } from "@/components/charts/LineChart";
import { PersonCell } from "@/components/PersonCell";
import { companyGrowth, platformActivities, platformRevenue, platformUser } from "@/lib/platform-mock";

const groups = [
  { title: "Company Statistics", stats: [["Total", "248"], ["Active", "231"], ["Suspended", "9"], ["Trial", "8"]] },
  { title: "Revenue Statistics", stats: [["Monthly", "$86.2k"], ["Annual", "$942k"], ["Renewals Due", "14"], ["Expired", "5"]] },
  { title: "Support Statistics", stats: [["Open", "42"], ["Pending", "18"], ["Escalated", "7"], ["Closed", "96"]] },
  { title: "Platform Statistics", stats: [["Active Users", "6,412"], ["Online Now", "1,284"], ["API Uptime", "99.98%"]] },
];
const tickets = [
  { label: "Open", value: 42, color: "bg-info-500" },
  { label: "Pending", value: 18, color: "bg-warning-500" },
  { label: "Resolved", value: 96, color: "bg-success-500" },
  { label: "Escalated", value: 7, color: "bg-danger-500" },
];
const ranges = ["6M", "12M"] as const;
const revenueViews = ["Monthly", "Yearly"] as const;

export default function PlatformDashboardPage() {
  const [range, setRange] = useState<(typeof ranges)[number]>("12M");
  const [revView, setRevView] = useState<(typeof revenueViews)[number]>("Monthly");
  const n = range === "6M" ? 6 : 12;
  const total = tickets.reduce((a, t) => a + t.value, 0);
  const yearly = (vals: number[]) => vals.map((_, i) => vals.slice(0, i + 1).reduce((a, v) => a + v, 0));
  return (
    <>
      <PageHeader
        crumbs={["Home", "Dashboard"]}
        title="Platform overview"
        subtitle={`Good morning, ${platformUser.name.split(" ")[0]}. 248 tenant companies, 6,412 active users and 12 support tickets need attention.`}
        actions={
          <>
            <Link href="/platform/companies/new" className={buttonClass("primary")}><Building2 aria-hidden="true" className="size-4" />Create Company</Link>
            <Link href="/platform/plans/new" className={buttonClass("secondary")}><CreditCard aria-hidden="true" className="size-4" />Create Subscription Plan</Link>
            <Link href="/platform/tickets" className={buttonClass("secondary")}><LifeBuoy aria-hidden="true" className="size-4" />View Tickets</Link>
          </>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {groups.map((g) => (
          <Card key={g.title}>
            <h2 className="m-0 mb-4 text-sm font-bold text-ink">{g.title}</h2>
            <dl className="m-0 grid grid-cols-2 gap-3">
              {g.stats.map(([k, v]) => (
                <div key={k}><dt className="text-xs font-medium text-muted">{k}</dt><dd className="m-0 text-xl font-extrabold text-ink">{v}</dd></div>
              ))}
            </dl>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader title="Company Growth Trend" subtitle="Company count by month" actions={<Tabs label="Range" tabs={ranges} value={range} onChange={setRange} />} />
          <LineChart labels={companyGrowth.labels.slice(-n)} current={companyGrowth.values.slice(-n)} label={`Companies grew from ${companyGrowth.values.at(-n)} to ${companyGrowth.values.at(-1)} over ${n} months`} />
        </Card>
        <Card>
          <CardHeader title="Ticket Summary" subtitle={`Last 30 days · ${total} tickets`} />
          <div className="flex h-3 overflow-hidden rounded-full" aria-hidden="true">
            {tickets.map((t) => <span key={t.label} className={t.color} style={{ width: `${(t.value / total) * 100}%` }} />)}
          </div>
          <ul className="m-0 mt-4 flex list-none flex-col gap-2.5 p-0">
            {tickets.map((t) => (
              <li key={t.label} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-ink-2"><span aria-hidden="true" className={clsx("size-2.5 rounded-full", t.color)} />{t.label}</span>
                <span className="font-bold text-ink">{t.value}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <Card>
        <CardHeader title="Revenue Trend" subtitle={revView === "Monthly" ? "Monthly revenue 2026 vs 2025 ($k)" : "Cumulative revenue 2026 vs 2025 ($k)"} actions={<Tabs label="Revenue view" tabs={revenueViews} value={revView} onChange={setRevView} />} />
        <LineChart
          labels={platformRevenue.labels}
          current={revView === "Monthly" ? platformRevenue.current : yearly(platformRevenue.current)}
          previous={revView === "Monthly" ? platformRevenue.previous : yearly(platformRevenue.previous)}
          label="Platform revenue 2026 compared with 2025"
        />
      </Card>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between"><h2 className="m-0 text-base font-bold text-ink">Recent Activities</h2><Link href="/platform/security" className="text-sm font-bold">View all</Link></div>
        <DataTable caption="Recent platform activities" rows={platformActivities} rowKey={(a) => a.id} columns={[
          { key: "d", header: "Date", render: (a) => a.date },
          { key: "a", header: "Activity", render: (a) => <span className="font-semibold text-ink">{a.activity}</span> },
          { key: "c", header: "Company", render: (a) => <PersonCell name={a.company} /> },
          { key: "u", header: "User", render: (a) => a.user },
        ]} />
      </div>
    </>
  );
}
