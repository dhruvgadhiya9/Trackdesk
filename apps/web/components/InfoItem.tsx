import type { ReactNode } from "react";

/** Label/value pair for detail cards. Use inside a <dl>. */
export function InfoItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</dt>
      <dd className="m-0 text-sm font-semibold text-ink">{children}</dd>
    </div>
  );
}
