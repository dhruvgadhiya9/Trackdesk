'use client';

import type { ReactNode } from 'react';
import { configureApiClient } from '@trackdesk/contracts';
import { ToastProvider } from '@trackdesk/ui';
import { supabase } from '@/lib/supabase';

if (typeof window !== 'undefined') {
  configureApiClient({
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080',
    getAccessToken: async () => (await supabase().auth.getSession()).data.session?.access_token,
  });
}

export function Providers({ children }: { children: ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
