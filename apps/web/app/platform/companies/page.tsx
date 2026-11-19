"use client";

import { useState } from "react";
import { Building2, CheckCircle2, Clock, Download, PauseCircle } from "lucide-react";
import { Button } from "@trackdesk/ui";
import { ListScreen } from "@/components/ListScreen";
import { PersonCell } from "@/components/PersonCell";
import { SuspendModal } from "@/components/platform/SuspendModal";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import type { Company } from "@/lib/platform-mock";

export default function CompaniesPage() {
  const [suspended, setSuspended] = useState<Set<string>>(new Set());
  const [target, setTarget] = useState<Company | null>(null);

  const exportCsv = async () => {
    const rows = await api.companies();
    const csv = ["Name,Code,Industry,Country,Plan,Branches,Users,Status,Expiry", ...rows.map((c) => [c.name, c.code, c.industry, c.country, c.plan, c.branches, c.users, c.status, c.expiry].map((v) => `"${v}"`).join(","))].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "trackdesk-companies.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <ListScreen<Company>
        crumbs={["Home", "Tenants", "Companies"]}
        title="Company Management"
        subtitle="Manage all registered tenant companies on TrackDesk."
        entity="Company"
        createHref="/platform/companies/new"
        createLabel="Create Company"
        canDelete={false}
        rowHref={(c) => `/platform/companies/${c.id}`}
        headerActions={<Button variant="secondary" icon={<Download aria-hidden="true" className="size-4" />} onClick={exportCsv}>Export Companies</Button>}
        kpis={[
          { label: "Total Companies", value: "248", delta: "+12", icon: <Building2 className="size-5" /> },
          { label: "Active", value: "231", delta: "+4%", icon: <CheckCircle2 className="size-5" />, tone: "success" },
          { label: "Trial", value: "8", delta: "+3", icon: <Clock className="size-5" />, tone: "info" },
          { label: "Suspended", value: "9", delta: "-2", icon: <PauseCircle className="size-5" />, tone: "danger" },
        ]}
        load={api.companies}
        search={{ placeholder: "Search company name or code…", text: (c) => `${c.name} ${c.code}` }}
        filters={[
          { label: "Status", get: (c) => (suspended.has(c.id) ? "Suspended" : c.status) },
          { label: "Plan", get: (c) => c.plan },
          { label: "Country", get: (c) => c.country },
        ]}
        columns={[
          { key: "name", header: "Company Name", render: (c) => <PersonCell name={c.name} sub={c.domain} /> },
          { key: "code", header: "Code", render: (c) => <span className="font-semibold text-primary-700">{c.code}</span> },
          { key: "ind", header: "Industry", render: (c) => c.industry },
          { key: "country", header: "Country", render: (c) => c.country },
          { key: "plan", header: "Plan", render: (c) => c.plan },
          { key: "br", header: "Branches", align: "right", render: (c) => c.branches },
          { key: "users", header: "Users", align: "right", render: (c) => c.users },
          { key: "status", header: "Status", render: (c) => <StatusBadge status={suspended.has(c.id) ? "Suspended" : c.status} /> },
          { key: "exp", header: "Expiry", render: (c) => c.expiry },
          {
            key: "suspend",
            header: "Suspend",
            render: (c) =>
              c.status === "Suspended" || suspended.has(c.id) ? (
                <span className="text-subtle">—</span>
              ) : (
                <Button variant="ghost" size="sm" className="text-danger-700" onClick={(e) => { e.stopPropagation(); setTarget(c); }}>Suspend</Button>
              ),
          },
        ]}
      />
      <SuspendModal
        company={target?.name ?? null}
        users={target?.users}
        onClose={() => setTarget(null)}
        onConfirm={() => {
          if (target) setSuspended((s) => new Set(s).add(target.id));
          setTarget(null);
        }}
      />
    </>
  );
}
