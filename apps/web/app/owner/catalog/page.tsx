"use client";

import { Badge } from "@trackdesk/ui";
import { ListScreen } from "@/components/ListScreen";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import type { Service } from "@/lib/mock";

export default function CatalogPage() {
  return (
    <ListScreen<Service>
      crumbs={["Home", "Services", "Service Catalog"]}
      title="Service Catalog"
      subtitle="Services, pricing, checklists and emergency charges."
      entity="Service"
      createHref="/owner/catalog/new"
      editHref={() => "/owner/catalog/new"}
      tabs={{ label: "Category", get: (s) => s.category, values: ["All", "HVAC", "Plumbing", "Electrical", "Solar", "Cleaning", "Facilities"] }}
      load={api.services}
      search={{ placeholder: "Search services…", text: (s) => s.name }}
      filters={[{ label: "Status", get: (s) => s.status }]}
      columns={[
        { key: "name", header: "Service Name", render: (s) => <span className="font-semibold text-ink">{s.name}</span> },
        { key: "cat", header: "Category", render: (s) => <Badge tone="primary">{s.category}</Badge> },
        { key: "base", header: "Base Price", align: "right", render: (s) => s.basePrice },
        { key: "emerg", header: "Emergency Price", align: "right", render: (s) => s.emergencyPrice },
        { key: "quote", header: "Quotation Required", render: (s) => (s.quotationRequired ? "Yes" : "No") },
        { key: "status", header: "Status", render: (s) => <StatusBadge status={s.status} /> },
      ]}
    />
  );
}
