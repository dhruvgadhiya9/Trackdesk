"use client";

// SECURITY-REVIEW-REQUIRED: Happy Code manager override — requires manager permission and an audit-log entry server-side.
import { useState } from "react";
import { KeyRound } from "lucide-react";
import { Button, Modal, SelectField, TextAreaField } from "@trackdesk/ui";

const reasons = ["Customer unreachable after 3 attempts", "Customer confirmed by phone", "Customer has no access to code", "Other"];

export function OverrideModal({ job, onClose, onApproved }: { job: string | null; onClose: () => void; onApproved?: () => void }) {
  const [done, setDone] = useState(false);
  const close = () => {
    setDone(false);
    onClose();
  };
  return (
    <Modal
      open={!!job}
      title={`Manager override for ${job ?? ""}?`}
      onClose={close}
      footer={
        done ? (
          <Button onClick={close}>Done</Button>
        ) : (
          <>
            <Button variant="secondary" onClick={close}>Cancel</Button>
            <Button
              icon={<KeyRound aria-hidden="true" className="size-4" />}
              onClick={() => {
                setDone(true);
                onApproved?.();
              }}
            >
              Approve Override
            </Button>
          </>
        )
      }
    >
      {done ? (
        <p role="status" className="m-0 text-sm text-ink-2">Override approved. The service is marked verified and the action is recorded in the audit log.</p>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="m-0 text-sm text-muted">
            The customer could not share the Happy Code. Overriding marks the service as verified and is recorded in the audit log.
          </p>
          <SelectField label="Override reason" required options={reasons} />
          <TextAreaField label="Notes" placeholder="Calls made, evidence reviewed…" />
        </div>
      )}
    </Modal>
  );
}
