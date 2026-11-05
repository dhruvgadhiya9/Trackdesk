import { configureApiClient } from '@trackdesk/contracts';
import { supabase } from './supabase';

/** Wires the generated OpenAPI client to the API base URL and the Supabase session token. */
export function configureApi(): void {
  configureApiClient({
    baseUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:8080',
    getAccessToken: async () => (await supabase.auth.getSession()).data.session?.access_token,
  });
}
