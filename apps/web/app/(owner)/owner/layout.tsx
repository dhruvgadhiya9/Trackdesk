'use client';

import type { ReactNode } from 'react';
import { RoleShell } from '@/features/RoleShell';

export default function OwnerLayout({ children }: { children: ReactNode }) {
  return (
    <RoleShell
      allowed={['company_owner']}
      nav={[
        { href: '/owner', label: 'Overview' },
        { href: '/owner/customers', label: 'Customers' },
        { href: '/owner/team', label: 'Team' },
      ]}
    >
      {children}
    </RoleShell>
  );
}
