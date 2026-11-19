"use client";

import { useState } from "react";
import { Card, CardHeader, Button, Modal, SelectField } from "@trackdesk/ui";
import { ListScreen } from "@/components/ListScreen";
import { PersonCell } from "@/components/PersonCell";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import { opsVehicles, technicians, type OpsVehicle } from "@/lib/ops-mock";

export default function OpsVehiclesPage() {
  const [assignOpen, setAssignOpen] = useState(false);
  const v = opsVehicles[0]!;
  const details: [string, string][] = [
    ["Registration Number", v.number],
    ["Insurance Expiry", v.insurance],
    ["Service Due Date", v.serviceDue],
    ["Distance (Nov)", v.distance],
    ["Utilization", v.utilization],
    ["Fuel", v.fuel],
  ];
  return (
    <>
      <ListScreen<OpsVehicle>
        crumbs={["Home", "Team", "Vehicles"]}
        title="Vehicle Allocation"
        subtitle="Assign vehicles to technicians or teams."
        entity="Vehicle"
        canDelete={false}
        headerActions={<Button onClick={() => setAssignOpen(true)}>Assign Vehicle</Button>}
        load={api.opsVehicles}
        filters={[{ label: "Status", get: (x) => x.status }]}
        columns={[
          { key: "no", header: "Vehicle Number", render: (x) => <span className="font-semibold text-ink">{x.number}</span> },
          { key: "type", header: "Vehicle Type", render: (x) => x.type },
          { key: "tech", header: "Assigned Technician", render: (x) => <PersonCell name={x.technician} /> },
          { key: "branch", header: "Branch", render: (x) => x.branch },
          { key: "status", header: "Status", render: (x) => <StatusBadge status={x.status} /> },
        ]}
        aside={
          <Card>
            <CardHeader title="Vehicle Details" subtitle="Built-in GPS · route history" />
            <dl className="m-0 grid grid-cols-2 gap-4">
              {details.map(([k, val]) => (
                <div key={k}>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{k}</dt>
                  <dd className="m-0 text-sm font-semibold text-ink">{val}</dd>
                </div>
              ))}
            </dl>
          </Card>
        }
      />
      <Modal
        open={assignOpen}
        title="Assign vehicle"
        onClose={() => setAssignOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setAssignOpen(false)}>Cancel</Button>
            <Button onClick={() => setAssignOpen(false)}>Assign</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <SelectField label="Vehicle" required options={opsVehicles.filter((x) => x.status === "Available").map((x) => `${x.number} · ${x.type}`)} />
          <SelectField label="Technician" required options={technicians.map((t) => t.name)} />
        </div>
      </Modal>
    </>
  );
}
