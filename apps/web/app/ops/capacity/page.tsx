"use client";

import clsx from "clsx";
import { CalendarCheck, Gauge, Users, Wrench } from "lucide-react";
import { ListScreen } from "@/components/ListScreen";
import { PersonCell } from "@/components/PersonCell";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import type { CapacityRow } from "@/lib/ops-mock";

function barColor(pct: number) {
  return pct > 85 ? "bg-danger-500" : pct >= 60 ? "bg-warning-500" : "bg-success-500";
}

export default function CapacityPage() {
  return (
    <>
      <ListScreen<CapacityRow>
        crumbs={["Home", "Requests", "Capacity Planning"]}
        title="Capacity Planning"
        subtitle="Identify technician workload before you assign."
        entity="Technician"
        canDelete={false}
        kpis={[
          { label: "Available Staff", value: "11 / 23", icon: <Users className="size-5" />, tone: "success" },
          { label: "Daily Capacity", value: "46 jobs", icon: <Gauge className="size-5" /> },
          { label: "Booked Today", value: "38 jobs", delta: "83%", deltaTone: "warning", icon: <CalendarCheck className="size-5" />, tone: "warning" },
          { label: "Max Service Limit / Day", value: "6 per tech", icon: <Wrench className="size-5" />, tone: "violet" },
        ]}
        load={api.capacity}
        filters={[{ label: "Load", get: (c) => c.load }]}
        columns={[
          { key: "tech", header: "Technician", render: (c) => <PersonCell name={c.technician} /> },
          { key: "assigned", header: "Jobs Assigned", align: "right", render: (c) => c.assigned },
          { key: "completed", header: "Jobs Completed", align: "right", render: (c) => c.completed },
          {
            key: "cap",
            header: "Capacity %",
            render: (c) => (
              <span className="flex items-center gap-2.5">
                <span className="h-2 w-28 overflow-hidden rounded-full bg-surface-3" aria-hidden="true">
                  <span className={clsx("block h-full rounded-full", barColor(c.capacity))} style={{ width: `${c.capacity}%` }} />
                </span>
                <span className="font-semibold text-ink">{c.capacity}%</span>
              </span>
            ),
          },
          { key: "hours", header: "Available Hours", align: "right", render: (c) => c.availableHours },
          { key: "load", header: "Load", render: (c) => <StatusBadge status={c.load} /> },
        ]}
      />
      <ul className="m-0 flex list-none flex-wrap gap-5 p-0 text-sm text-ink-2">
        <li className="flex items-center gap-2"><span aria-hidden="true" className="size-2.5 rounded-full bg-success-500" />Available (&lt; 60%)</li>
        <li className="flex items-center gap-2"><span aria-hidden="true" className="size-2.5 rounded-full bg-warning-500" />Moderate load (60–85%)</li>
        <li className="flex items-center gap-2"><span aria-hidden="true" className="size-2.5 rounded-full bg-danger-500" />Overloaded (&gt; 85%)</li>
      </ul>
    </>
  );
}
