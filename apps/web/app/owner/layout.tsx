import type { ReactNode } from "react";
import { AppShell } from "@/components/AppShell";
import { branches, currentUser } from "@/lib/mock";

export default function OwnerLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell
      root="/owner"
      appLabel="Company Owner"
      app="owner"
      user={{ name: currentUser.name, subtitle: `${currentUser.role} · ${currentUser.company}` }}
      branches={["All Branches", ...branches.map((b) => b.name)]}
    >
      {children}
    </AppShell>
  );
}
