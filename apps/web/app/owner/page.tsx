"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AlertTriangle,
  Briefcase,
  CalendarCheck,
  CircleDollarSign,
  FilePlus2,
  FileText,
  HardHat,
  Inbox,
  ReceiptText,
  TrendingUp,
  UserPlus,
  Wallet,
  BadgePercent,
} from "lucide-react";
import clsx from "clsx";
import { buttonClass, Card, CardHeader, KpiGrid, PageHeader, Tabs, type Kpi } from "@trackdesk/ui";
import { StatusBadge } from "@/components/StatusBadge";
import { currentUser, jobStatusDistribution, recentActivities, revenueTrend, staffAvailability } from "@/lib/mock";

const kpis: Kpi[] = [
  { label: "Today's Jobs", value: "42", delta: "+8%", icon: <CalendarCheck className="size-5" />, tone: "primary" },
  { label: "Active Jobs", value: "27", delta: "+3", icon: <Briefcase className="size-5" />, tone: "violet" },
  { label: "Pending Quotes", value: "17", delta: "-2", deltaTone: "danger", icon: <FileText className="size-5" />, tone: "warning" },
  { label: "Pending Payments", value: "$18.6k", delta: "9 invoices", deltaTone: "warning", icon: <Wallet className="size-5" />, tone: "info" },
  { label: "Emergency Requests", value: "5", delta: "Live", deltaTone: "danger", icon: <AlertTriangle className="size-5" />, tone: "danger" },
  { label: "Active Technicians", value: "38 / 46", icon: <HardHat className="size-5" />, tone: "success" },
  { label: "Revenue Today", value: "$7,420", delta: "+12%", icon: <CircleDollarSign className="size-5" />, tone: "success" },
  { label: "Revenue This Month", value: "$128.4k", delta: "+14%", icon: <TrendingUp className="size-5" />, tone: "primary" },
];

const statusColors = ["text-info-500", "text-primary-600", "text-violet-600", "text-warning-500", "text-success-500"];
const staffColors = ["bg-success-500", "bg-warning-500", "bg-subtle"];

function RevenueChart() {
  const w = 640;
  const h = 220;
  const pad = 28;
  const max = Math.max(...revenueTrend.current, ...revenueTrend.previous) * 1.1;
  const x = (i: number) => pad + (i * (w - pad * 2)) / (revenueTrend.labels.length - 1);
  const y = (v: number) => h - pad - (v / max) * (h - pad * 2);
  const line = (vals: number[]) => vals.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ");
  const area = `${line(revenueTrend.current)} L${x(revenueTrend.labels.length - 1)},${h - pad} L${x(0)},${h - pad} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Revenue trend: 2026 revenue rose from $82k in December to $128k in November, above 2025." className="h-auto w-full">
      {[0.25, 0.5, 0.75, 1].map((t) => (
        <line key={t} x1={pad} x2={w - pad} y1={y(max * t)} y2={y(max * t)} className="stroke-line-soft" strokeWidth={1} />
      ))}
      <path d={area} className="fill-primary-50" />
      <path d={line(revenueTrend.previous)} fill="none" className="stroke-line-strong" strokeWidth={2} strokeDasharray="5 5" />
      <path d={line(revenueTrend.current)} fill="none" className="stroke-primary-600" strokeWidth={3} strokeLinecap="round" />
      {revenueTrend.labels.map((l, i) => (
        <text key={l} x={x(i)} y={h - 6} textAnchor="middle" className="fill-muted text-xs">
          {l}
        </text>
      ))}
    </svg>
  );
}

function Donut() {
  const total = jobStatusDistribution.reduce((a, s) => a + s.value, 0);
  const r = 52;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex flex-wrap items-center gap-6">
      <svg viewBox="0 0 140 140" className="size-36 shrink-0" role="img" aria-label={`${total} jobs this week by status`}>
        {jobStatusDistribution.map((s, i) => {
          const len = (s.value / total) * c;
          const el = (
            <circle
              key={s.label}
              cx={70}
              cy={70}
              r={r}
              fill="none"
              stroke="currentColor"
              strokeWidth={18}
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 70 70)"
              className={statusColors[i]}
            />
          );
          offset += len;
          return el;
        })}
        <text x={70} y={68} textAnchor="middle" className="fill-ink text-2xl font-extrabold">
          {total}
        </text>
        <text x={70} y={88} textAnchor="middle" className="fill-muted text-xs">
          Jobs
        </text>
      </svg>
      <ul className="m-0 flex min-w-[140px] flex-1 list-none flex-col gap-2 p-0">
        {jobStatusDistribution.map((s, i) => (
          <li key={s.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-ink-2">
              <span aria-hidden="true" className={clsx("size-2.5 rounded-full bg-current", statusColors[i])} />
              {s.label}
            </span>
            <span className="font-bold text-ink">{s.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const quickActions = [
  { label: "Create Service Request", href: "/owner/requests/new", icon: Inbox },
  { label: "Create Customer", href: "/owner/customers/new", icon: UserPlus },
  { label: "Create Offer", href: "/owner/offers/new", icon: BadgePercent },
  { label: "Create Invoice", href: "/owner/invoices", icon: ReceiptText },
];

const periods = ["Daily", "Weekly", "Monthly"] as const;

export default function DashboardPage() {
  const [period, setPeriod] = useState<(typeof periods)[number]>("Monthly");
  const staffTotal = staffAvailability.reduce((a, s) => a + s.value, 0);
  const today = new Date().toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  return (
    <>
      <PageHeader
        crumbs={["Home", "Dashboard"]}
        title="Dashboard"
        subtitle={`${currentUser.company} · ${today}`}
        actions={
          <Link href="/owner/requests/new" className={buttonClass("primary")}>
            <FilePlus2 aria-hidden="true" className="size-4" /> Create Service Request
          </Link>
        }
      />
      <Card className="bg-nav text-white">
        <h2 className="m-0 text-xl font-extrabold text-white">Good morning, {currentUser.name.split(" ")[0]}</h2>
        <p className="m-0 mt-1.5 max-w-3xl text-base text-primary-200">
          42 jobs are scheduled today across 4 branches. 5 emergency requests need a technician and 17 quotations are
          waiting for customer approval.
        </p>
      </Card>
      <KpiGrid items={kpis} />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader
            title="Revenue Trend"
            subtitle="2026 revenue ($k) vs 2025"
            actions={<Tabs label="Revenue period" tabs={periods} value={period} onChange={setPeriod} />}
          />
          <RevenueChart />
        </Card>
        <Card>
          <CardHeader title="Job Status Distribution" subtitle="This week" />
          <Donut />
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader title="Staff Availability" subtitle={`${staffTotal} staff`} />
          <div className="flex h-3 overflow-hidden rounded-full" aria-hidden="true">
            {staffAvailability.map((s, i) => (
              <span key={s.label} className={staffColors[i]} style={{ width: `${(s.value / staffTotal) * 100}%` }} />
            ))}
          </div>
          <ul className="m-0 mt-4 flex list-none flex-col gap-2 p-0">
            {staffAvailability.map((s, i) => (
              <li key={s.label} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-ink-2">
                  <span aria-hidden="true" className={clsx("size-2.5 rounded-full", staffColors[i])} />
                  {s.label}
                </span>
                <span className="font-bold text-ink">{s.value}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardHeader title="Recent Activities" actions={<Link href="/owner/requests" className="text-sm font-bold">View all</Link>} />
          <ul className="m-0 flex list-none flex-col gap-4 p-0">
            {recentActivities.map((a) => (
              <li key={a.id} className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-col">
                  <span className="text-sm font-semibold text-ink">{a.title}</span>
                  <span className="text-xs text-muted">{a.meta}</span>
                </div>
                <StatusBadge status={a.tag} />
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardHeader title="Quick Actions" />
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((q) => (
              <Link
                key={q.label}
                href={q.href}
                className="flex flex-col items-start gap-2.5 rounded-lg border border-line bg-surface-2 p-4 text-sm font-semibold text-ink no-underline hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
              >
                <q.icon aria-hidden="true" className="size-5 text-primary-600" />
                {q.label}
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
