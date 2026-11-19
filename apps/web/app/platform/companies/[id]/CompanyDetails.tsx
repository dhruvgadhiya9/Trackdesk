"use client";

import Link from "next/link";
import { useState } from "react";
import { Pause, Pencil, Play } from "lucide-react";
import { Button, buttonClass, Card, CardHeader, DataTable, PageHeader, Tabs } from "@trackdesk/ui";
import { InfoItem } from "@/components/InfoItem";
import { PersonCell } from "@/components/PersonCell";
import { SuspendModal } from "@/components/platform/SuspendModal";
import { StatusBadge } from "@/components/StatusBadge";
import type { Company } from "@/lib/platform-mock";

const tabs = ["Overview", "Branches", "Users", "Subscription History", "Storage Usage", "Activity Logs"] as const;
const branchRows = [
  { id: "b1", name: "Dallas HQ", location: "Dallas, TX", users: 32, status: "Active" },
  { id: "b2", name: "Houston North", location: "Houston, TX", users: 21, status: "Active" },
  { id: "b3", name: "Austin Central", location: "Austin, TX", users: 14, status: "Active" },
  { id: "b4", name: "San Antonio", location: "San Antonio, TX", users: 9, status: "Inactive" },
];
const userRows = [
  { id: "u1", name: "Sarah Mitchell", role: "Admin", branch: "All", status: "Active" },
  { id: "u2", name: "Marcus Reed", role: "Manager", branch: "Dallas HQ", status: "Active" },
  { id: "u3", name: "James Carter", role: "Technician", branch: "Dallas HQ", status: "Active" },
  { id: "u4", name: "Priya Patel", role: "Office Staff", branch: "Houston North", status: "Inactive" },
];
const history = [
  { id: "h1", plan: "Enterprise", start: "Nov 2025", end: "Nov 2026", amount: "$5,988" },
  { id: "h2", plan: "Pro", start: "Jan 2025", end: "Nov 2025", amount: "$1,980" },
  { id: "h3", plan: "Trial", start: "Jan 2025", end: "Jan 2025", amount: "$0" },
];
const activity = [
  { what: "Plan upgraded to Enterprise", who: "Daniel Carter · 2 days ago" },
  { what: "12 users added", who: "Company admin · 5 days ago" },
  { what: "Branch “Austin Central” created", who: "Company admin · 2 weeks ago" },
];

export function CompanyDetails({ company: c }: { company: Company }) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Overview");
  const [status, setStatus] = useState<string>(c.status);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const pct = Math.round((c.storageUsedGb / c.storageLimitGb) * 100);

  const branchesTable = <DataTable caption="Branches" rows={branchRows} rowKey={(b) => b.id} columns={[
    { key: "n", header: "Branch Name", render: (b) => <span className="font-semibold text-ink">{b.name}</span> },
    { key: "l", header: "Location", render: (b) => b.location },
    { key: "u", header: "Users", align: "right", render: (b) => b.users },
    { key: "s", header: "Status", render: (b) => <StatusBadge status={b.status} /> },
  ]} />;
  const usersTable = <DataTable caption="Users" rows={userRows} rowKey={(u) => u.id} columns={[
    { key: "n", header: "Name", render: (u) => <PersonCell name={u.name} /> },
    { key: "r", header: "Role", render: (u) => u.role },
    { key: "b", header: "Branch", render: (u) => u.branch },
    { key: "s", header: "Status", render: (u) => <StatusBadge status={u.status} /> },
  ]} />;
  const historyTable = <DataTable caption="Subscription history" rows={history} rowKey={(h) => h.id} columns={[
    { key: "p", header: "Plan", render: (h) => <span className="font-semibold text-ink">{h.plan}</span> },
    { key: "s", header: "Start", render: (h) => h.start },
    { key: "e", header: "End", render: (h) => h.end },
    { key: "a", header: "Amount", align: "right", render: (h) => h.amount },
  ]} />;
  const storageCard = (
    <Card>
      <CardHeader title="Storage Usage" subtitle={`${c.storageUsedGb} GB of ${c.storageLimitGb} GB used`} />
      <div className="h-3 overflow-hidden rounded-full bg-surface-3" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Storage used">
        <div className={pct > 85 ? "h-full rounded-full bg-danger-500" : "h-full rounded-full bg-primary-600"} style={{ width: `${pct}%` }} />
      </div>
      <dl className="m-0 mt-4 grid grid-cols-3 gap-4">
        <InfoItem label="Allocated">{c.storageLimitGb} GB</InfoItem>
        <InfoItem label="Used">{c.storageUsedGb} GB ({pct}%)</InfoItem>
        <InfoItem label="Remaining">{c.storageLimitGb - c.storageUsedGb} GB</InfoItem>
      </dl>
    </Card>
  );
  const activityCard = (
    <Card>
      <CardHeader title="Activity Logs" />
      <ol className="m-0 flex list-none flex-col gap-4 p-0">
        {activity.map((a) => (
          <li key={a.what} className="flex gap-3">
            <span aria-hidden="true" className="mt-1 size-2.5 shrink-0 rounded-full bg-primary-600" />
            <div className="flex flex-col"><span className="text-sm font-semibold text-ink">{a.what}</span><span className="text-xs text-muted">{a.who}</span></div>
          </li>
        ))}
      </ol>
    </Card>
  );

  return (
    <>
      <PageHeader
        crumbs={["Home", "Companies", c.name]}
        title={c.name}
        subtitle={`${c.plan} tenant · ${c.country}`}
        actions={
          <>
            {status === "Suspended" ? (
              <Button variant="secondary" icon={<Play aria-hidden="true" className="size-4" />} onClick={() => setStatus("Active")}>Reactivate</Button>
            ) : (
              <Button variant="danger" icon={<Pause aria-hidden="true" className="size-4" />} onClick={() => setSuspendOpen(true)}>Suspend</Button>
            )}
            <Link href="/platform/companies/new" className={buttonClass("primary")}><Pencil aria-hidden="true" className="size-4" />Edit Company</Link>
          </>
        }
      />
      <Tabs label="Company sections" tabs={tabs} value={tab} onChange={setTab} />
      {tab === "Overview" && (
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="flex min-w-0 flex-col gap-6">
            <Card>
              <CardHeader title="Company Information" />
              <dl className="m-0 grid gap-5 sm:grid-cols-3">
                <InfoItem label="Company Code">{c.code}</InfoItem>
                <InfoItem label="Industry">{c.industry}</InfoItem>
                <InfoItem label="Country">{c.country}</InfoItem>
                <InfoItem label="Website">{c.domain}</InfoItem>
                <InfoItem label="Created">{c.created}</InfoItem>
                <InfoItem label="Current Plan">{c.plan}</InfoItem>
                <InfoItem label="Subscription Status"><StatusBadge status={status} /></InfoItem>
                <InfoItem label="Expiry">{c.expiry}</InfoItem>
                <InfoItem label="Company Admin"><PersonCell name={c.admin.name} sub={c.admin.email} /></InfoItem>
              </dl>
            </Card>
            {branchesTable}
            {usersTable}
          </div>
          <div className="flex flex-col gap-6">
            {storageCard}
            {historyTable}
            {activityCard}
          </div>
        </div>
      )}
      {tab === "Branches" && branchesTable}
      {tab === "Users" && usersTable}
      {tab === "Subscription History" && historyTable}
      {tab === "Storage Usage" && storageCard}
      {tab === "Activity Logs" && activityCard}
      <SuspendModal
        company={suspendOpen ? c.name : null}
        users={c.users}
        onClose={() => setSuspendOpen(false)}
        onConfirm={() => { setStatus("Suspended"); setSuspendOpen(false); }}
      />
    </>
  );
}
