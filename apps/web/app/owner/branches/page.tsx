"use client";

import { Briefcase, Building2, HardHat, MapPin } from "lucide-react";
import { ListScreen } from "@/components/ListScreen";
import { PersonCell } from "@/components/PersonCell";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import type { Branch } from "@/lib/mock";

export default function BranchesPage() {
  return (
    <ListScreen<Branch>
      crumbs={["Home", "Organization", "Branches"]}
      title="Branches"
      subtitle="Manage branches across cities and offices."
      entity="Branch"
      createHref="/owner/branches/new"
      editHref={() => "/owner/branches/new"}
      kpis={[
        { label: "Branches", value: "4", icon: <Building2 className="size-5" /> },
        { label: "Cities", value: "4", icon: <MapPin className="size-5" />, tone: "violet" },
        { label: "Active Technicians", value: "38", delta: "+2", icon: <HardHat className="size-5" />, tone: "info" },
        { label: "Active Jobs", value: "27", icon: <Briefcase className="size-5" />, tone: "success" },
      ]}
      load={api.branches}
      search={{ placeholder: "Search branches…", text: (b) => `${b.name} ${b.code} ${b.city}` }}
      filters={[{ label: "City", get: (b) => b.city }, { label: "Status", get: (b) => b.status }]}
      columns={[
        { key: "name", header: "Branch Name", render: (b) => <span className="font-semibold text-ink">{b.name}</span> },
        { key: "code", header: "Code", render: (b) => b.code },
        { key: "city", header: "City", render: (b) => b.city },
        { key: "manager", header: "Manager", render: (b) => <PersonCell name={b.manager} /> },
        { key: "tech", header: "Active Technicians", render: (b) => b.technicians },
        { key: "jobs", header: "Active Jobs", render: (b) => b.activeJobs },
        { key: "status", header: "Status", render: (b) => <StatusBadge status={b.status} /> },
      ]}
    />
  );
}
