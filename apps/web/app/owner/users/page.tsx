"use client";

import { HardHat, UserCog, UserX, Users } from "lucide-react";
import { ListScreen } from "@/components/ListScreen";
import { PersonCell } from "@/components/PersonCell";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import type { User } from "@/lib/mock";

export default function UsersPage() {
  return (
    <ListScreen<User>
      crumbs={["Home", "Organization", "Users"]}
      title="User Management"
      subtitle="Everyone who can sign in to TrackDesk."
      entity="User"
      createHref="/owner/users/new"
      editHref={(u) => `/owner/users/${u.id}`}
      kpis={[
        { label: "Total Users", value: "58", delta: "+4", icon: <Users className="size-5" /> },
        { label: "Managers", value: "6", icon: <UserCog className="size-5" />, tone: "violet" },
        { label: "Technicians", value: "46", icon: <HardHat className="size-5" />, tone: "info" },
        { label: "Inactive", value: "6", icon: <UserX className="size-5" />, tone: "neutral" },
      ]}
      load={api.users}
      search={{ placeholder: "Search name or employee ID…", text: (u) => `${u.name} ${u.employeeId}` }}
      filters={[{ label: "Role", get: (u) => u.role }, { label: "Status", get: (u) => u.status }]}
      columns={[
        { key: "emp", header: "Employee ID", render: (u) => <span className="font-semibold text-primary-700">{u.employeeId}</span> },
        { key: "name", header: "Employee Name", render: (u) => <PersonCell name={u.name} /> },
        { key: "role", header: "Role", render: (u) => u.role },
        { key: "designation", header: "Designation", render: (u) => u.designation },
        { key: "mobile", header: "Mobile Number", render: (u) => u.mobile },
        { key: "email", header: "Email", render: (u) => u.email },
        { key: "status", header: "Status", render: (u) => <StatusBadge status={u.status} /> },
        { key: "created", header: "Created", render: (u) => u.created },
      ]}
    />
  );
}
