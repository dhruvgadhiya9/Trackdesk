"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import clsx from "clsx";
import { CheckCircle2 } from "lucide-react";
import { Button, buttonClass, PageHeader } from "@trackdesk/ui";

export function FormSection({
  step,
  title,
  subtitle,
  children,
  columns = 2,
}: {
  step?: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  columns?: 1 | 2 | 3;
}) {
  return (
    <section className="rounded-xl border border-line bg-surface p-6 shadow-card">
      <div className="mb-5 flex items-start gap-3">
        {step !== undefined && (
          <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-bold text-primary-700">
            {step}
          </span>
        )}
        <div className="flex flex-col gap-0.5">
          <h2 className="m-0 text-base font-bold text-ink">{title}</h2>
          {subtitle && <p className="m-0 text-sm text-muted">{subtitle}</p>}
        </div>
      </div>
      <div
        className={clsx(
          "grid gap-4",
          columns === 2 && "sm:grid-cols-2",
          columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {children}
      </div>
    </section>
  );
}

/** Segmented single-choice control used by the design for type pickers (Individual / Business …). */
export function ChoiceGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <fieldset className={clsx("m-0 flex min-w-0 flex-col gap-1.5 border-0 p-0", className)}>
      <legend className="mb-1.5 p-0 text-sm font-semibold text-ink-2">
        {label}
        <span className="text-danger-600"> *</span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label
            key={o}
            className={clsx(
              "inline-flex h-[42px] cursor-pointer items-center rounded-md border px-4 text-sm font-semibold",
              value === o ? "border-primary-600 bg-primary-50 text-primary-700" : "border-line bg-surface text-ink-2 hover:bg-surface-2",
            )}
          >
            <input type="radio" className="sr-only" name={label} checked={value === o} onChange={() => onChange(o)} />
            {o}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function CheckboxGroup({
  label,
  options,
  value,
  onChange,
  className,
}: {
  label: string;
  options: readonly string[];
  value: string[];
  onChange: (v: string[]) => void;
  className?: string;
}) {
  return (
    <fieldset className={clsx("m-0 flex min-w-0 flex-col border-0 p-0", className)}>
      <legend className="mb-2 p-0 text-sm font-semibold text-ink-2">{label}</legend>
      <div className="flex flex-wrap gap-x-5 gap-y-2.5">
        {options.map((o) => (
          <label key={o} className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-ink-2">
            <input
              type="checkbox"
              className="size-4 cursor-pointer accent-primary-600"
              checked={value.includes(o)}
              onChange={(e) => onChange(e.target.checked ? [...value, o] : value.filter((x) => x !== o))}
            />
            {o}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

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
