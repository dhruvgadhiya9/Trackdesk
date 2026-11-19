"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { label: "Invoices", href: "/billing" },
  { label: "Payment History", href: "/billing/history" },
];

/** Link-based tabs shared by the billing pages. */
export function BillingTabs() {
  const path = usePathname();
  return (
    <nav aria-label="Billing sections" className="flex gap-1 border-b border-line">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          aria-current={path === l.href ? "page" : undefined}
          className={clsx(
            "-mb-px border-b-2 px-3.5 py-2.5 text-sm font-semibold no-underline",
            path === l.href ? "border-primary-600 text-primary-700" : "border-transparent text-muted hover:text-ink",
          )}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
