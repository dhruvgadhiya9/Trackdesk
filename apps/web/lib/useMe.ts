'use client';

import { useEffect, useState } from 'react';
import { getMe, unwrap, type Me } from '@trackdesk/contracts';

export type MeState =
  | { kind: 'loading' }
  | { kind: 'anonymous' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; me: Me };

/** Loads the current user (GET /v1/me). 401 => anonymous. */
export function useMe(): MeState {
  const [state, setState] = useState<MeState>({ kind: 'loading' });
  useEffect(() => {
    let cancelled = false;
    getMe()
      .then((r) => !cancelled && setState({ kind: 'ready', me: unwrap(r) }))
      .catch((e: { status?: number; message?: string }) => {
        if (cancelled) return;
        setState(
          e.status === 401
            ? { kind: 'anonymous' }
            : { kind: 'error', message: e.message ?? 'Failed' },
        );
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return state;
}
