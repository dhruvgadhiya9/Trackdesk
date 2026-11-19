"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";
import clsx from "clsx";
import { Bell, ChevronDown, CircleHelp, GitBranch, Menu, MessageSquare, Share2, X } from "lucide-react";
import { Avatar, FilterSelect, IconButton, SearchInput } from "@trackdesk/ui";
import { ownerNav } from "@/lib/nav";
import { branches, currentUser } from "@/lib/mock";

function isActive(pathname: string, href: string) {
  return href === "/owner" ? pathname === "/owner" : pathname === href || pathname.startsWith(`${href}/`);
}

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Main navigation" className="flex h-full flex-col gap-0.5 overflow-y-auto bg-nav px-3.5 pb-5 pt-6">
      <div className="flex items-center gap-3 px-2.5 pb-4">
        <span
          aria-hidden="true"
          className="inline-flex size-[38px] shrink-0 items-center justify-center rounded-lg bg-primary-600 shadow-primary"
        >
          <Share2 className="size-5 text-white" />
        </span>
        <div className="flex flex-col">
          <span className="text-lg font-extrabold leading-snug text-white">TrackDesk</span>
          <span className="text-xs font-semibold text-primary-300">Company Owner</span>
        </div>
      </div>
      {ownerNav.map((group) => (
        <div key={group.label ?? "root"} className="flex flex-col gap-0.5">
          {group.label && (
            <div className="px-3 pb-1.5 pt-3.5 text-2xs font-bold uppercase tracking-[0.1em] text-nav-section">
              {group.label}
            </div>
          )}
          {group.items.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "flex items-center gap-3 rounded-md px-3 py-[9px] no-underline",
                  active ? "bg-primary-600 shadow-nav-active" : "hover:bg-white/5",
                )}
              >
                <Icon aria-hidden="true" className={clsx("size-[18px] shrink-0", active ? "text-white" : "text-nav-icon")} />
                <span className={clsx("flex-1 text-base", active ? "font-bold text-white" : "font-medium text-nav-text")}>
                  {item.label}
                </span>
                {item.badge !== undefined && (
                  <span className="rounded-full bg-danger-500 px-2 py-0.5 text-xs font-bold text-white">{item.badge}</span>
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

export function OwnerShell({ children }: { children: ReactNode }) {
  const [drawer, setDrawer] = useState(false);
  const [branch, setBranch] = useState("All Branches");
  return (
    <div className="flex min-h-screen bg-canvas">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50">
        Skip to content
      </a>
      <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 lg:block">
        <Sidebar />
      </aside>
      {drawer && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="relative w-[260px]">
            <Sidebar onNavigate={() => setDrawer(false)} />
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setDrawer(false)}
              className="absolute right-2 top-2 inline-flex size-9 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-white"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>
          <button type="button" aria-label="Close menu" className="flex-1 cursor-pointer border-0 bg-ink/40" onClick={() => setDrawer(false)} />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-4 px-4 pt-5 sm:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <IconButton label="Open menu" className="lg:hidden" onClick={() => setDrawer(true)}>
              <Menu aria-hidden="true" className="size-5" />
            </IconButton>
            <SearchInput
              label="Global search"
              placeholder="Search jobs, customers, invoices, technicians…"
              className="max-w-[500px]"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="hidden items-center gap-2 sm:inline-flex">
              <GitBranch aria-hidden="true" className="size-4 text-muted" />
              <FilterSelect label="Branch" value={branch} onChange={setBranch} options={["All Branches", ...branches.map((b) => b.name)]} />
            </span>
            <IconButton label="Help">
              <CircleHelp aria-hidden="true" className="size-5" />
            </IconButton>
            <IconButton label="Messages">
              <MessageSquare aria-hidden="true" className="size-5" />
            </IconButton>
            <Link href="/owner/notifications" aria-label="Notifications (unread)" className="relative inline-flex size-[42px] items-center justify-center rounded-full border border-line bg-surface text-muted hover:text-ink">
              <Bell aria-hidden="true" className="size-5" />
              <span aria-hidden="true" className="absolute right-2 top-2 size-[9px] rounded-full border-2 border-white bg-danger-500" />
            </Link>
            <div className="flex items-center gap-2.5 pl-1.5">
              <Avatar name={currentUser.name} />
              <div className="hidden flex-col sm:flex">
                <span className="text-base font-bold text-ink">{currentUser.name}</span>
                <span className="text-xs text-muted">
                  {currentUser.role} · {currentUser.company}
                </span>
              </div>
              <ChevronDown aria-hidden="true" className="size-4 text-muted" />
            </div>
          </div>
        </header>
        <main id="main" className="flex min-w-0 flex-col gap-6 px-4 pb-12 pt-6 sm:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
