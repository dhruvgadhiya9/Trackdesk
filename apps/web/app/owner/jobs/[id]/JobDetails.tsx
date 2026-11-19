"use client";

import { useState } from "react";
import clsx from "clsx";
import { CheckCircle2, Circle, FileText, MapPin, MessageSquare, Pause, Phone, ReceiptText, UserCog, XCircle } from "lucide-react";
import { Avatar, Badge, Button, Card, CardHeader, Modal, PageHeader, SelectField } from "@trackdesk/ui";
import { StatusBadge } from "@/components/StatusBadge";
import { users, type Job } from "@/lib/mock";

const checklist = [
  { label: "Gas pressure check", done: true },
  { label: "Compressor check", done: true },
  { label: "Filter replacement", done: true },
  { label: "Voltage test", done: false },
  { label: "Earthing test", done: false },
];
const media = ["Before · Rooftop unit", "Before · Panel", "After · Rooftop unit", "Video · Test run"];
const activity = [
  { title: "Request created", meta: "REQ-3316 · 19 Nov, 08:10", done: true },
  { title: "Assigned to technician", meta: "By Marcus Reed · 08:22", done: true },
  { title: "Job started", meta: "GPS captured · 10:05", done: true },
  { title: "Checklist in progress", meta: "3 of 5 items", done: true },
  { title: "Happy Code verification", meta: "Pending", done: false },
  { title: "Invoice & closure", meta: "Pending", done: false },
];

function Info({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</dt>
      <dd className="m-0 text-sm font-semibold text-ink">{children}</dd>
    </div>
  );
}

export function JobDetails({ job }: { job: Job }) {
  const [status, setStatus] = useState(job.status);
  const [tech, setTech] = useState(job.technician);
  const [reassign, setReassign] = useState(false);
  const [pick, setPick] = useState(job.technician ?? "");
  const technicians = users.filter((u) => u.role === "Technician" && u.status === "Active");
  const techUser = users.find((u) => u.name === tech);
  const done = checklist.filter((c) => c.done).length;

  return (
    <>
      <PageHeader
        crumbs={["Home", "Job Pipeline", job.number]}
        title={`${job.number} · ${job.service}`}
        subtitle={`${job.customer} · ${job.property}`}
        actions={
          <>
            <Button variant="secondary" icon={<UserCog aria-hidden="true" className="size-4" />} onClick={() => setReassign(true)}>Reassign</Button>
            <Button variant="danger" icon={<XCircle aria-hidden="true" className="size-4" />} disabled={status === "Closed"} onClick={() => setStatus("Closed")}>Close Job</Button>
          </>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-6">
          <Card>
            <CardHeader title="Job Information" />
            <dl className="m-0 grid gap-5 sm:grid-cols-3">
              <Info label="Customer">{job.customer}</Info>
              <Info label="Property">{job.property}</Info>
              <Info label="Services">{job.service}</Info>
              <Info label="Priority"><StatusBadge status={job.priority} /></Info>
              <Info label="Status"><StatusBadge status={status} /></Info>
              <Info label="Scheduled">{job.scheduled} 2026</Info>
              <Info label="Happy Code">{status === "Completed" ? "Verified" : "Not Generated"}</Info>
            </dl>
          </Card>
          <Card>
            <CardHeader title="Photos & Videos" actions={<Badge tone="primary">{media.length}</Badge>} />
            <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-4">
              {media.map((m) => (
                <li key={m} className="flex aspect-[4/3] items-end rounded-lg bg-surface-3 p-2.5 text-xs font-semibold text-ink-3">{m}</li>
              ))}
            </ul>
          </Card>
          <Card>
            <CardHeader title="Checklist" subtitle="HVAC Repair + Electrical Safety" actions={<Badge tone="primary">{done} / {checklist.length} done</Badge>} />
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              {checklist.map((c) => (
                <li key={c.label} className="flex items-center gap-2.5 text-sm">
                  {c.done ? <CheckCircle2 aria-hidden="true" className="size-5 text-success-500" /> : <Circle aria-hidden="true" className="size-5 text-line-strong" />}
                  <span className={clsx(c.done ? "text-ink" : "text-muted")}>{c.label}</span>
                  <span className="sr-only">{c.done ? "done" : "not done"}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader title="Technician" />
            {techUser ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Avatar name={techUser.name} />
                  <div className="flex flex-1 flex-col">
                    <span className="text-base font-bold text-ink">{techUser.name}</span>
                    <span className="text-xs text-muted">{techUser.designation} · {techUser.employeeId}</span>
                  </div>
                  <Badge tone="violet" dot>On Job</Badge>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <a href={`tel:${techUser.mobile}`} className="flex flex-col items-center gap-1 rounded-md border border-line py-2.5 text-xs font-semibold text-ink-2 no-underline hover:bg-surface-2"><Phone aria-hidden="true" className="size-4" />Call</a>
                  <Button variant="secondary" size="sm" className="h-auto flex-col py-2.5 text-xs"><MessageSquare aria-hidden="true" className="size-4" />Chat</Button>
                  <Button variant="secondary" size="sm" className="h-auto flex-col py-2.5 text-xs"><MapPin aria-hidden="true" className="size-4" />Location</Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-start gap-3">
                <p className="m-0 text-sm text-muted">No technician assigned yet.</p>
                <Button onClick={() => setReassign(true)}>Assign technician</Button>
              </div>
            )}
          </Card>
          <Card>
            <CardHeader title="Activity Logs" />
            <ol className="m-0 flex list-none flex-col gap-4 p-0">
              {activity.map((a) => (
                <li key={a.title} className="flex gap-3">
                  <span aria-hidden="true" className={clsx("mt-1 size-2.5 shrink-0 rounded-full", a.done ? "bg-primary-600" : "bg-line-strong")} />
                  <div className="flex flex-col">
                    <span className={clsx("text-sm font-semibold", a.done ? "text-ink" : "text-muted")}>{a.title}</span>
                    <span className="text-xs text-muted">{a.meta}</span>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
          <Card>
            <CardHeader title="Quick Actions" />
            <div className="flex flex-col gap-2">
              <Button variant="secondary" icon={<Pause aria-hidden="true" className="size-4" />} onClick={() => setStatus("On Hold")} disabled={status === "On Hold"}>Hold</Button>
              <Button variant="secondary" icon={<FileText aria-hidden="true" className="size-4" />}>Generate Quote</Button>
              <Button variant="secondary" icon={<ReceiptText aria-hidden="true" className="size-4" />}>Generate Invoice</Button>
            </div>
          </Card>
        </div>
      </div>
      <Modal
        open={reassign}
        title="Reassign job"
        onClose={() => setReassign(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setReassign(false)}>Cancel</Button>
            <Button onClick={() => { setTech(pick || null); if (status === "Open") setStatus("Assigned"); setReassign(false); }}>Assign</Button>
          </>
        }
      >
        <SelectField label="Technician" options={["", ...technicians.map((t) => t.name)]} value={pick} onChange={(e) => setPick(e.target.value)} />
      </Modal>
    </>
  );
}
