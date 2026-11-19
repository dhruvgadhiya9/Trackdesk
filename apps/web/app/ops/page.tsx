"use client";

import Link from "next/link";
import { useState } from "react";
import clsx from "clsx";
import { AlertTriangle, FilePlus2, FileText, UserCheck } from "lucide-react";
import { Avatar, Badge, buttonClass, Card, CardHeader, PageHeader, Tabs } from "@trackdesk/ui";
import { opsUser, productivity } from "@/lib/ops-mock";

type Stat = { label: string; value: number; tone?: string };
const summaries: { title: string; stats: Stat[] }[] = [
  { title: "Job Summary", stats: [{ label: "Today's Jobs", value: 18 }, { label: "Emergency", value: 3, tone: "text-danger-600" }, { label: "Scheduled", value: 12 }, { label: "Overdue", value: 2, tone: "text-warning-700" }] },
  { title: "Quotation Summary", stats: [{ label: "Pending", value: 9, tone: "text-warning-700" }, { label: "Approved", value: 21, tone: "text-success-700" }, { label: "Rejected", value: 3, tone: "text-danger-600" }] },
  { title: "Workforce Summary", stats: [{ label: "Available", value: 11, tone: "text-success-700" }, { label: "On Job", value: 9 }, { label: "On Leave", value: 2 }, { label: "Offline", value: 1 }] },
  { title: "Approval Summary", stats: [{ label: "Requests", value: 6 }, { label: "Warranty", value: 2 }, { label: "Leave", value: 3 }] },
];
const statusOverview = [
  { label: "Open", value: 4, color: "bg-info-500" },
  { label: "Assigned", value: 5, color: "bg-primary-600" },
  { label: "In Progress", value: 6, color: "bg-violet-600" },
  { label: "Hold", value: 1, color: "bg-warning-500" },
  { label: "Completed", value: 7, color: "bg-success-500" },
  { label: "Closed", value: 3, color: "bg-subtle" },
];
const periods = ["Week", "Month"] as const;

export default function OpsDashboardPage() {
  const [period, setPeriod] = useState<(typeof periods)[number]>("Week");
  const total = statusOverview.reduce((a, s) => a + s.value, 0);
  const prod = productivity.map((p) => ({ ...p, value: period === "Week" ? p.weekCompleted : p.completed }));
  const max = Math.max(...prod.map((p) => p.value));
  return (
    <>
      <PageHeader
        crumbs={["Home", "Dashboard"]}
        title={`Today at ${opsUser.branch}`}
        subtitle="18 jobs scheduled, 3 emergencies, 2 jobs overdue on SLA. 11 technicians are available right now."
        actions={
          <>
            <Link href="/ops/requests/new" className={buttonClass("primary")}><FilePlus2 aria-hidden="true" className="size-4" />Create Service Request</Link>
            <Link href="/ops/dispatch" className={buttonClass("secondary")}><UserCheck aria-hidden="true" className="size-4" />Assign Job</Link>
            <Link href="/ops/quotes/new" className={buttonClass("secondary")}><FileText aria-hidden="true" className="size-4" />Create Quote</Link>
          </>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaries.map((s) => (
          <Card key={s.title}>
            <h2 className="m-0 mb-4 text-sm font-bold text-ink">{s.title}</h2>
            <dl className="m-0 grid grid-cols-2 gap-3">
              {s.stats.map((st) => (
                <div key={st.label}>
                  <dt className="text-xs font-medium text-muted">{st.label}</dt>
                  <dd className={clsx("m-0 text-2xl font-extrabold", st.tone ?? "text-ink")}>{st.value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Job Status Overview" subtitle={`${total} jobs`} />
          <div className="flex h-3 overflow-hidden rounded-full" aria-hidden="true">
            {statusOverview.map((s) => <span key={s.label} className={s.color} style={{ width: `${(s.value / total) * 100}%` }} />)}
          </div>
          <ul className="m-0 mt-4 grid list-none grid-cols-2 gap-2.5 p-0 sm:grid-cols-3">
            {statusOverview.map((s) => (
              <li key={s.label} className="flex items-center justify-between gap-2 text-sm">
                <span className="flex items-center gap-2 text-ink-2"><span aria-hidden="true" className={clsx("size-2.5 rounded-full", s.color)} />{s.label}</span>
                <span className="font-bold text-ink">{s.value}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardHeader title="Technician Productivity" subtitle={`Jobs completed this ${period.toLowerCase()}`} actions={<Tabs label="Period" tabs={periods} value={period} onChange={setPeriod} />} />
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {prod.map((p) => (
              <li key={p.id} className="flex items-center gap-3">
                <Avatar name={p.technician} size="sm" />
                <span className="w-28 shrink-0 text-sm font-semibold text-ink">{p.technician}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface-3" aria-hidden="true">
                  <span className="block h-full rounded-full bg-primary-600" style={{ width: `${(p.value / max) * 100}%` }} />
                </span>
                <span className="w-8 text-right text-sm font-bold text-ink">{p.value}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <Card>
        <CardHeader title="Bottlenecks & SLA Alerts" actions={<Badge tone="danger">2 alerts</Badge>} />
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          <li className="flex flex-wrap items-center gap-3 rounded-lg bg-danger-50 px-4 py-3">
            <AlertTriangle aria-hidden="true" className="size-5 text-danger-600" />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="text-sm font-bold text-ink">JOB-1039 overdue by 6 h — Riverside Offices LLC</span>
              <span className="text-xs text-ink-3">SLA 24 h breached · Technician: Ethan Ross</span>
            </div>
            <Link href="/ops/dispatch" className={buttonClass("secondary", "sm")}>Reassign</Link>
          </li>
          <li className="flex flex-wrap items-center gap-3 rounded-lg bg-warning-50 px-4 py-3">
            <AlertTriangle aria-hidden="true" className="size-5 text-warning-700" />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="text-sm font-bold text-ink">JOB-1041 at risk — parts not arrived</span>
              <span className="text-xs text-ink-3">On hold since 08:10 · Waiting For Parts</span>
            </div>
            <Link href="/ops/pipeline" className={buttonClass("secondary", "sm")}>View</Link>
          </li>
        </ul>
      </Card>
    </>
  );
}
