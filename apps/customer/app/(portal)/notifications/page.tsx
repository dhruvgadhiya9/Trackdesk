"use client";

import Link from "next/link";
import { useState } from "react";
import clsx from "clsx";
import { CheckCheck } from "lucide-react";
import { Badge, Button, Card, EmptyState, PageHeader, Tabs } from "@trackdesk/ui";
import { notifications as seed } from "@/lib/mock";

const tabs = ["All", "Requests", "Quotations", "Payments", "Technician"] as const;

export default function NotificationsPage() {
  const [items, setItems] = useState(seed);
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const visible = items.filter((n) => tab === "All" || n.category === tab);
  return (
    <>
      <PageHeader
        crumbs={["Home", "Notifications"]}
        title="Notifications"
        actions={
          <Button variant="secondary" icon={<CheckCheck aria-hidden="true" className="size-4" />} disabled={!items.some((n) => n.unread)} onClick={() => setItems((s) => s.map((n) => ({ ...n, unread: false })))}>
            Mark all as read
          </Button>
        }
      />
      <Tabs label="Notification type" tabs={tabs} value={tab} onChange={setTab} />
      {visible.length === 0 ? (
        <EmptyState title="You're all caught up" />
      ) : (
        <Card padded={false}>
          <ul className="m-0 flex list-none flex-col p-0">
            {visible.map((n) => (
              <li key={n.id} className="border-b border-line-soft last:border-0">
                <Link
                  href={n.href}
                  onClick={() => setItems((s) => s.map((x) => (x.id === n.id ? { ...x, unread: false } : x)))}
                  className={clsx("flex items-center justify-between gap-3 px-5 py-4 no-underline hover:bg-surface-2", n.unread && "bg-primary-50/40")}
                >
                  <span className="flex min-w-0 flex-col">
                    <span className={clsx("text-sm text-ink", n.unread ? "font-bold" : "font-semibold")}>{n.title}</span>
                    <span className="text-xs text-muted">{n.meta}</span>
                  </span>
                  {n.unread && <Badge tone="primary" dot>New</Badge>}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
