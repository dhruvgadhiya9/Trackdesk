"use client";

import Link from "next/link";
import { useState } from "react";
import clsx from "clsx";
import { CheckCircle2, FileText, KeyRound, MapPin, Paperclip, Pause, ReceiptText, RefreshCw, XCircle } from "lucide-react";
import { Badge, Button, buttonClass, Card, CardHeader, PageHeader, Tabs } from "@trackdesk/ui";
import { InfoItem } from "@/components/InfoItem";
import { OverrideModal } from "@/components/ops/OverrideModal";
import { RequestLocationModal } from "@/components/ops/RequestLocationModal";
import { PersonCell } from "@/components/PersonCell";
import { StatusBadge } from "@/components/StatusBadge";
import type { OpsJob } from "@/lib/ops-mock";

const tabs = ["Overview", "Checklist", "Attachments", "Timeline"] as const;
const checklist = ["Leak located — kitchen supply line", "Pressure test 60 psi", "Shut-off valve replaced", "No moisture after 30 min"];
const attachments = ["Before.jpg", "After.jpg", "Service-report.pdf"];
const timeline = [
  { what: "Assigned", when: "08:12", done: true },
  { what: "Accepted by technician", when: "08:15", done: true },
  { what: "Started · GPS captured", when: "09:02", done: true },
  { what: "Proof uploaded", when: "10:41", done: true },
  { what: "Happy Code sent to customer", when: "10:44", done: true },
  { what: "Completed", when: "", done: false },
  { what: "Closed", when: "", done: false },
];

export function OpsJobDetails({ job }: { job: OpsJob }) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Overview");
  const [status, setStatus] = useState<string>(job.status);
  const [hc, setHc] = useState<string>(job.happyCode);
  const [overrideOpen, setOverrideOpen] = useState(false);
  const [locOpen, setLocOpen] = useState(false);
  const [resent, setResent] = useState(false);
  const verified = hc === "Verified" || hc === "Override Approved";

  const checklistCard = (
    <Card>
      <CardHeader title="Technician Submitted Checklist" actions={<Badge tone="success">{checklist.length} / {checklist.length}</Badge>} />
      <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
        {checklist.map((c) => (
          <li key={c} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2.5 text-ink"><CheckCircle2 aria-hidden="true" className="size-5 text-success-500" />{c}</span>
            <Badge tone="success">Done</Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
  const attachCard = (
    <Card>
      <CardHeader title="Attachments" />
      <ul className="m-0 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-3">
        {attachments.map((a) => (
          <li key={a} className="flex items-center gap-2 rounded-md border border-line px-3 py-2.5 text-sm font-medium text-ink-2">
            <Paperclip aria-hidden="true" className="size-4 text-primary-600" />{a}
          </li>
        ))}
      </ul>
    </Card>
  );
  const timelineCard = (
    <Card>
      <CardHeader title="Timeline" />
      <ol className="m-0 flex list-none flex-col gap-4 p-0">
        {timeline.map((t) => (
          <li key={t.what} className="flex gap-3">
            <span aria-hidden="true" className={clsx("mt-1 size-2.5 shrink-0 rounded-full", t.done ? "bg-primary-600" : "bg-line-strong")} />
            <div className="flex flex-col">
              <span className={clsx("text-sm font-semibold", t.done ? "text-ink" : "text-muted")}>{t.what}</span>
              {t.when && <span className="text-xs text-muted">{t.when}</span>}
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );

  return (
    <>
      <PageHeader
        crumbs={["Home", "Job Pipeline", job.number]}
        title={`${job.number} · ${job.service}`}
        subtitle={`${job.priority} · Dallas HQ`}
        actions={
          <Button variant="danger" icon={<XCircle aria-hidden="true" className="size-4" />} disabled={status === "Closed" || !verified} title={verified ? undefined : "Verify the service before closing"} onClick={() => setStatus("Closed")}>
            Close Job
          </Button>
        }
      />
      <Tabs label="Job sections" tabs={tabs} value={tab} onChange={setTab} />
      {tab === "Overview" && (
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="flex min-w-0 flex-col gap-6">
            <Card>
              <CardHeader title="Job Information" />
              <dl className="m-0 grid gap-5 sm:grid-cols-3">
                <InfoItem label="Customer"><PersonCell name={job.customer} sub={job.phone} /></InfoItem>
                <InfoItem label="Property">{job.property}</InfoItem>
                <InfoItem label="Technician"><PersonCell name={job.technician} /></InfoItem>
                <InfoItem label="Priority"><StatusBadge status={job.priority} /></InfoItem>
                <InfoItem label="Status"><StatusBadge status={status} /></InfoItem>
                <InfoItem label="Happy Code"><StatusBadge status={hc} /></InfoItem>
                <InfoItem label="Warranty">6 months</InfoItem>
                <InfoItem label="Scheduled">{job.scheduled}</InfoItem>
                <InfoItem label="Branch">Dallas HQ</InfoItem>
              </dl>
            </Card>
            {checklistCard}
            {attachCard}
          </div>
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader title="Service Verification" />
              {verified ? (
                <p role="status" className="m-0 flex items-center gap-2 text-sm font-semibold text-success-700">
                  <CheckCircle2 aria-hidden="true" className="size-4" /> Service verified ({hc}).
                </p>
              ) : (
                <>
                  <p className="m-0 text-sm text-muted">Customer cannot be reached for the Happy Code? A manager override needs a reason and is logged.</p>
                  {resent && <p role="status" className="m-0 mt-2 text-sm font-semibold text-success-700">Happy Code resent to the customer.</p>}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button variant="secondary" icon={<RefreshCw aria-hidden="true" className="size-4" />} onClick={() => { setResent(true); setHc("Generated"); }}>Resend Code</Button>
                    <Button variant="secondary" icon={<KeyRound aria-hidden="true" className="size-4" />} onClick={() => setOverrideOpen(true)}>Manager Override</Button>
                  </div>
                </>
              )}
            </Card>
            {timelineCard}
            <Card>
              <CardHeader title="Quick Actions" />
              <div className="flex flex-col gap-2">
                <Button variant="secondary" icon={<Pause aria-hidden="true" className="size-4" />} disabled={status === "On Hold"} onClick={() => setStatus("On Hold")}>Hold</Button>
                <Button variant="secondary" icon={<MapPin aria-hidden="true" className="size-4" />} onClick={() => setLocOpen(true)}>Request Location</Button>
                <Link href="/ops/quotes/new" className={buttonClass("secondary")}><FileText aria-hidden="true" className="size-4" />Create Quote</Link>
                <Button variant="secondary" icon={<ReceiptText aria-hidden="true" className="size-4" />}>Generate Invoice</Button>
              </div>
            </Card>
          </div>
        </div>
      )}
      {tab === "Checklist" && checklistCard}
      {tab === "Attachments" && attachCard}
      {tab === "Timeline" && timelineCard}
      <OverrideModal
        job={overrideOpen ? job.number : null}
        onClose={() => setOverrideOpen(false)}
        onApproved={() => { setHc("Override Approved"); setStatus("Completed"); }}
      />
      <RequestLocationModal open={locOpen} onClose={() => setLocOpen(false)} defaultTech={job.technician} />
    </>
  );
}
