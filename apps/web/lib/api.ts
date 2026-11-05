import { configureApiClient } from '@trackdesk/contracts';
import { supabase } from './supabase';

export const MOCKS_ENABLED = process.env.NEXT_PUBLIC_API_MOCKS === '1';

/**
 * Wires the generated OpenAPI client. With NEXT_PUBLIC_API_MOCKS=1 requests are answered from the
 * synthetic factories in @trackdesk/contracts/mocks (loaded lazily so they never ship otherwise).
 */
export function configureApi(): void {
  if (typeof window === 'undefined') return;
  configureApiClient({
    baseUrl: MOCKS_ENABLED ? '' : (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'),
    getAccessToken: async () =>
      MOCKS_ENABLED ? 'mock' : (await supabase().auth.getSession()).data.session?.access_token,
    fetchImpl: MOCKS_ENABLED
      ? async (input, init) => (await import('./mockApi')).mockFetch(String(input), init)
      : undefined,
  });
}
