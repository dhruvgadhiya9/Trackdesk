"use client";

import { useState } from "react";
import { Info, Save } from "lucide-react";
import { Button, PageHeader, Tabs } from "@trackdesk/ui";
import { permissionActions, permissionModules, permissionRoles } from "@/lib/mock";

// SECURITY-REVIEW-REQUIRED: role permission matrix. UI only — enforcement must live server-side.
type Role = (typeof permissionRoles)[number];
type Matrix = Record<string, Record<string, boolean>>;

function initial(role: Role): Matrix {
  return Object.fromEntries(
    permissionModules.map((m) => [
      m,
      Object.fromEntries(
        permissionActions.map((a) => [
          a,
          role === "Manager" ? a !== "Delete" || m !== "Invoice" : role === "Technician" ? a === "View" && m !== "Reports" : a !== "Delete" && a !== "Approve",
        ]),
      ),
    ]),
  );
}

export default function PermissionsPage() {
  const [role, setRole] = useState<Role>("Manager");
  const [matrix, setMatrix] = useState<Record<Role, Matrix>>({
    Manager: initial("Manager"),
    Technician: initial("Technician"),
    "Office Staff": initial("Office Staff"),
  });
  const [saved, setSaved] = useState(false);
  const toggle = (m: string, a: string) => {
    setSaved(false);
    setMatrix((s) => ({ ...s, [role]: { ...s[role], [m]: { ...s[role][m], [a]: !s[role][m]![a] } } }));
  };
  return (
    <>
      <PageHeader
        crumbs={["Home", "Organization", "Permission Matrix"]}
        title="Permission Matrix"
        subtitle="Control what each role can view, create, edit, delete and approve."
        actions={<Button icon={<Save aria-hidden="true" className="size-4" />} onClick={() => setSaved(true)}>Save Permissions</Button>}
      />
      <Tabs label="Role" tabs={permissionRoles} value={role} onChange={setRole} />
      <div className="overflow-x-auto rounded-xl border border-line bg-surface shadow-table">
        <table className="w-full border-collapse">
          <caption className="sr-only">Permissions for {role}</caption>
          <thead className="bg-surface-2">
            <tr>
              <th scope="col" className="border-b border-line-soft px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted">Module</th>
              {permissionActions.map((a) => (
                <th key={a} scope="col" className="border-b border-line-soft px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-muted">{a}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissionModules.map((m) => (
              <tr key={m} className="border-b border-line-soft last:border-0">
                <th scope="row" className="px-4 py-3.5 text-left text-sm font-semibold text-ink">{m}</th>
                {permissionActions.map((a) => (
                  <td key={a} className="px-4 py-3.5 text-center">
                    <input
                      type="checkbox"
                      aria-label={`${role}: ${a} ${m}`}
                      className="size-[18px] cursor-pointer accent-primary-600"
                      checked={matrix[role][m]![a]}
                      onChange={() => toggle(m, a)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p role="status" className="m-0 flex items-center gap-2 text-sm text-muted">
        <Info aria-hidden="true" className="size-4" />
        {saved ? "Saved. " : ""}Changes apply to every user with the selected role at their next sign-in.
      </p>
    </>
  );
}
