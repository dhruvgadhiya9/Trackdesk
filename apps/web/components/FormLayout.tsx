"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button, buttonClass, PageHeader } from "@trackdesk/ui";

export { CheckboxGroup, ChoiceGroup, FormSection } from "@trackdesk/ui";

export function FormLayout({
  crumbs,
  title,
  subtitle,
  cancelHref,
  submitLabel,
  extraActions,
  successHref,
  children,
}: {
  crumbs: string[];
  title: string;
  subtitle?: string;
  cancelHref: string;
  submitLabel: string;
  extraActions?: ReactNode;
  successHref?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    setSaving(true);
    // Mock save — replace with the API mutation when the backend endpoint exists.
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => router.push(successHref ?? cancelHref), 700);
    }, 400);
  };

  return (
    <form onSubmit={onSubmit} noValidate={false} className="flex flex-col gap-6">
      <PageHeader crumbs={crumbs} title={title} subtitle={subtitle} />
      {children}
      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center justify-end gap-2.5 border-t border-line bg-canvas/95 px-4 py-4 backdrop-blur sm:-mx-8 sm:px-8">
        {saved && (
          <span role="status" className="mr-auto inline-flex items-center gap-2 text-sm font-semibold text-success-700">
            <CheckCircle2 aria-hidden="true" className="size-4" /> Saved
          </span>
        )}
        <Link href={cancelHref} className={buttonClass("secondary")}>
          Cancel
        </Link>
        {extraActions}
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
