"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, ClipboardList, Download, Gauge } from "lucide-react";
import { Button, Card, CardHeader, DataTable, KpiGrid, PageHeader, Tabs } from "@trackdesk/ui";
import { PersonCell } from "@/components/PersonCell";
import { productivity } from "@/lib/ops-mock";

const sections = ["Productivity", "Pending Jobs", "Overdue Jobs", "Attendance", "Completion"] as const;

function exportCsv() {
  const header = "Technician,Assigned,Completed,Pending,Overdue,Efficiency %";
  const rows = productivity.map((p) => [p.technician, p.assigned, p.completed, p.pending, p.overdue, p.efficiency].join(","));
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([[header, ...rows].join("\n")], { type: "text/csv" }));
  a.download = "trackdesk-ops-productivity.csv";
  a.click();
  URL.revokeObjectURL(a.href);
}

export default function OpsReportsPage() {
  const [section, setSection] = useState<(typeof sections)[number]>("Productivity");
  const max = Math.max(...productivity.map((p) => p.assigned));
  return (
    <>
      <PageHeader
        crumbs={["Home", "Growth", "Reports"]}
        title="Reports"
        subtitle="Productivity, pending, overdue, attendance and completion reports · Dallas HQ · This month"
        actions={<Button variant="secondary" icon={<Download aria-hidden="true" className="size-4" />} onClick={exportCsv}>Export CSV</Button>}
      />
      <Tabs label="Report type" tabs={sections} value={section} onChange={setSection} />
      <KpiGrid
        items={[
          { label: "Assigned Jobs", value: "412", icon: <ClipboardList className="size-5" /> },
          { label: "Completed Jobs", value: "371", icon: <CheckCircle2 className="size-5" />, tone: "success" },
          { label: "Efficiency", value: "90%", delta: "+3%", icon: <Gauge className="size-5" />, tone: "violet" },
          { label: "Overdue (SLA)", value: "8", delta: "-4", icon: <AlertTriangle className="size-5" />, tone: "danger" },
        ]}
      />
      <Card>
        <CardHeader title="Productivity by Technician" subtitle="Completed vs assigned" />
        <div className="flex h-56 items-end gap-4" role="img" aria-label="Completed versus assigned jobs per technician">
          {productivity.map((p) => (
            <div key={p.id} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex w-full items-end justify-center gap-1">
                <div className="w-1/3 rounded-t-md bg-primary-600" style={{ height: `${(p.completed / max) * 170}px` }} />
                <div className="w-1/3 rounded-t-md bg-primary-200" style={{ height: `${(p.assigned / max) * 170}px` }} />
              </div>
              <span className="text-xs text-muted">{p.technician.split(" ")[0]}</span>
            </div>
          ))}
        </div>
        <ul className="m-0 mt-3 flex list-none gap-5 p-0 text-xs text-ink-2">
          <li className="flex items-center gap-2"><span aria-hidden="true" className="size-2.5 rounded-sm bg-primary-600" />Completed</li>
          <li className="flex items-center gap-2"><span aria-hidden="true" className="size-2.5 rounded-sm bg-primary-200" />Assigned</li>
        </ul>
      </Card>
      <DataTable caption="Technician productivity" rows={productivity} rowKey={(p) => p.id} columns={[
        { key: "t", header: "Technician", render: (p) => <PersonCell name={p.technician} /> },
        { key: "a", header: "Assigned", align: "right", render: (p) => p.assigned },
        { key: "c", header: "Completed", align: "right", render: (p) => p.completed },
        { key: "p", header: "Pending", align: "right", render: (p) => p.pending },
        { key: "o", header: "Overdue", align: "right", render: (p) => p.overdue },
        { key: "e", header: "Efficiency %", align: "right", render: (p) => <span className="font-bold text-ink">{p.efficiency}%</span> },
      ]} />
    </>
  );
}
