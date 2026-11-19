"use client";

import clsx from "clsx";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { AlertTriangle, ChevronLeft, ChevronRight, ChevronRight as Crumb, Inbox, X } from "lucide-react";
import { Button, toneBg, type Tone } from "./primitives";

/* ---------------------------------------------------------------- PageHeader */

export function PageHeader({
  crumbs,
  title,
  subtitle,
  actions,
}: {
  crumbs: string[];
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1.5">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5">
          {crumbs.map((c, i) => (
            <span key={c} className="flex items-center gap-1.5">
              {i > 0 && <Crumb aria-hidden="true" className="size-3 text-subtle" />}
              <span
                aria-current={i === crumbs.length - 1 ? "page" : undefined}
                className={clsx(
                  "text-xs",
                  i === crumbs.length - 1 ? "font-semibold text-primary-700" : "font-medium text-muted",
                )}
              >
                {c}
              </span>
            </span>
          ))}
        </nav>
        <h1 className="m-0 text-title font-extrabold leading-tight tracking-tight text-ink">{title}</h1>
        {subtitle && <p className="m-0 text-base text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2.5">{actions}</div>}
    </div>
  );
}

/* ---------------------------------------------------------------- KPI */

export interface Kpi {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: Tone;
  icon: ReactNode;
  tone?: Tone;
}

export function KpiCard({ label, value, delta, deltaTone = "success", icon, tone = "primary" }: Kpi) {
  return (
    <div className="flex min-w-0 flex-col gap-3.5 rounded-xl border border-line bg-surface p-5 shadow-card">
      <div className="flex items-center justify-between">
        <span className={clsx("inline-flex size-[42px] items-center justify-center rounded-lg", toneBg(tone))}>
          {icon}
        </span>
        {delta && (
          <span className={clsx("rounded-full px-2 py-1 text-xs font-bold", toneBg(deltaTone))}>{delta}</span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-kpi font-extrabold leading-tight tracking-tight text-ink">{value}</div>
        <div className="text-sm font-medium text-muted">{label}</div>
      </div>
    </div>
  );
}

export function KpiGrid({ items }: { items: Kpi[] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
      {items.map((k) => (
        <KpiCard key={k.label} {...k} />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- Table */

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  align?: "left" | "right";
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  caption,
  onRowClick,
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  caption: string;
  onRowClick?: (row: T) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-table">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-surface-2">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className={clsx(
                    "whitespace-nowrap border-b border-line-soft px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted",
                    c.align === "right" ? "text-right" : "text-left",
                  )}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={rowKey(r)}
                onClick={onRowClick ? () => onRowClick(r) : undefined}
                className={clsx("border-b border-line-soft last:border-0", onRowClick && "cursor-pointer hover:bg-surface-2")}
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={clsx(
                      "whitespace-nowrap px-4 py-3.5 text-sm text-ink-2",
                      c.align === "right" && "text-right",
                    )}
                  >
                    {c.render(r)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Pagination */

export function Pagination({
  page,
  pageCount,
  total,
  pageSize,
  onPage,
}: {
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  onPage: (p: number) => void;
}) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1).slice(0, 7);
  const btn =
    "inline-flex size-9 cursor-pointer items-center justify-center rounded-md border border-line bg-surface text-sm font-semibold text-ink-2 disabled:cursor-not-allowed disabled:opacity-40";
  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-between gap-3">
      <p className="m-0 text-sm text-muted">
        Showing {from}–{to} of {total.toLocaleString()} records
      </p>
      <div className="flex items-center gap-1.5">
        <button type="button" aria-label="Previous page" className={btn} disabled={page <= 1} onClick={() => onPage(page - 1)}>
          <ChevronLeft aria-hidden="true" className="size-4" />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            aria-current={p === page ? "page" : undefined}
            className={clsx(btn, p === page && "border-primary-600 bg-primary-600 text-white")}
            onClick={() => onPage(p)}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          aria-label="Next page"
          className={btn}
          disabled={page >= pageCount}
          onClick={() => onPage(page + 1)}
        >
          <ChevronRight aria-hidden="true" className="size-4" />
        </button>
      </div>
    </nav>
  );
}

/* ---------------------------------------------------------------- States */

export function EmptyState({ title, message, action }: { title: string; message?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-line-strong bg-surface px-6 py-14 text-center">
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-primary-50 text-primary-600">
        <Inbox aria-hidden="true" className="size-6" />
      </span>
      <h3 className="m-0 text-base font-bold text-ink">{title}</h3>
      {message && <p className="m-0 max-w-sm text-sm text-muted">{message}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 rounded-xl border border-danger-50 bg-surface px-6 py-14 text-center">
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-danger-50 text-danger-600">
        <AlertTriangle aria-hidden="true" className="size-6" />
      </span>
      <h3 className="m-0 text-base font-bold text-ink">Something went wrong</h3>
      <p className="m-0 max-w-sm text-sm text-muted">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={clsx("animate-pulse rounded-md bg-surface-3", className)} />;
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div role="status" aria-label="Loading" className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-5">
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="h-9 w-full" />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- Tabs */

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  label,
}: {
  tabs: readonly T[];
  value: T;
  onChange: (t: T) => void;
  label: string;
}) {
  return (
    <div role="tablist" aria-label={label} className="flex flex-wrap gap-1 border-b border-line">
      {tabs.map((t) => (
        <button
          key={t}
          role="tab"
          type="button"
          aria-selected={t === value}
          onClick={() => onChange(t)}
          className={clsx(
            "-mb-px cursor-pointer border-0 border-b-2 bg-transparent px-3.5 py-2.5 text-sm font-semibold",
            t === value ? "border-primary-600 text-primary-700" : "border-transparent text-muted hover:text-ink",
          )}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- Modal */

export function Modal({
  open,
  title,
  onClose,
  children,
  footer,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="modal-title"
      className="m-auto w-[min(560px,calc(100vw-32px))] rounded-xl border border-line bg-surface p-0 shadow-modal backdrop:bg-ink/40"
    >
      <div className="flex items-center justify-between border-b border-line-soft px-6 py-4">
        <h2 id="modal-title" className="m-0 text-base font-bold text-ink">
          {title}
        </h2>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-muted hover:bg-surface-3"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      </div>
      <div className="px-6 py-5">{children}</div>
      {footer && <div className="flex justify-end gap-2.5 border-t border-line-soft px-6 py-4">{footer}</div>}
    </dialog>
  );
}
