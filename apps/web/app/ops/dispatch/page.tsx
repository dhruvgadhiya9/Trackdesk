"use client";

import { useState } from "react";
import { CheckCircle2, MapPin } from "lucide-react";
import { Badge, Button, Card, CardHeader, DataTable, Modal, PageHeader, SelectField } from "@trackdesk/ui";
import { InfoItem } from "@/components/InfoItem";
import { PersonCell } from "@/components/PersonCell";
import { StatusBadge } from "@/components/StatusBadge";
import { dispatchSuggestions, opsRequests, technicians } from "@/lib/ops-mock";

export default function DispatchPage() {
  const req = opsRequests[0]!;
  const [assigned, setAssigned] = useState<string | null>(null);
  const [override, setOverride] = useState(false);
  const [pick, setPick] = useState(technicians[0]!.name);
  return (
    <>
      <PageHeader
        crumbs={["Home", "Requests", "Smart Dispatch"]}
        title="Smart Dispatch"
        subtitle="System-generated technician recommendations."
        actions={<Button variant="secondary" onClick={() => setOverride(true)}>Override Assignment</Button>}
      />
      <Card>
        <dl className="m-0 grid gap-5 sm:grid-cols-4">
          <InfoItem label="Request Number">{req.number}</InfoItem>
          <InfoItem label="Customer">{req.customer} · {req.property}</InfoItem>
          <InfoItem label="Service Required">{req.service} · HVAC</InfoItem>
          <InfoItem label="Priority"><StatusBadge status={req.priority} /></InfoItem>
        </dl>
      </Card>
      {assigned && (
        <p role="status" className="m-0 flex items-center gap-2 rounded-lg bg-success-50 px-4 py-3 text-sm font-semibold text-success-700">
          <CheckCircle2 aria-hidden="true" className="size-4" /> {req.number} assigned to {assigned}. The technician has been notified.
        </p>
      )}
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-3">
          <div>
            <h2 className="m-0 text-base font-bold text-ink">Technician Suggestions</h2>
            <p className="m-0 text-sm text-muted">Ranked by skill match, availability, branch and workload</p>
          </div>
          <DataTable
            caption="Technician suggestions"
            rows={dispatchSuggestions}
            rowKey={(d) => d.id}
            columns={[
              { key: "tech", header: "Technician", render: (d) => <PersonCell name={d.technician} sub={d.skill} /> },
              { key: "match", header: "Skill Match", render: (d) => <Badge tone={d.match >= 85 ? "success" : d.match >= 60 ? "warning" : "neutral"}>{d.match}%</Badge> },
              { key: "branch", header: "Branch", render: (d) => d.branch },
              { key: "load", header: "Workload", render: (d) => d.workload },
              { key: "avail", header: "Availability", render: (d) => <StatusBadge status={d.availability} /> },
              { key: "dist", header: "Distance", align: "right", render: (d) => d.distance },
              {
                key: "act",
                header: "Actions",
                align: "right",
                render: (d) => (
                  <Button size="sm" variant={assigned === d.technician ? "secondary" : "primary"} disabled={assigned === d.technician} onClick={() => setAssigned(d.technician)}>
                    {assigned === d.technician ? "Assigned" : "Assign"}
                  </Button>
                ),
              },
            ]}
          />
        </div>
        <Card>
          <CardHeader title="Map Preview" subtitle="Distance to property" />
          <div className="relative h-56 overflow-hidden rounded-lg bg-surface-3" role="img" aria-label="Map: James 3.2 mi, Mia 5.8 mi, Ethan 2.1 mi from the job">
            <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-xs font-bold text-danger-700"><MapPin aria-hidden="true" className="size-6 text-danger-600" />Job</span>
            <span className="absolute left-[22%] top-[28%] rounded-full bg-primary-600 px-2 py-0.5 text-xs font-bold text-white">James</span>
            <span className="absolute right-[12%] top-[20%] rounded-full bg-violet-600 px-2 py-0.5 text-xs font-bold text-white">Mia</span>
            <span className="absolute bottom-[18%] left-[58%] rounded-full bg-warning-500 px-2 py-0.5 text-xs font-bold text-white">Ethan</span>
          </div>
          <p className="m-0 mt-4 text-xs leading-relaxed text-muted">
            System suggests → manager reviews → manager assigns. The technician is notified instantly and may accept the job (optional).
          </p>
        </Card>
      </div>
      <Modal
        open={override}
        title="Override assignment"
        onClose={() => setOverride(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOverride(false)}>Cancel</Button>
            <Button onClick={() => { setAssigned(pick); setOverride(false); }}>Assign</Button>
          </>
        }
      >
        <SelectField label="Technician" options={technicians.map((t) => t.name)} value={pick} onChange={(e) => setPick(e.target.value)} />
      </Modal>
    </>
  );
}
