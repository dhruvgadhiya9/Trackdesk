"use client";

import Link from "next/link";
import { useState } from "react";
import clsx from "clsx";
import { CalendarClock, Check, MessageSquare, Phone, ShieldCheck, Smile, Star } from "lucide-react";
import { Avatar, Button, buttonClass, Card, CardHeader, InfoItem, Modal, PageHeader, StatusBadge, TextField } from "@trackdesk/ui";
import { propertyById, requestStages, type ServiceRequest } from "@/lib/mock";

export function RequestTracking({ req }: { req: ServiceRequest }) {
  const [cancelled, setCancelled] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [reschedule, setReschedule] = useState(false);
  const [rescheduled, setRescheduled] = useState<string>();
  const current = requestStages.indexOf(req.stage);
  const property = propertyById(req.propertyId);
  const canCancel = !cancelled && current < requestStages.indexOf("Work In Progress");
  const awaitingCode = !!req.happyCode && current <= requestStages.indexOf("Completion Pending Verification");

  return (
    <>
      <PageHeader
        crumbs={["Home", "Requests", req.id]}
        title={`${req.id} · ${req.service}`}
        subtitle={`${property?.name} · ${req.priority}`}
        actions={
          awaitingCode ? (
            <Link href={`/requests/${req.id}/happy-code`} className={buttonClass("primary")}>
              <ShieldCheck aria-hidden="true" className="size-4" />
              View Happy Code
            </Link>
          ) : req.stage === "Completed" ? (
            <Link href={`/requests/${req.id}/feedback`} className={buttonClass("primary")}>
              <Smile aria-hidden="true" className="size-4" />
              Rate your service
            </Link>
          ) : null
        }
      />
      {cancelled && (
        <p role="status" className="m-0 rounded-lg bg-surface-3 px-4 py-3 text-sm font-semibold text-ink-2">
          This request was cancelled.
        </p>
      )}
      <div className="grid items-start gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Status Timeline" />
          <ol className="m-0 flex list-none flex-col p-0">
            {requestStages.map((s, i) => {
              const done = i < current || (i === current && req.stage === "Completed");
              const active = i === current && req.stage !== "Completed";
              return (
                <li key={s} className="relative flex gap-3 pb-5 last:pb-0" aria-current={active ? "step" : undefined}>
                  {i < requestStages.length - 1 && (
                    <span aria-hidden="true" className={clsx("absolute left-[11px] top-6 h-[calc(100%-16px)] w-0.5", done ? "bg-success-500" : "bg-line")} />
                  )}
                  <span
                    className={clsx(
                      "relative z-10 inline-flex size-6 shrink-0 items-center justify-center rounded-full",
                      done ? "bg-success-500 text-white" : active ? "bg-primary-600 ring-4 ring-primary-50" : "border-2 border-line-strong bg-surface",
                    )}
                  >
                    {done && <Check aria-hidden="true" className="size-3.5" />}
                  </span>
                  <span className="flex flex-col">
                    <span className={clsx("text-sm", done || active ? "font-bold text-ink" : "font-medium text-muted")}>{s}</span>
                    {req.stageTimes[s] && <span className="text-xs text-muted">{req.stageTimes[s]}</span>}
                  </span>
                </li>
              );
            })}
          </ol>
        </Card>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader title="Current Status" actions={<StatusBadge status={req.stage === "Technician En Route" ? "En Route" : req.stage} />} />
            <p className="m-0 text-sm text-ink-2">
              {req.stage === "Technician En Route"
                ? `${req.technician?.name.split(" ")[0]} is on the way to ${property?.name}.`
                : `Last update: ${req.stage}.`}
            </p>
            <p className="m-0 mt-1 text-xs text-muted">Updated {req.updated}</p>
          </Card>
          {req.technician && (
            <Card>
              <CardHeader title="Technician Information" />
              <div className="flex items-center gap-3">
                <Avatar name={req.technician.name} />
                <div className="flex flex-1 flex-col">
                  <span className="text-base font-bold text-ink">{req.technician.name}</span>
                  <span className="text-xs text-muted">{req.technician.title}</span>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-bold text-ink">
                  <Star aria-hidden="true" className="size-4 fill-warning-500 text-warning-500" />
                  {req.technician.rating}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/messages" className={buttonClass("secondary", "sm")}>
                  <MessageSquare aria-hidden="true" className="size-4" />
                  Chat Technician
                </Link>
                <Link href="/messages" className={buttonClass("secondary", "sm")}>
                  <Phone aria-hidden="true" className="size-4" />
                  Contact Company
                </Link>
              </div>
            </Card>
          )}
          <Card>
            <CardHeader title="ETA Information" />
            <dl className="m-0 grid grid-cols-2 gap-4">
              <InfoItem label="Scheduled Date">{rescheduled ?? req.scheduled}</InfoItem>
              <InfoItem label="Arrival">{rescheduled ? "To be confirmed" : req.eta}</InfoItem>
            </dl>
            <p className="m-0 mt-3 text-xs text-muted">
              ETA is shown by day (Today, Tomorrow, Within 2 days) — no live tracking, to protect technician privacy.
            </p>
            {canCancel && (
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" icon={<CalendarClock aria-hidden="true" className="size-4" />} onClick={() => setReschedule(true)}>
                  Reschedule
                </Button>
                <Button variant="ghost" size="sm" className="text-danger-700" onClick={() => setConfirmCancel(true)}>
                  Cancel Request
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
      <Modal
        open={confirmCancel}
        title="Cancel this request?"
        onClose={() => setConfirmCancel(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmCancel(false)}>Keep request</Button>
            <Button
              variant="danger"
              onClick={() => {
                setCancelled(true);
                setConfirmCancel(false);
              }}
            >
              Cancel Request
            </Button>
          </>
        }
      >
        <p className="m-0 text-sm text-ink-2">The technician will be notified. Emergency charges may apply if they are already on the way.</p>
      </Modal>
      <Modal
        open={reschedule}
        title="Request a new date"
        onClose={() => setReschedule(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setReschedule(false)}>Cancel</Button>
            <Button form="reschedule-form" type="submit">Send Request</Button>
          </>
        }
      >
        <form
          id="reschedule-form"
          onSubmit={(e) => {
            e.preventDefault();
            const d = new FormData(e.currentTarget).get("date");
            if (d) setRescheduled(String(d));
            setReschedule(false);
          }}
        >
          <TextField label="Preferred date" name="date" type="date" required />
        </form>
      </Modal>
    </>
  );
}
