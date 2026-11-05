'use client';

import type { ReactNode } from 'react';
import { RoleShell } from '@/features/RoleShell';

/** Platform admin (portal_owner): tenants, feature flags. Never tenant business data. */
export default function PlatformLayout({ children }: { children: ReactNode }) {
  return (
    <RoleShell allowed={['portal_owner']} nav={[{ href: '/platform', label: 'Tenants' }]}>
      {children}
    </RoleShell>
  );
}
