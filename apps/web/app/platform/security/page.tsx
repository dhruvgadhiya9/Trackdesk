"use client";

// SECURITY-REVIEW-REQUIRED: cross-tenant session data (IPs, devices) and forced sign-out. Super-admin only, audit-logged.
import { useMemo, useState } from "react";
import { LogOut } from "lucide-react";
import { Button, DataTable, EmptyState, ErrorState, FilterSelect, Modal, PageHeader, SearchInput, TableSkeleton, Tabs } from "@trackdesk/ui";
import { PersonCell } from "@/components/PersonCell";
import { api } from "@/lib/api";
import { sessions as seedSessions } from "@/lib/platform-mock";
import { useQuery } from "@/lib/useQuery";

const tabs = ["Session Monitoring", "Activity Logs"] as const;

function ActivityLogs() {
  const { state, retry } = useQuery(api.auditLog);
  const [q, setQ] = useState("");
  const [company, setCompany] = useState("All");
  const rows = useMemo(() => (state.status === "success" ? state.data : []), [state]);
  const visible = rows.filter(
    (l) => (company === "All" || l.company === company) && `${l.action} ${l.user} ${l.module}`.toLowerCase().includes(q.trim().toLowerCase()),
  );
  if (state.status === "loading") return <TableSkeleton />;
  if (state.status === "error") return <ErrorState message={state.error} onRetry={retry} />;
  return (
    <>
      <div className="flex flex-wrap items-center gap-2.5">
        <SearchInput placeholder="Search activity…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-[400px]" />
        <FilterSelect label="Company" options={["All", ...new Set(rows.map((r) => r.company))]} value={company} onChange={setCompany} />
      </div>
      {visible.length === 0 ? (
        <EmptyState title="No matching activity" message="Try a different search or company." />
      ) : (
        <DataTable
          caption="Audit log"
          rows={visible}
          rowKey={(l) => l.id}
          columns={[
            { key: "d", header: "Date", render: (l) => l.date },
            { key: "u", header: "User", render: (l) => <PersonCell name={l.user} /> },
            { key: "c", header: "Company", render: (l) => l.company },
            { key: "m", header: "Module", render: (l) => l.module },
            { key: "a", header: "Action Performed", render: (l) => <span className="font-semibold text-ink">{l.action}</span> },
            { key: "ip", header: "IP Address", render: (l) => <code className="text-xs">{l.ip}</code> },
          ]}
        />
      )}
    </>
  );
}

export default function SecurityPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Session Monitoring");
  const [sessions, setSessions] = useState(seedSessions);
  const [target, setTarget] = useState<(typeof seedSessions)[number] | null>(null);

  return (
    <>
      <PageHeader crumbs={["Home", "Platform", "Security"]} title="Security" subtitle="Active sessions and audit trail across the platform." />
      <Tabs label="Security sections" tabs={tabs} value={tab} onChange={setTab} />
      {tab === "Activity Logs" ? (
        <ActivityLogs />
      ) : sessions.length === 0 ? (
        <EmptyState title="No active sessions" />
      ) : (
        <DataTable
          caption="Active sessions"
          rows={sessions}
          rowKey={(s) => s.id}
          columns={[
            { key: "u", header: "User", render: (s) => <PersonCell name={s.user} /> },
            { key: "c", header: "Company", render: (s) => s.company },
            { key: "t", header: "Login Time", render: (s) => s.login },
            { key: "d", header: "Device", render: (s) => s.device },
            { key: "ip", header: "IP Address", render: (s) => <code className="text-xs">{s.ip}</code> },
            {
              key: "a",
              header: "Actions",
              align: "right",
              render: (s) => (
                <Button variant="secondary" size="sm" icon={<LogOut aria-hidden="true" className="size-3.5" />} onClick={() => setTarget(s)}>
                  End session
                </Button>
              ),
            },
          ]}
        />
      )}
      <Modal
        open={!!target}
        title="End this session?"
        onClose={() => setTarget(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (target) setSessions((s) => s.filter((x) => x.id !== target.id));
                setTarget(null);
              }}
            >
              End session
            </Button>
          </>
        }
      >
        <p className="m-0 text-sm text-ink-2">
          {target?.user} ({target?.company}) will be signed out on {target?.device} and must sign in again.
        </p>
      </Modal>
    </>
  );
}
