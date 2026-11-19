"use client";

import Link from "next/link";
import clsx from "clsx";
import { Check } from "lucide-react";
import { Badge } from "@trackdesk/ui";
import { ListScreen } from "@/components/ListScreen";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import { plans, type Plan } from "@/lib/platform-mock";

function PlanCards() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {plans
        .filter((p) => p.status === "Active")
        .map((p) => (
          <section
            key={p.id}
            className={clsx("flex flex-col gap-4 rounded-xl border bg-surface p-6 shadow-card", p.popular ? "border-primary-600" : "border-line")}
          >
            <div className="flex items-center justify-between">
              <h2 className="m-0 text-lg font-extrabold text-ink">{p.name}</h2>
              {p.popular && <Badge tone="primary">Most popular</Badge>}
            </div>
            <div>
              <span className="text-3xl font-extrabold text-ink">${p.monthly}</span>
              <span className="text-sm text-muted"> per month · ${p.annual.toLocaleString()} / year</span>
            </div>
            <ul className="m-0 flex flex-1 list-none flex-col gap-2 p-0">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-ink-2">
                  <Check aria-hidden="true" className="size-4 text-success-500" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t border-line-soft pt-3 text-sm">
              <StatusBadge status={p.status} />
              <span className="text-muted">
                {p.userLimit === "Unlimited" ? "Unlimited users" : `${p.userLimit} users`} · {p.storage}
              </span>
            </div>
            <Link href="/platform/plans/new" className="text-sm font-bold">
              Edit plan
            </Link>
          </section>
        ))}
    </div>
  );
}

export default function PlansPage() {
  return (
    <>
      <ListScreen<Plan>
        crumbs={["Home", "Tenants", "Subscription Plans"]}
        title="Subscription Plans"
        subtitle="Create and manage plans, limits and feature access."
        entity="Plan"
        createHref="/platform/plans/new"
        createLabel="Create Plan"
        editHref={() => "/platform/plans/new"}
        load={api.plans}
        columns={[
          { key: "n", header: "Plan Name", render: (p) => <span className="font-semibold text-ink">{p.name}</span> },
          { key: "p", header: "Price", render: (p) => `$${p.monthly} / mo` },
          { key: "c", header: "Billing Cycle", render: (p) => p.cycles },
          { key: "u", header: "User Limit", render: (p) => p.userLimit },
          { key: "s", header: "Storage Limit", render: (p) => p.storage },
          { key: "st", header: "Status", render: (p) => <StatusBadge status={p.status} /> },
        ]}
      />
      <PlanCards />
    </>
  );
}
