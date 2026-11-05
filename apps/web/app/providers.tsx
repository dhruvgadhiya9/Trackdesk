'use client';

import type { ReactNode } from 'react';
import { ToastProvider } from '@trackdesk/ui';
import { configureApi } from '@/lib/api';

configureApi();

export function Providers({ children }: { children: ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
