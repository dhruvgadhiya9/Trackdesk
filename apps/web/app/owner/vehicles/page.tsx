"use client";

import { Car, ShieldAlert, UserCheck, Wrench } from "lucide-react";
import { ListScreen } from "@/components/ListScreen";
import { PersonCell } from "@/components/PersonCell";
import { api } from "@/lib/api";
import type { Vehicle } from "@/lib/mock";

export default function VehiclesPage() {
  return (
    <ListScreen<Vehicle>
      crumbs={["Home", "Operations", "Vehicles"]}
      title="Vehicle Management"
      subtitle="Vehicles with built-in GPS: route history, distance and utilization."
      entity="Vehicle"
      kpis={[
        { label: "Vehicles", value: "24", icon: <Car className="size-5" /> },
        { label: "Assigned", value: "21", icon: <UserCheck className="size-5" />, tone: "success" },
        { label: "Service Due (30d)", value: "3", icon: <Wrench className="size-5" />, tone: "warning" },
        { label: "Insurance Expiring", value: "2", icon: <ShieldAlert className="size-5" />, tone: "danger" },
      ]}
      load={api.vehicles}
      search={{ placeholder: "Search vehicle number…", text: (v) => `${v.number} ${v.type}` }}
      filters={[{ label: "Type", get: (v) => v.type }, { label: "Branch", get: (v) => v.branch }]}
      columns={[
        { key: "no", header: "Vehicle Number", render: (v) => <span className="font-semibold text-ink">{v.number}</span> },
        { key: "type", header: "Type", render: (v) => v.type },
        { key: "branch", header: "Branch", render: (v) => v.branch },
        { key: "assigned", header: "Assigned To", render: (v) => <PersonCell name={v.assignedTo} /> },
        { key: "ins", header: "Insurance Expiry", render: (v) => v.insuranceExpiry },
        { key: "svc", header: "Service Due", render: (v) => v.serviceDue },
        { key: "dist", header: "Distance (Nov)", align: "right", render: (v) => v.distance },
      ]}
    />
  );
}
