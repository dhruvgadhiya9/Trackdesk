import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-canvas p-4">
      <div className="w-full max-w-md">
        <p className="mb-6 text-center text-2xl font-bold text-fg">TrackDesk</p>
        {children}
      </div>
    </main>
  );
}
