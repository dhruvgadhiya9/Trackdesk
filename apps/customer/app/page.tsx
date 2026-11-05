'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ApiError, getPortalSummary, unwrap, type PortalSummary } from '@trackdesk/contracts';
import { Card, CardHeader, EmptyState, ErrorState, LoadingState, PageHeader } from '@trackdesk/ui';

type State =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'pending' }
  | { kind: 'ready'; summary: PortalSummary };

/** Customer portal home (PRD 16). The API endpoint is scaffolded (501) until Sprint 5. */
export default function PortalHome() {
  const [state, setState] = useState<State>({ kind: 'loading' });
  const router = useRouter();

  useEffect(() => {
    getPortalSummary()
      .then((r) => setState({ kind: 'ready', summary: unwrap(r) }))
      .catch((e) => {
        if (e instanceof ApiError && e.status === 401) router.replace('/login');
        else if (e instanceof ApiError && e.status === 501) setState({ kind: 'pending' });
        else setState({ kind: 'error', message: e instanceof Error ? e.message : 'Failed' });
      });
  }, [router]);

  return (
    <main className="mx-auto max-w-content p-8">
      <PageHeader title="Your sites" description="Servicing history and compliance certificates" />
      {state.kind === 'loading' ? <LoadingState /> : null}
      {state.kind === 'error' ? <ErrorState description={state.message} /> : null}
      {state.kind === 'pending' ? (
        <EmptyState
          title="Customer portal arrives in Sprint 5"
          description="Sites, job history, upcoming maintenance and certificates."
        />
      ) : null}
      {state.kind === 'ready' ? (
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader title="Sites" />
            <p className="text-3xl font-semibold">{state.summary.siteCount}</p>
          </Card>
          <Card>
            <CardHeader title="Assets" />
            <p className="text-3xl font-semibold">{state.summary.assetCount}</p>
          </Card>
        </div>
      ) : null}
    </main>
  );
}
