'use client';

import type { ReactNode } from 'react';
import { RoleShell } from '@/features/RoleShell';

export default function OpsLayout({ children }: { children: ReactNode }) {
  return (
    <RoleShell
      allowed={['ops_manager', 'company_owner']}
      nav={[
        { href: '/ops', label: 'Today' },
        { href: '/ops/customers', label: 'Customers' },
        { href: '/ops/dispatch', label: 'Dispatch' },
      ]}
    >
      {children}
    </RoleShell>
  );
}
