import type { ReactNode } from "react";
import { AppShell } from "@/components/AppShell";
import { platformUser } from "@/lib/platform-mock";

export default function PlatformLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell root="/platform" appLabel="Platform Owner" app="platform" user={{ name: platformUser.name, subtitle: platformUser.role }}>
      {children}
    </AppShell>
  );
}
