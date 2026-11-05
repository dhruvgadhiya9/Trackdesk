'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingState } from '@trackdesk/ui';
import { useMe } from '@/lib/useMe';

const HOME: Record<string, string> = {
  company_owner: '/owner',
  ops_manager: '/ops',
  portal_owner: '/platform',
};

/** Routes the user to their role's home (customers use apps/customer, workers the mobile app). */
export default function Index() {
  const state = useMe();
  const router = useRouter();
  useEffect(() => {
    if (state.kind === 'anonymous' || state.kind === 'error') router.replace('/login');
    if (state.kind === 'ready') {
      if (!state.me.tenantId && state.me.role !== 'portal_owner') router.replace('/signup');
      else router.replace(HOME[state.me.role ?? ''] ?? '/login');
    }
  }, [state, router]);
  return (
    <div className="p-8">
      <LoadingState />
    </div>
  );
}
