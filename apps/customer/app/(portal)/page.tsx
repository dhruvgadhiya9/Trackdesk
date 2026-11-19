"use client";

import Link from "next/link";
import { CalendarClock, CreditCard, FileText, Gift, Inbox, LifeBuoy, MessageSquare, Plus, Truck, Wallet, Wrench } from "lucide-react";
import { Button, buttonClass, Card, CardHeader, KpiGrid, StatusBadge } from "@trackdesk/ui";
import { useState } from "react";
import { me, propertyById, requests } from "@/lib/mock";

const activity = [
  { id: "a1", title: "REQ-3318 · AC Repair", meta: "Riverside Office · Updated 19 Nov, 09:42", status: "En Route", href: "/requests/REQ-3318" },
  { id: "a2", title: "QT-5512 · AC Compressor Replacement", meta: "$1,265.33 · Updated 19 Nov, 10:40", status: "Pending", href: "/quotes/QT-5512" },
  { id: "a3", title: "JOB-1042 · AC Repair", meta: "Main St. Home · Completed 19 Nov, 09:12", status: "Completed", href: "/requests/REQ-3290" },
  { id: "a4", title: "INV-4471 · $420.01", meta: "Paid 19 Nov", status: "Paid", href: "/billing" },
];
const quick = [
  { label: "Request Service", href: "/requests/new", icon: Plus },
  { label: "View Quotes", href: "/quotes", icon: FileText },
  { label: "Make Payment", href: "/billing/pay/INV-4489", icon: CreditCard },
  { label: "Contact Support", href: "/messages", icon: LifeBuoy },
];

export default function CustomerDashboard() {
  const live = requests.find((r) => r.stage === "Technician En Route");
  const [copied, setCopied] = useState(false);
  return (
    <>
      {live && (
        <section className="flex flex-wrap items-center gap-5 rounded-xl bg-nav p-6 text-white">
          <span className="inline-flex size-12 items-center justify-center rounded-xl bg-primary-600"><Truck aria-hidden="true" className="size-6" /></span>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-300">Technician On The Way</span>
            <h1 className="m-0 text-xl font-extrabold text-white">Hi {me.firstName}, your technician is on the way</h1>
            <p className="m-0 text-sm text-primary-200">
              {live.technician?.name} is heading to {propertyById(live.propertyId)?.name} for your {live.service} ({live.job}). Expected: {live.eta}.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/requests/${live.id}`} className={buttonClass("primary")}>Track Request</Link>
            <Link href="/messages" className={buttonClass("secondary")}><MessageSquare aria-hidden="true" className="size-4" />Chat Technician</Link>
          </div>
        </section>
      )}
      <KpiGrid
        items={[
          { label: "Open Requests", value: "2", icon: <Inbox className="size-5" /> },
          { label: "Active Jobs", value: "1", icon: <Wrench className="size-5" />, tone: "violet" },
          { label: "Pending Quotes", value: "1", icon: <FileText className="size-5" />, tone: "warning" },
          { label: "Pending Payments", value: "$1,265", delta: "1 invoice", deltaTone: "warning", icon: <Wallet className="size-5" />, tone: "danger" },
          { label: "Upcoming Visits", value: "2", icon: <CalendarClock className="size-5" />, tone: "success" },
        ]}
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader title="Recent Activity" actions={<Link href="/notifications" className="text-sm font-bold">View all</Link>} />
          <ul className="m-0 flex list-none flex-col p-0">
            {activity.map((a) => (
              <li key={a.id} className="border-b border-line-soft last:border-0">
                <Link href={a.href} className="flex items-center justify-between gap-3 py-3 no-underline">
                  <span className="flex min-w-0 flex-col">
                    <span className="text-sm font-semibold text-ink">{a.title}</span>
                    <span className="text-xs text-muted">{a.meta}</span>
                  </span>
                  <StatusBadge status={a.status} />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader title="Quick Actions" />
            <div className="grid grid-cols-2 gap-3">
              {quick.map((q) => (
                <Link key={q.label} href={q.href} className="flex flex-col items-start gap-2.5 rounded-lg border border-line bg-surface-2 p-4 text-sm font-semibold text-ink no-underline hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700">
                  <q.icon aria-hidden="true" className="size-5 text-primary-600" />
                  {q.label}
                </Link>
              ))}
            </div>
          </Card>
          <Card className="border-primary-200 bg-primary-50">
            <div className="flex items-start gap-3">
              <Gift aria-hidden="true" className="mt-0.5 size-5 text-primary-600" />
              <div className="flex flex-col gap-1">
                <h2 className="m-0 text-sm font-bold text-ink">Refer a friend, get $25 off</h2>
                <p className="m-0 text-sm text-ink-3">Share your link — when a friend books, you both save on the next service.</p>
                <Button variant="secondary" size="sm" className="mt-2 self-start" onClick={() => setCopied(true)}>
                  {copied ? "Link copied" : "Copy referral link"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
