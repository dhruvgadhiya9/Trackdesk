"use client";

import { useState } from "react";
import { Info, KeyRound } from "lucide-react";
import { Button, Modal, SelectField, TextField, Toggle } from "@trackdesk/ui";
import { ChoiceGroup, FormLayout, FormSection } from "@/components/FormLayout";
import type { User } from "@/lib/mock";

const roles = ["Manager", "Technician", "Office Staff"] as const;
const rolePermissions: Record<(typeof roles)[number], string[]> = {
  Manager: ["Customer Management", "Service Requests", "Work Orders", "Job Scheduling", "Technician Assignment", "Inventory Access", "Reports & Dashboard"],
  Technician: ["Assigned Jobs", "My Schedule", "Customer Visit Details", "Work Completion Update", "Photo Upload", "Signature Capture", "Parts Consumption Entry"],
  "Office Staff": ["Customer Management", "Service Requests", "Quotations", "Invoices"],
};

export function UserForm({ user }: { user?: User }) {
  const [role, setRole] = useState<(typeof roles)[number]>(user?.role ?? "Technician");
  const [status, setStatus] = useState<"Active" | "Inactive">(user?.status === "Inactive" ? "Inactive" : "Active");
  const [sendCreds, setSendCreds] = useState(true);
  const [forceChange, setForceChange] = useState(true);
  const [resetOpen, setResetOpen] = useState(false);
  const [first, ...rest] = (user?.name ?? "").split(" ");
  const title = user ? `Edit ${user.name}` : "Add User";

  return (
    <>
    <FormLayout
      crumbs={["Home", "Users", title]}
      title={title}
      cancelHref="/owner/users"
      submitLabel="Save User"
      extraActions={
        user && (
          <Button variant="secondary" icon={<KeyRound aria-hidden="true" className="size-4" />} onClick={() => setResetOpen(true)}>
            Reset Password
          </Button>
        )
      }
    >
      <FormSection step={1} title="Personal Information">
        <TextField label="First Name" name="first" required defaultValue={first} />
        <TextField label="Last Name" name="last" required defaultValue={rest.join(" ")} />
        <TextField label="Mobile Number" name="mobile" type="tel" required defaultValue={user?.mobile} />
        <TextField label="Email Address" name="email" type="email" required defaultValue={user?.email} />
      </FormSection>
      <FormSection step={2} title="Employment Information">
        <TextField label="Employee ID" name="employeeId" required defaultValue={user?.employeeId} />
        <TextField label="Designation" name="designation" required defaultValue={user?.designation} />
        <TextField label="Joining Date" name="joined" type="date" />
        <SelectField label="Role" name="role" required options={roles} value={role} onChange={(e) => setRole(e.target.value as typeof role)} />
        <TextField label="Reporting Manager" name="manager" />
      </FormSection>
      {!user && (
        <FormSection step={3} title="Login Information">
          <TextField label="Username" name="username" required autoComplete="off" />
          <TextField label="Password" name="password" type="password" required autoComplete="new-password" placeholder="Create a password" minLength={8} hint="At least 8 characters with a number and a symbol." />
          <Toggle label="Send Credentials via Email" checked={sendCreds} onChange={setSendCreds} />
          <Toggle label="Force Password Change on First Login" checked={forceChange} onChange={setForceChange} />
        </FormSection>
      )}
      <FormSection step={user ? 3 : 4} title="Access Rights" subtitle={`${role} selected`} columns={1}>
        <p className="m-0 flex items-start gap-2 rounded-lg bg-surface-3 px-4 py-3 text-sm text-ink-3">
          <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          Predefined permissions are assigned automatically from the selected role. No custom role setup is needed.
        </p>
        <ul className="m-0 grid list-none gap-2 p-0 sm:grid-cols-2">
          {rolePermissions[role].map((p) => (
            <li key={p} className="rounded-md border border-line bg-surface-2 px-3 py-2 text-sm font-medium text-ink-2">{p}</li>
          ))}
        </ul>
      </FormSection>
      <FormSection step={user ? 4 : 5} title="Status" columns={1}>
        <ChoiceGroup label="Status" options={["Active", "Inactive"] as const} value={status} onChange={setStatus} />
      </FormSection>
    </FormLayout>
      <Modal
        open={resetOpen}
        title="Reset password"
        onClose={() => setResetOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setResetOpen(false)}>Cancel</Button>
            <Button onClick={() => setResetOpen(false)}>Reset</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="m-0 text-sm text-muted">
            Set a new password for {user?.name}. They will be asked to change it at next login.
          </p>
          <TextField label="New Password" type="password" autoComplete="new-password" required />
          <TextField label="Confirm Password" type="password" autoComplete="new-password" required hint="At least 8 characters with a number and a symbol." />
        </div>
      </Modal>
    </>
  );
}
