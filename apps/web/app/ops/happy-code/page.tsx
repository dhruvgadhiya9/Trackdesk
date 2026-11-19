"use client";

// SECURITY-REVIEW-REQUIRED: service verification. Manager override must be authorised server-side and audit-logged.
import { useState } from "react";
import { AlertTriangle, CheckCircle2, Clock, KeyRound } from "lucide-react";
import { Button } from "@trackdesk/ui";
import { ListScreen } from "@/components/ListScreen";
import { OverrideModal } from "@/components/ops/OverrideModal";
import { PersonCell } from "@/components/PersonCell";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import type { OpsJob } from "@/lib/ops-mock";

export default function HappyCodePage() {
  const [overrideJob, setOverrideJob] = useState<string | null>(null);
  return (
    <>
      <ListScreen<OpsJob>
        crumbs={["Home", "Jobs", "Happy Code"]}
        title="Service Verification Monitoring"
        subtitle="Happy Code replaces customer signature: system generates code → customer shares → service verified → job closed."
        entity="Job"
        canDelete={false}
        rowHref={(j) => `/ops/jobs/${j.id}`}
        kpis={[
          { label: "Verified Today", value: "7", icon: <CheckCircle2 className="size-5" />, tone: "success" },
          { label: "Awaiting Code", value: "3", icon: <Clock className="size-5" />, tone: "warning" },
          { label: "Manager Overrides", value: "1", icon: <KeyRound className="size-5" />, tone: "violet" },
          { label: "Expired", value: "1", icon: <AlertTriangle className="size-5" />, tone: "danger" },
        ]}
        load={api.opsJobs}
        filters={[{ label: "Happy Code", get: (j) => j.happyCode }]}
        columns={[
          { key: "no", header: "Job Number", render: (j) => <span className="font-semibold text-primary-700">{j.number}</span> },
          { key: "customer", header: "Customer", render: (j) => j.customer },
          { key: "tech", header: "Technician", render: (j) => <PersonCell name={j.technician} /> },
          { key: "hc", header: "Happy Code Status", render: (j) => <StatusBadge status={j.happyCode} /> },
          { key: "date", header: "Verification Date", render: (j) => j.verifiedAt ?? "—" },
          { key: "method", header: "Verification Method", render: (j) => j.verifyMethod ?? "—" },
          {
            key: "act",
            header: "Override",
            render: (j) =>
              j.happyCode === "Expired" || j.happyCode === "Generated" ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOverrideJob(j.number);
                  }}
                >
                  Override
                </Button>
              ) : (
                <span className="text-subtle">—</span>
              ),
          },
        ]}
      />
      <OverrideModal job={overrideJob} onClose={() => setOverrideJob(null)} />
    </>
  );
}
