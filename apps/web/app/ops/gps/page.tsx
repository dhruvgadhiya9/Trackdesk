"use client";

// SECURITY-REVIEW-REQUIRED: technician location data. One-off snapshot requests only — no continuous tracking (GDPR).
import { useState } from "react";
import { MapPin } from "lucide-react";
import { Button, Card, CardHeader } from "@trackdesk/ui";
import { ListScreen } from "@/components/ListScreen";
import { PersonCell } from "@/components/PersonCell";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import type { GpsRequest } from "@/lib/ops-mock";
import { RequestLocationModal } from "@/components/ops/RequestLocationModal";

export default function GpsPage() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <ListScreen<GpsRequest>
        crumbs={["Home", "Team", "GPS Requests"]}
        title="GPS Location Requests"
        subtitle="Continuous tracking is disabled for GDPR. Request a technician’s location — they can share it or reject with a mandatory reason."
        entity="Request"
        canDelete={false}
        headerActions={<Button icon={<MapPin aria-hidden="true" className="size-4" />} onClick={() => setOpen(true)}>Request Location</Button>}
        load={api.gpsRequests}
        filters={[{ label: "Status", get: (g) => g.status }]}
        columns={[
          { key: "tech", header: "Technician", render: (g) => <PersonCell name={g.technician} /> },
          { key: "date", header: "Request Date", render: (g) => g.requested },
          { key: "status", header: "Status", render: (g) => <StatusBadge status={g.status} /> },
          { key: "resp", header: "Response Time", render: (g) => g.responseTime },
          { key: "reason", header: "Reason", render: (g) => g.reason },
        ]}
        aside={
          <Card>
            <CardHeader title="Shared Location" subtitle="Snapshot, not live" />
            <div className="relative mb-4 flex h-40 items-center justify-center overflow-hidden rounded-lg bg-surface-3" role="img" aria-label="Map snapshot near Main St. Home">
              <MapPin aria-hidden="true" className="size-8 text-primary-600" />
            </div>
            <dl className="m-0 grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-xs font-semibold uppercase tracking-wider text-muted">Technician</dt><dd className="m-0 font-semibold text-ink">James Carter</dd></div>
              <div><dt className="text-xs font-semibold uppercase tracking-wider text-muted">Shared at</dt><dd className="m-0 font-semibold text-ink">09:21</dd></div>
              <div><dt className="text-xs font-semibold uppercase tracking-wider text-muted">Accuracy</dt><dd className="m-0 font-semibold text-ink">± 12 m</dd></div>
              <div><dt className="text-xs font-semibold uppercase tracking-wider text-muted">Near</dt><dd className="m-0 font-semibold text-ink">Main St. Home</dd></div>
            </dl>
          </Card>
        }
      />
      <RequestLocationModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
