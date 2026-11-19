"use client";

// SECURITY-REVIEW-REQUIRED: warranty certificates are compliance documents shared with customers.
import { useState } from "react";
import { BadgeCheck, FileDown, Mail } from "lucide-react";
import { Badge, Button, Card, CardHeader, TextAreaField, TextField, Toggle } from "@trackdesk/ui";
import { InfoItem } from "@/components/InfoItem";
import { ListScreen } from "@/components/ListScreen";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import { warrantyApprovals, type WarrantyRule } from "@/lib/ops-mock";

export default function WarrantyPage() {
  const [applicable, setApplicable] = useState(true);
  const [approvals, setApprovals] = useState(warrantyApprovals);
  const [emailed, setEmailed] = useState(false);
  return (
    <>
      <ListScreen<WarrantyRule>
        crumbs={["Home", "Jobs", "Warranty"]}
        title="Warranty Management"
        subtitle="Warranty rules and auto-generated certificates shared with customers."
        entity="Rule"
        headerActions={<Button>Create Rule</Button>}
        editHref={() => "/ops/warranty"}
        load={api.warrantyRules}
        columns={[
          { key: "name", header: "Rule Name", render: (r) => <span className="font-semibold text-ink">{r.name}</span> },
          { key: "svc", header: "Service Type", render: (r) => r.service },
          { key: "dur", header: "Duration", render: (r) => r.duration },
          { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
        aside={
          <Card>
            <CardHeader title="Rule Settings" subtitle="Manager decides warranty for each service." />
            <div className="flex flex-col gap-4">
              <Toggle label="Warranty Applicable" checked={applicable} onChange={setApplicable} />
              <TextField label="Warranty Duration" required defaultValue="12 months" disabled={!applicable} />
              <TextAreaField label="Warranty Conditions" defaultValue="Covers replaced parts and labour. Excludes physical damage and unauthorised repairs." disabled={!applicable} />
            </div>
          </Card>
        }
      />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader
            title="Warranty Certificate"
            subtitle="CoolAir Services LLC"
            actions={<Badge tone="success" dot>Valid</Badge>}
          />
          <dl className="m-0 grid gap-5 rounded-lg border-2 border-dashed border-primary-200 p-5 sm:grid-cols-3">
            <InfoItem label="Certificate Number">WAR-0381</InfoItem>
            <InfoItem label="Customer">Emily Johnson</InfoItem>
            <InfoItem label="Service">AC Repair · Compressor</InfoItem>
            <InfoItem label="Start Date">19 Nov 2026</InfoItem>
            <InfoItem label="Expiry Date">18 Nov 2027</InfoItem>
            <InfoItem label="Coverage">Parts & labour</InfoItem>
          </dl>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button variant="secondary" icon={<FileDown aria-hidden="true" className="size-4" />} disabled title="PDF generation needs the backend">Generate PDF</Button>
            <Button icon={<Mail aria-hidden="true" className="size-4" />} onClick={() => setEmailed(true)}>Email Certificate</Button>
            {emailed && <span role="status" className="text-sm font-semibold text-success-700">Queued for email to the customer.</span>}
          </div>
        </Card>
        <Card>
          <CardHeader title="Approvals" />
          {approvals.length === 0 ? (
            <p className="m-0 text-sm text-muted">No pending approvals.</p>
          ) : (
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {approvals.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 rounded-lg bg-surface-2 px-4 py-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-ink">Pending warranty approval</span>
                    <span className="text-xs text-muted">{a.job} · {a.customer}</span>
                  </div>
                  <Button size="sm" icon={<BadgeCheck aria-hidden="true" className="size-3.5" />} onClick={() => setApprovals((s) => s.filter((x) => x.id !== a.id))}>Approve</Button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
