import type { ReactNode } from "react";
import { AppShell } from "@/components/AppShell";
import { opsUser } from "@/lib/ops-mock";

export default function OpsLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell root="/ops" appLabel="Operations Manager" app="ops" user={{ name: opsUser.name, subtitle: `Ops Manager · ${opsUser.branch}` }}>
      {children}
    </AppShell>
  );
}
