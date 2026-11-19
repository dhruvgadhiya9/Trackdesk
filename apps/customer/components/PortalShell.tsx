"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";
import clsx from "clsx";
import { Bell, Menu, Plus, Share2, X } from "lucide-react";
import { Avatar, buttonClass } from "@trackdesk/ui";
import { me, notifications } from "@/lib/mock";

const nav = [
  { label: "Dashboard", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "Requests", href: "/requests" },
  { label: "Quotes", href: "/quotes" },
  { label: "Billing", href: "/billing" },
  { label: "Warranty", href: "/warranty" },
  { label: "Messages", href: "/messages" },
];

const isActive = (path: string, href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`));

/** Top-nav shell from the `cu-*` boards. */
export function PortalShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const unread = notifications.some((n) => n.unread);
  const links = nav.map((n) => (
    <Link
      key={n.href}
      href={n.href}
      onClick={() => setOpen(false)}
      aria-current={isActive(path, n.href) ? "page" : undefined}
      className={clsx(
        "rounded-md px-3.5 py-2 text-base no-underline",
        isActive(path, n.href) ? "bg-surface font-bold text-primary-700 shadow-card" : "font-medium text-muted hover:text-ink",
      )}
    >
      {n.label}
    </Link>
  ));
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50">Skip to content</a>
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:px-8 xl:px-20">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <span aria-hidden="true" className="inline-flex size-[38px] items-center justify-center rounded-lg bg-primary-600 shadow-primary">
              <Share2 className="size-5 text-white" />
            </span>
            <span className="flex flex-col">
              <span className="text-lg font-extrabold leading-snug text-ink">TrackDesk</span>
              <span className="text-xs font-bold text-primary-700">Customer Portal</span>
            </span>
          </Link>
          <nav aria-label="Main navigation" className="hidden gap-1 rounded-lg bg-surface-2 p-1 lg:flex">{links}</nav>
          <div className="flex items-center gap-3">
            <Link href="/requests/new" className={buttonClass("primary", "sm")}>
              <Plus aria-hidden="true" className="size-4" />
              Request Service
            </Link>
            <Link href="/notifications" aria-label={unread ? "Notifications (unread)" : "Notifications"} className="relative inline-flex size-[42px] items-center justify-center rounded-full border border-line bg-surface text-ink-2">
              <Bell aria-hidden="true" className="size-5" />
              {unread && <span aria-hidden="true" className="absolute right-2 top-2 size-[9px] rounded-full border-2 border-white bg-danger-500" />}
            </Link>
            <Link href="/profile" aria-label="Profile" className="no-underline">
              <Avatar name={`${me.firstName} ${me.lastName}`} />
            </Link>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="inline-flex size-[42px] cursor-pointer items-center justify-center rounded-full border border-line bg-surface text-ink-2 lg:hidden"
            >
              {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
            </button>
          </div>
          {open && <nav aria-label="Main navigation" className="flex w-full flex-col gap-1 lg:hidden">{links}</nav>}
        </div>
      </header>
      <main id="main" className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 pb-14 pt-8 sm:px-8 xl:px-20">
        {children}
      </main>
    </div>
  );
}
