"use client";

// SECURITY-REVIEW-REQUIRED: GDPR data export / erasure approvals and consent records. Approval must be authorised,
// audit-logged and executed server-side; erasure is irreversible.
import { useState } from "react";
import { Check, Download, FileText, Trash2, X } from "lucide-react";
import { Button, DataTable, KpiGrid, Modal, PageHeader } from "@trackdesk/ui";
import { PersonCell } from "@/components/PersonCell";
import { StatusBadge } from "@/components/StatusBadge";
import { consentRecords, gdprDeletions, gdprExports, type GdprDeletion, type GdprExport } from "@/lib/platform-mock";

type Decision = "Approved" | "Rejected";

function Decide({ status, onDecide }: { status: string; onDecide: (d: Decision) => void }) {
  if (status !== "Pending") return <span className="text-subtle">—</span>;
  return (
    <span className="inline-flex gap-1.5">
      <Button size="sm" icon={<Check aria-hidden="true" className="size-3.5" />} onClick={() => onDecide("Approved")}>
        Approve
      </Button>
      <Button size="sm" variant="secondary" icon={<X aria-hidden="true" className="size-3.5" />} onClick={() => onDecide("Rejected")}>
        Reject
      </Button>
    </span>
  );
}

export default function GdprPage() {
  const [exports, setExports] = useState<GdprExport[]>(gdprExports);
  const [deletions, setDeletions] = useState<GdprDeletion[]>(gdprDeletions);
  const [confirmErase, setConfirmErase] = useState<GdprDeletion | null>(null);

  return (
    <>
      <PageHeader crumbs={["Home", "Platform", "GDPR & Compliance"]} title="GDPR & Compliance" subtitle="Approve data requests and monitor consent across tenants." />
      <KpiGrid
        items={[
          { label: "Export Requests", value: String(exports.length), delta: "+2", deltaTone: "info", icon: <Download className="size-5" /> },
          { label: "Deletion Requests", value: String(deletions.length), icon: <Trash2 className="size-5" />, tone: "danger" },
          { label: "Consent Records", value: "18,240", delta: "+312", icon: <Check className="size-5" />, tone: "success" },
          { label: "Policy Version", value: "v3.2", icon: <FileText className="size-5" />, tone: "violet" },
        ]}
      />
      <section className="flex flex-col gap-3">
        <h2 className="m-0 text-base font-bold text-ink">Data Export Requests</h2>
        <DataTable
          caption="Data export requests"
          rows={exports}
          rowKey={(r) => r.id}
          columns={[
            { key: "id", header: "Request ID", render: (r) => <span className="font-semibold text-primary-700">{r.id}</span> },
            { key: "c", header: "Company", render: (r) => <PersonCell name={r.company} /> },
            { key: "by", header: "Requested By", render: (r) => r.requestedBy },
            { key: "d", header: "Request Date", render: (r) => r.date },
            { key: "s", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
            {
              key: "a",
              header: "Actions",
              align: "right",
              render: (r) => <Decide status={r.status} onDecide={(d) => setExports((s) => s.map((x) => (x.id === r.id ? { ...x, status: d } : x)))} />,
            },
          ]}
        />
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="m-0 text-base font-bold text-ink">Data Deletion Requests</h2>
        <DataTable
          caption="Data deletion requests"
          rows={deletions}
          rowKey={(r) => r.id}
          columns={[
            { key: "id", header: "Request ID", render: (r) => <span className="font-semibold text-primary-700">{r.id}</span> },
            { key: "c", header: "Company", render: (r) => <PersonCell name={r.company} /> },
            { key: "r", header: "Reason", render: (r) => r.reason },
            { key: "s", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
            {
              key: "a",
              header: "Actions",
              align: "right",
              render: (r) => (
                <Decide
                  status={r.status}
                  onDecide={(d) =>
                    d === "Approved" ? setConfirmErase(r) : setDeletions((s) => s.map((x) => (x.id === r.id ? { ...x, status: "Rejected" } : x)))
                  }
                />
              ),
            },
          ]}
        />
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="m-0 text-base font-bold text-ink">Consent Monitoring</h2>
        <DataTable
          caption="Consent records"
          rows={consentRecords}
          rowKey={(r) => r.id}
          columns={[
            { key: "cu", header: "Customer", render: (r) => <PersonCell name={r.customer} /> },
            { key: "co", header: "Company", render: (r) => r.company },
            { key: "c", header: "Consent", render: (r) => r.consent },
            { key: "d", header: "Accepted Date", render: (r) => r.date },
            { key: "v", header: "Version", render: (r) => r.version },
          ]}
        />
      </section>
      <Modal
        open={!!confirmErase}
        title="Approve permanent erasure?"
        onClose={() => setConfirmErase(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmErase(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (confirmErase) setDeletions((s) => s.map((x) => (x.id === confirmErase.id ? { ...x, status: "Approved" } : x)));
                setConfirmErase(null);
              }}
            >
              Approve Erasure
            </Button>
          </>
        }
      >
        <p className="m-0 text-sm text-ink-2">
          {confirmErase?.id} for {confirmErase?.company}: personal data in scope will be permanently erased. This cannot be undone.
        </p>
      </Modal>
    </>
  );
}
