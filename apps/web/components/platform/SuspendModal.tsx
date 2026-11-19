"use client";

// SECURITY-REVIEW-REQUIRED: suspending a tenant revokes access for all its users; must be authorised and audit-logged server-side.
import { useState } from "react";
import { Pause } from "lucide-react";
import { Button, Modal, SelectField, TextAreaField } from "@trackdesk/ui";

const reasons = ["Payment overdue (60+ days)", "Terms of service violation", "Requested by company", "Security incident"];

export function SuspendModal({
  company,
  users,
  onClose,
  onConfirm,
}: {
  company: string | null;
  users?: number;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [reason, setReason] = useState(reasons[0]!);
  return (
    <Modal
      open={!!company}
      title={`Suspend ${company ?? ""}?`}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="danger" icon={<Pause aria-hidden="true" className="size-4" />} onClick={onConfirm}>Suspend Company</Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <p className="m-0 text-sm text-muted">
          {users !== undefined ? `All ${users} users` : "All users"} lose access immediately. Customer portal links are paused. Data is kept and
          you can reactivate any time.
        </p>
        <SelectField label="Reason" required options={reasons} value={reason} onChange={(e) => setReason(e.target.value)} />
        <TextAreaField label="Note to company admin" placeholder="Enter note to company admin" />
      </div>
    </Modal>
  );
}
