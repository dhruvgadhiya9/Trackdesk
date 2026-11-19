"use client";

// SECURITY-REVIEW-REQUIRED: technician location data. One-off snapshot requests only — no continuous tracking (GDPR).
import { useState } from "react";
import { MapPin, ShieldCheck } from "lucide-react";
import { Button, Modal, SelectField } from "@trackdesk/ui";
import { technicians } from "@/lib/ops-mock";

const reasons = ["Customer asking for arrival", "Emergency reassignment", "Safety check", "Route planning"];

export function RequestLocationModal({ open, onClose, defaultTech }: { open: boolean; onClose: () => void; defaultTech?: string }) {
  const [sent, setSent] = useState(false);
  const close = () => {
    setSent(false);
    onClose();
  };
  return (
    <Modal
      open={open}
      title="Request live location"
      onClose={close}
      footer={
        sent ? (
          <Button onClick={close}>Done</Button>
        ) : (
          <>
            <Button variant="secondary" onClick={close}>Cancel</Button>
            <Button icon={<MapPin aria-hidden="true" className="size-4" />} onClick={() => setSent(true)}>Send Request</Button>
          </>
        )
      }
    >
      {sent ? (
        <p role="status" className="m-0 text-sm text-ink-2">Request sent. The technician can share a one-time snapshot or reject with a reason.</p>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="m-0 text-sm text-muted">The technician will be asked to share their current location once. They can reject with a reason.</p>
          <SelectField label="Technician" required options={technicians.map((t) => t.name)} defaultValue={defaultTech} />
          <SelectField label="Reason for request" required options={reasons} />
          <p className="m-0 flex items-start gap-2.5 rounded-lg bg-primary-50 px-4 py-3 text-sm font-medium text-primary-700">
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            Location is shared as a single snapshot. Continuous tracking is not allowed (GDPR).
          </p>
        </div>
      )}
    </Modal>
  );
}
