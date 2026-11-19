"use client";

import { Briefcase, Building, KeyRound, Users } from "lucide-react";
import { ListScreen } from "@/components/ListScreen";
import { PersonCell } from "@/components/PersonCell";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import type { Customer } from "@/lib/mock";

export default function CustomersPage() {
  return (
    <ListScreen<Customer>
      crumbs={["Home", "Customers"]}
      title="Customers"
      subtitle="Customer records, properties and portal access."
      entity="Customer"
      createHref="/owner/customers/new"
      rowHref={(c) => `/owner/customers/${c.id}`}
      editHref={() => "/owner/customers/new"}
      kpis={[
        { label: "Total Customers", value: "1,284", delta: "+36", icon: <Users className="size-5" /> },
        { label: "Business", value: "312", icon: <Building className="size-5" />, tone: "violet" },
        { label: "With Portal Access", value: "948", delta: "+22", icon: <KeyRound className="size-5" />, tone: "info" },
        { label: "Active AMCs", value: "214", delta: "+9", icon: <Briefcase className="size-5" />, tone: "success" },
      ]}
      load={api.customers}
      search={{ placeholder: "Search name, email or mobile…", text: (c) => `${c.name} ${c.email} ${c.mobile} ${c.code}` }}
      filters={[{ label: "Type", get: (c) => c.type }, { label: "Status", get: (c) => c.status }]}
      columns={[
        { key: "code", header: "Customer Code", render: (c) => <span className="font-semibold text-primary-700">{c.code}</span> },
        { key: "name", header: "Customer Name", render: (c) => <PersonCell name={c.name} sub={c.email} /> },
        { key: "contact", header: "Contact Person", render: (c) => c.contact },
        { key: "props", header: "Properties", render: (c) => c.properties },
        { key: "jobs", header: "Active Jobs", render: (c) => c.activeJobs },
        { key: "status", header: "Status", render: (c) => <StatusBadge status={c.status} /> },
      ]}
    />
  );
}
