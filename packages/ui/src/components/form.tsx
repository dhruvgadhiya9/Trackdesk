"use client";

import clsx from "clsx";
import type { ReactNode } from "react";
import { useId } from "react";

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
      <div className={clsx("grid gap-4", columns === 2 && "sm:grid-cols-2", columns === 3 && "sm:grid-cols-2 lg:grid-cols-3")}>{children}</div>
    </section>
  );
}

/** Segmented single-choice control (Individual / Business …). */
export function ChoiceGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
  required = true,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
  required?: boolean;
}) {
  const name = useId();
  return (
    <fieldset className={clsx("m-0 flex min-w-0 flex-col gap-1.5 border-0 p-0", className)}>
      <legend className="mb-1.5 p-0 text-sm font-semibold text-ink-2">
        {label}
        {required && <span className="text-danger-600"> *</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label
            key={o}
            className={clsx(
              "inline-flex h-[42px] cursor-pointer items-center rounded-md border px-4 text-sm font-semibold has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary-600",
              value === o ? "border-primary-600 bg-primary-50 text-primary-700" : "border-line bg-surface text-ink-2 hover:bg-surface-2",
            )}
          >
            <input type="radio" className="sr-only" name={name} checked={value === o} onChange={() => onChange(o)} />
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

/** Horizontal step indicator (Property → Service → Details → Review). */
export function Stepper({ steps, current }: { steps: readonly string[]; current: number }) {
  return (
    <ol className="m-0 flex list-none flex-wrap items-center gap-3 p-0" aria-label="Progress">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={s} className="flex flex-1 items-center gap-3" aria-current={active ? "step" : undefined}>
            <span
              className={clsx(
                "inline-flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                done ? "bg-success-500 text-white" : active ? "bg-primary-600 text-white" : "border border-line-strong bg-surface text-muted",
              )}
            >
              {done ? "✓" : i + 1}
            </span>
            <span className={clsx("whitespace-nowrap text-sm", done || active ? "font-bold text-ink" : "font-medium text-muted")}>{s}</span>
            {i < steps.length - 1 && <span aria-hidden="true" className={clsx("h-0.5 min-w-4 flex-1", done ? "bg-success-500" : "bg-line")} />}
          </li>
        );
      })}
    </ol>
  );
}
