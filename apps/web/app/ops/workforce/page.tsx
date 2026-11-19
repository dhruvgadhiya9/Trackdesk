"use client";

// SECURITY-REVIEW-REQUIRED: geo-fenced attendance uses technician location data.
import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button, DataTable, EmptyState, PageHeader, Tabs } from "@trackdesk/ui";
import { PersonCell } from "@/components/PersonCell";
import { StatusBadge } from "@/components/StatusBadge";
import { attendance, leaveRequests, productivity, type LeaveRequest } from "@/lib/ops-mock";

const tabs = ["Attendance Review", "Leave Requests", "Productivity Monitoring", "Holiday Calendar"] as const;
const holidays = [
  { id: "h1", name: "Thanksgiving Day", date: "26 Nov 2026" },
  { id: "h2", name: "Christmas Day", date: "25 Dec 2026" },
  { id: "h3", name: "New Year's Day", date: "01 Jan 2027" },
];

export default function WorkforcePage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Attendance Review");
  const [leaves, setLeaves] = useState<LeaveRequest[]>(leaveRequests);
  const decide = (id: string, status: LeaveRequest["status"]) => setLeaves((s) => s.map((l) => (l.id === id ? { ...l, status } : l)));
  const pending = leaves.filter((l) => l.status === "Pending").length;
  return (
    <>
      <PageHeader crumbs={["Home", "Team", "Workforce"]} title="Workforce Management" subtitle="GPS geo-fenced attendance, leave and productivity. Payroll is out of scope." />
      <Tabs label="Workforce sections" tabs={tabs} value={tab} onChange={setTab} />
      {pending > 0 && <p className="m-0 text-sm font-semibold text-warning-700">{pending} leave request{pending === 1 ? "" : "s"} awaiting approval</p>}
      {tab === "Attendance Review" && (
        <DataTable caption="Attendance" rows={attendance} rowKey={(a) => a.id} columns={[
          { key: "emp", header: "Employee ID", render: (a) => <span className="font-semibold text-primary-700">{a.employeeId}</span> },
          { key: "name", header: "Name", render: (a) => <PersonCell name={a.name} /> },
          { key: "in", header: "Login Time", render: (a) => a.login },
          { key: "out", header: "Logout Time", render: (a) => a.logout },
          { key: "loc", header: "Location", render: (a) => a.location },
          { key: "status", header: "Attendance Status", render: (a) => <StatusBadge status={a.status} /> },
        ]} />
      )}
      {tab === "Leave Requests" && (
        <DataTable caption="Leave requests" rows={leaves} rowKey={(l) => l.id} columns={[
          { key: "emp", header: "Employee", render: (l) => <PersonCell name={l.employee} /> },
          { key: "type", header: "Leave Type", render: (l) => l.type },
          { key: "from", header: "From", render: (l) => l.from },
          { key: "to", header: "To", render: (l) => l.to },
          { key: "status", header: "Status", render: (l) => <StatusBadge status={l.status} /> },
          {
            key: "act",
            header: "Actions",
            align: "right",
            render: (l) =>
              l.status === "Pending" ? (
                <span className="inline-flex gap-1.5">
                  <Button size="sm" icon={<Check aria-hidden="true" className="size-3.5" />} onClick={() => decide(l.id, "Approved")}>Approve</Button>
                  <Button size="sm" variant="secondary" icon={<X aria-hidden="true" className="size-3.5" />} onClick={() => decide(l.id, "Rejected")}>Reject</Button>
                </span>
              ) : (
                <span className="text-subtle">—</span>
              ),
          },
        ]} />
      )}
      {tab === "Productivity Monitoring" && (
        <DataTable caption="Productivity" rows={productivity} rowKey={(p) => p.id} columns={[
          { key: "tech", header: "Technician", render: (p) => <PersonCell name={p.technician} /> },
          { key: "a", header: "Assigned", align: "right", render: (p) => p.assigned },
          { key: "c", header: "Completed", align: "right", render: (p) => p.completed },
          { key: "pct", header: "Completion", align: "right", render: (p) => `${Math.round((p.completed / p.assigned) * 100)}%` },
          { key: "r", header: "Rating", align: "right", render: (p) => `★ ${p.rating}` },
        ]} />
      )}
      {tab === "Holiday Calendar" && (
        holidays.length ? (
          <DataTable caption="Holidays" rows={holidays} rowKey={(h) => h.id} columns={[
            { key: "n", header: "Holiday", render: (h) => <span className="font-semibold text-ink">{h.name}</span> },
            { key: "d", header: "Date", render: (h) => h.date },
          ]} />
        ) : <EmptyState title="No holidays configured" />
      )}
    </>
  );
}
