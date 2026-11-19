"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRightLeft, FileAudio, FileImage, Mic, UserCheck } from "lucide-react";
import { Button, buttonClass, Card, CardHeader, DataTable, PageHeader, SelectField, Tabs } from "@trackdesk/ui";
import { InfoItem } from "@/components/InfoItem";
import { PersonCell } from "@/components/PersonCell";
import { StatusBadge } from "@/components/StatusBadge";
import { services } from "@/lib/mock";
import type { OpsRequest } from "@/lib/ops-mock";

const tabs = ["Request Details", "Job History", "Audit Trail"] as const;
const history = [
  { id: "JOB-0921", service: "AC Servicing", date: "Jun 2026" },
  { id: "JOB-0744", service: "Duct Cleaning", date: "Jan 2026" },
  { id: "JOB-0512", service: "AC Installation", date: "Aug 2025" },
];
const files = [
  { name: "Outdoor unit.jpg", icon: FileImage },
  { name: "Thermostat.jpg", icon: FileImage },
  { name: "Noise.mp4", icon: FileAudio },
];

export function RequestDetails({ req }: { req: OpsRequest }) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Request Details");
  const [status, setStatus] = useState<string>(req.status);
  const [category, setCategory] = useState("HVAC");
  const [service, setService] = useState(req.classified ? req.service : "AC Repair");
  const [audit, setAudit] = useState([
    { what: "Request submitted", when: `${req.source} · ${req.created}` },
    { what: "Viewed by Marcus Reed", when: "08:05" },
  ]);
  const converted = status === "Converted";

  const convert = () => {
    setStatus("Converted");
    setAudit((a) => [...a, { what: `Classified as ${service}`, when: "now" }, { what: "Converted to job", when: "now" }]);
  };

  return (
    <>
      <PageHeader
        crumbs={["Home", "Service Requests", req.number]}
        title={`${req.number} · ${req.service}`}
        actions={
          <>
            <Link href="/ops/dispatch" className={buttonClass("secondary")}><UserCheck aria-hidden="true" className="size-4" />Assign</Link>
            <Button icon={<ArrowRightLeft aria-hidden="true" className="size-4" />} disabled={converted} onClick={convert}>
              {converted ? "Converted" : "Convert to Job"}
            </Button>
          </>
        }
      />
      <Tabs label="Request sections" tabs={tabs} value={tab} onChange={setTab} />
      {tab === "Request Details" && (
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="flex min-w-0 flex-col gap-6">
            <Card>
              <CardHeader title="Request Details" />
              <dl className="m-0 grid gap-5 sm:grid-cols-3">
                <InfoItem label="Customer"><PersonCell name={req.customer} sub={req.phone} /></InfoItem>
                <InfoItem label="Property">{req.property}</InfoItem>
                <InfoItem label="Source">{req.source}</InfoItem>
                <InfoItem label="Priority"><StatusBadge status={req.priority} /></InfoItem>
                <InfoItem label="Status"><StatusBadge status={status} /></InfoItem>
                <InfoItem label="Created">{req.created}</InfoItem>
              </dl>
            </Card>
            <Card>
              <CardHeader title="Problem Description & Attachments" />
              <blockquote className="m-0 rounded-lg bg-surface-2 px-4 py-3 text-sm italic leading-relaxed text-ink-2">“{req.description}”</blockquote>
              <ul className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0">
                {files.map((f) => (
                  <li key={f.name} className="flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-medium text-ink-2">
                    <f.icon aria-hidden="true" className="size-4 text-primary-600" />{f.name}
                  </li>
                ))}
                <li className="flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-medium text-ink-2">
                  <Mic aria-hidden="true" className="size-4 text-primary-600" />Voice note transcribed · 0:24
                </li>
              </ul>
            </Card>
          </div>
          <Card>
            <CardHeader title="Service Classification" subtitle="Manager classifies problem-description requests before dispatch." />
            <div className="flex flex-col gap-4">
              <SelectField label="Classify Category" required options={[...new Set(services.map((s) => s.category))]} value={category} onChange={(e) => setCategory(e.target.value)} disabled={converted} />
              <SelectField
                label="Classify Service"
                required
                options={services.filter((s) => s.category === category).map((s) => s.name).concat(services.some((s) => s.name === service) ? [] : [service])}
                value={service}
                onChange={(e) => setService(e.target.value)}
                disabled={converted}
              />
            </div>
          </Card>
        </div>
      )}
      {tab === "Job History" && (
        <DataTable caption="Job history for this property" rows={history} rowKey={(h) => h.id} columns={[
          { key: "job", header: "Job", render: (h) => <span className="font-semibold text-primary-700">{h.id}</span> },
          { key: "svc", header: "Service", render: (h) => h.service },
          { key: "date", header: "Date", render: (h) => h.date },
        ]} />
      )}
      {tab === "Audit Trail" && (
        <Card>
          <ol className="m-0 flex list-none flex-col gap-4 p-0">
            {audit.map((a, i) => (
              <li key={i} className="flex gap-3">
                <span aria-hidden="true" className="mt-1 size-2.5 shrink-0 rounded-full bg-primary-600" />
                <div className="flex flex-col"><span className="text-sm font-semibold text-ink">{a.what}</span><span className="text-xs text-muted">{a.when}</span></div>
              </li>
            ))}
          </ol>
        </Card>
      )}
    </>
  );
}
