"use client";

import { ListScreen } from "@/components/ListScreen";
import { PersonCell } from "@/components/PersonCell";
import { api } from "@/lib/api";
import type { Property } from "@/lib/mock";

export default function PropertiesPage() {
  return (
    <ListScreen<Property>
      crumbs={["Home", "Customers", "Properties"]}
      title="Properties"
      subtitle="One customer can own many properties — requests are raised per property."
      entity="Property"
      createHref="/owner/properties/new"
      editHref={() => "/owner/properties/new"}
      load={api.properties}
      search={{ placeholder: "Search property name or address…", text: (p) => `${p.name} ${p.address}` }}
      filters={[{ label: "Customer", get: (p) => p.customer }, { label: "Type", get: (p) => p.type }]}
      columns={[
        { key: "name", header: "Property Name", render: (p) => <span className="font-semibold text-ink">{p.name}</span> },
        { key: "customer", header: "Customer", render: (p) => <PersonCell name={p.customer} /> },
        { key: "type", header: "Type", render: (p) => p.type },
        { key: "address", header: "Address", render: (p) => p.address },
        { key: "jobs", header: "Active Jobs", render: (p) => p.activeJobs },
      ]}
    />
  );
}
