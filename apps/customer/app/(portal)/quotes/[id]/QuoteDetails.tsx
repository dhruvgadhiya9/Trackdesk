"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, FileDown, MessageSquareText, X } from "lucide-react";
import { Button, Card, CardHeader, ChoiceGroup, DataTable, InfoItem, Modal, PageHeader, StatusBadge, TextAreaField } from "@trackdesk/ui";
import { money, propertyById, type Quote } from "@/lib/mock";

const reasons = ["Too Expensive", "No Longer Needed", "Other"] as const;

export function QuoteDetails({ quote: q }: { quote: Quote }) {
  const router = useRouter();
  const [status, setStatus] = useState<string>(q.status);
  const [modal, setModal] = useState<"approve" | "reject" | "changes" | null>(null);
  const [reason, setReason] = useState<(typeof reasons)[number]>("Too Expensive");
  const [changesSent, setChangesSent] = useState(false);
  const advance = q.advancePct ? Math.round(q.amount * (q.advancePct / 100) * 100) / 100 : 0;
  const pending = status === "Pending";

  return (
    <>
      <PageHeader
        crumbs={["Home", "Quotes", q.id]}
        title={q.id}
        subtitle={`From CoolAir Services · ${q.version ?? "v1"} · ${q.date}`}
        actions={<StatusBadge status={status} />}
      />
      {changesSent && (
        <p role="status" className="m-0 rounded-lg bg-primary-50 px-4 py-3 text-sm font-semibold text-primary-700">
          Your change request was sent. You will get a revised quote.
        </p>
      )}
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-6">
          <Card>
            <CardHeader title="Quote Information" />
            <dl className="m-0 grid gap-5 sm:grid-cols-4">
              <InfoItem label="Quote Number">{q.id}</InfoItem>
              <InfoItem label="Job Number">{q.job ?? "—"}</InfoItem>
              <InfoItem label="Property">{propertyById(q.propertyId)?.name ?? "—"}</InfoItem>
              <InfoItem label="Valid Until">{q.validUntil ?? "—"}</InfoItem>
            </dl>
            {q.description && <p className="m-0 mt-4 rounded-lg bg-surface-2 px-4 py-3 text-sm leading-relaxed text-ink-2">{q.description}</p>}
          </Card>
          <DataTable
            caption="Line items"
            rows={q.lines ?? []}
            rowKey={(l) => l.item}
            columns={[
              { key: "i", header: "Item", render: (l) => <span className="font-semibold text-ink">{l.item}</span> },
              { key: "q", header: "Qty", render: (l) => l.qty },
              { key: "a", header: "Amount", align: "right", render: (l) => money(l.amount) },
            ]}
          />
        </div>
        <Card>
          <CardHeader title="Summary" />
          <dl className="m-0 flex flex-col gap-2.5 text-sm">
            <div className="flex justify-between"><dt className="text-ink-3">Subtotal</dt><dd className="m-0 font-semibold text-ink">{money(q.subtotal ?? 0)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-3">Tax (8.25%)</dt><dd className="m-0 font-semibold text-ink">{money(q.tax ?? 0)}</dd></div>
            {q.discount && (
              <div className="flex justify-between"><dt className="text-ink-3">Discount · {q.discount.code}</dt><dd className="m-0 font-semibold text-success-700">−{money(q.discount.amount)}</dd></div>
            )}
            <div className="flex justify-between border-t border-line pt-2.5 text-base"><dt className="font-bold text-ink">Total Amount</dt><dd className="m-0 font-extrabold text-primary-700">{money(q.amount)}</dd></div>
          </dl>
          <div className="mt-5 flex flex-col gap-2">
            <Button icon={<Check aria-hidden="true" className="size-4" />} disabled={!pending} onClick={() => setModal("approve")}>Approve Quote</Button>
            <Button variant="secondary" icon={<MessageSquareText aria-hidden="true" className="size-4" />} disabled={!pending} onClick={() => setModal("changes")}>Request Changes</Button>
            <Button variant="ghost" className="text-danger-700" icon={<X aria-hidden="true" className="size-4" />} disabled={!pending} onClick={() => setModal("reject")}>Reject Quote</Button>
            <Button variant="secondary" icon={<FileDown aria-hidden="true" className="size-4" />} disabled title="PDF download needs the backend">Download PDF</Button>
          </div>
        </Card>
      </div>

      <Modal
        open={modal === "approve"}
        title="Approve this quotation?"
        onClose={() => setModal(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
            <Button
              onClick={() => {
                setStatus("Approved");
                setModal(null);
                if (advance > 0) router.push("/billing/pay/INV-4489");
              }}
            >
              Yes, Approve
            </Button>
          </>
        }
      >
        <p className="m-0 text-sm text-ink-2">
          Approve {q.id} for {money(q.amount)}?
          {advance > 0 && ` A ${q.advancePct}% advance (${money(advance)}) is due to confirm the work order. You will be taken to secure payment after approval.`}
        </p>
      </Modal>

      <Modal
        open={modal === "reject"}
        title="Reject quotation"
        onClose={() => setModal(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => { setStatus("Rejected"); setModal(null); }}>Reject Quote</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="m-0 text-sm text-muted">Tell us why so we can improve.</p>
          <ChoiceGroup label="Reason" options={reasons} value={reason} onChange={setReason} />
          <TextAreaField label="Comments" />
        </div>
      </Modal>

      <Modal
        open={modal === "changes"}
        title="Request changes"
        onClose={() => setModal(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
            <Button onClick={() => { setChangesSent(true); setModal(null); }}>Send</Button>
          </>
        }
      >
        <TextAreaField label="What would you like changed?" required />
      </Modal>
    </>
  );
}
