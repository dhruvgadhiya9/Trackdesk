'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import type { RoleName } from '@trackdesk/contracts';
import { AppShell, Avatar, ErrorState, LoadingState, Sidebar, type NavItem } from '@trackdesk/ui';
import { useMe } from '@/lib/useMe';

/**
 * Shell for a role route group. UI gating only — the API (Spring Security + RLS) is the real
 * enforcement. Users with the wrong role are sent to their own home.
 */
export function RoleShell({
  allowed,
  nav,
  children,
}: {
  allowed: RoleName[];
  nav: Omit<NavItem, 'active'>[];
  children: ReactNode;
}) {
  const state = useMe();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (state.kind === 'anonymous') router.replace('/login');
    if (state.kind === 'ready' && !state.me.tenantId) router.replace('/signup');
  }, [state, router]);

  if (state.kind === 'loading' || state.kind === 'anonymous') {
    return (
      <div className="p-8">
        <LoadingState />
      </div>
    );
  }
  if (state.kind === 'error') {
    return (
      <div className="p-8">
        <ErrorState description={state.message} onRetry={() => window.location.reload()} />
      </div>
    );
  }
  if (!state.me.role || !allowed.includes(state.me.role)) {
    return (
      <div className="p-8">
        <ErrorState title="No access" description="Your role cannot open this area." />
      </div>
    );
  }

  const items = nav.map((n) => ({
    ...n,
    active: pathname === n.href || pathname.startsWith(`${n.href}/`),
  }));
  return (
    <AppShell
      sidebar={
        <Sidebar
          items={items}
          brand={state.me.tenantName ?? 'TrackDesk'}
          renderLink={(item, className) => (
            <Link
              href={item.href}
              className={className}
              aria-current={item.active ? 'page' : undefined}
            >
              {item.label}
            </Link>
          )}
          footer={
            <div className="flex items-center gap-2 px-2 text-sm text-fg-muted">
              <Avatar name={state.me.fullName ?? state.me.email} size="sm" />
              <span className="truncate">{state.me.email}</span>
            </div>
          }
        />
      }
    >
      {children}
    </AppShell>
  );
}
