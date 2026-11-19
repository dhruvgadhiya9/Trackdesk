"use client";

import { useState } from "react";
import clsx from "clsx";
import { Activity, Gauge, Radio, XCircle } from "lucide-react";
import { Card, CardHeader, DataTable, KpiGrid, PageHeader, Tabs } from "@trackdesk/ui";
import { LineChart } from "@/components/charts/LineChart";
import { PersonCell } from "@/components/PersonCell";
import { apiCallsPerHour, companies, loginActivity } from "@/lib/platform-mock";

const ranges = ["Today", "7D", "30D"] as const;

export default function MonitoringPage() {
  const [range, setRange] = useState<(typeof ranges)[number]>("Today");
  const storage = [...companies]
    .map((c) => ({ id: c.id, name: c.name, pct: Math.round((c.storageUsedGb / c.storageLimitGb) * 100), limit: `${c.storageLimitGb} GB` }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 5);
  return (
    <>
      <PageHeader
        crumbs={["Home", "Platform", "Monitoring"]}
        title="Platform Monitoring"
        subtitle="API, storage and session health across all tenants."
        actions={<Tabs label="Range" tabs={ranges} value={range} onChange={setRange} />}
      />
      <KpiGrid
        items={[
          { label: "API Calls Today", value: "1.42M", delta: "+8%", icon: <Activity className="size-5" /> },
          { label: "Failed Requests", value: "312", delta: "-21%", icon: <XCircle className="size-5" />, tone: "danger" },
          { label: "Avg. Response Time", value: "182 ms", delta: "-12 ms", icon: <Gauge className="size-5" />, tone: "success" },
          { label: "Real-time Sessions", value: "1,284", delta: "Live", deltaTone: "info", icon: <Radio className="size-5" />, tone: "violet" },
        ]}
      />
      <Card>
        <CardHeader title="API Calls" subtitle="Requests per hour · today (k calls/hr) vs yesterday" />
        <LineChart
          labels={apiCallsPerHour.labels.map((h) => `${h}:00`)}
          current={apiCallsPerHour.today}
          previous={apiCallsPerHour.yesterday}
          label="API calls per hour today, peaking around midday, slightly above yesterday"
        />
      </Card>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Storage Monitoring" subtitle="Highest usage first" />
          <ul className="m-0 flex list-none flex-col gap-4 p-0">
            {storage.map((s) => (
              <li key={s.id} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-ink">{s.name}</span>
                  <span className="text-muted">
                    {s.pct}% of {s.limit}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-3" aria-hidden="true">
                  <div
                    className={clsx("h-full rounded-full", s.pct > 85 ? "bg-danger-500" : s.pct >= 60 ? "bg-warning-500" : "bg-primary-600")}
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>
        <div className="flex flex-col gap-3">
          <h2 className="m-0 text-base font-bold text-ink">Login Activity</h2>
          <DataTable
            caption="Recent logins"
            rows={loginActivity}
            rowKey={(l) => l.id}
            columns={[
              { key: "c", header: "Company", render: (l) => l.company },
              { key: "u", header: "User", render: (l) => <PersonCell name={l.user} /> },
              { key: "ip", header: "IP Address", render: (l) => <code className="text-xs">{l.ip}</code> },
              { key: "t", header: "Login Time", render: (l) => l.time },
            ]}
          />
        </div>
      </div>
    </>
  );
}
