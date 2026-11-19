"use client";

// SECURITY-REVIEW-REQUIRED: GDPR consent toggles (marketing vs service notifications) must be persisted with
// timestamp + policy version server-side.
import type { FormEvent } from "react";
import { useState } from "react";
import { KeyRound, LogOut } from "lucide-react";
import Link from "next/link";
import { Avatar, Button, buttonClass, Card, FormSection, Modal, PageHeader, TextField, Toggle } from "@trackdesk/ui";
import { me } from "@/lib/mock";

export default function ProfilePage() {
  const [serviceNotes, setServiceNotes] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [pwDone, setPwDone] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    setSaved(true);
  };

  return (
    <>
    <form onSubmit={submit} onChange={() => setSaved(false)} className="flex flex-col gap-6">
      <PageHeader crumbs={["Home", "Profile"]} title="Profile" />
      <Card className="flex flex-wrap items-center gap-4">
        <Avatar name={`${me.firstName} ${me.lastName}`} />
        <div className="flex flex-1 flex-col">
          <span className="text-lg font-bold text-ink">{`${me.firstName} ${me.lastName}`}</span>
          <span className="text-sm text-muted">Customer since {me.since}</span>
        </div>
        <Link href="/login" className={buttonClass("ghost", "sm")}>
          <LogOut aria-hidden="true" className="size-4" />
          Sign out
        </Link>
      </Card>
      <FormSection title="Personal Information">
        <TextField label="First Name" name="first" autoComplete="given-name" required defaultValue={me.firstName} />
        <TextField label="Last Name" name="last" autoComplete="family-name" required defaultValue={me.lastName} />
      </FormSection>
      <FormSection title="Contact Information">
        <TextField label="Mobile Number" name="mobile" type="tel" autoComplete="tel" required defaultValue={me.mobile} />
        <TextField label="Email Address" name="email" type="email" autoComplete="email" required defaultValue={me.email} />
      </FormSection>
      <FormSection title="Privacy" subtitle="GDPR controls" columns={1}>
        <Toggle label="Service notifications (SMS / Email)" description="Updates about your requests, quotes and invoices." checked={serviceNotes} onChange={(v) => { setServiceNotes(v); setSaved(false); }} />
        <Toggle label="Marketing offers" description="Occasional discounts and seasonal tips. You can opt out any time." checked={marketing} onChange={(v) => { setMarketing(v); setSaved(false); }} />
      </FormSection>
      <div className="flex flex-wrap items-center justify-end gap-2.5">
        {saved && <span role="status" className="mr-auto text-sm font-semibold text-success-700">Profile updated</span>}
        <Button variant="secondary" icon={<KeyRound aria-hidden="true" className="size-4" />} onClick={() => { setPwDone(false); setPwOpen(true); }}>
          Change Password
        </Button>
        <Button type="submit">Update Profile</Button>
      </div>
    </form>
      <Modal
        open={pwOpen}
        title="Change password"
        onClose={() => setPwOpen(false)}
        footer={
          pwDone ? (
            <Button onClick={() => setPwOpen(false)}>Done</Button>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setPwOpen(false)}>Cancel</Button>
              <Button form="pw-form" type="submit">Update Password</Button>
            </>
          )
        }
      >
        {pwDone ? (
          <p role="status" className="m-0 text-sm text-ink-2">Your password was changed.</p>
        ) : (
          <form
            id="pw-form"
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (e.currentTarget.reportValidity()) setPwDone(true);
            }}
          >
            <TextField label="Current Password" type="password" autoComplete="current-password" required />
            <TextField label="New Password" type="password" autoComplete="new-password" minLength={8} required hint="At least 8 characters with a number and a symbol." />
          </form>
        )}
      </Modal>
    </>
  );
}
