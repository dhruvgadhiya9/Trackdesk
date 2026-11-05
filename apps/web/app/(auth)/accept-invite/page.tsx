'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState, type FormEvent } from 'react';
import { acceptInvitation, ApiError } from '@trackdesk/contracts';
import { Button, Card, ErrorState, Input, LoadingState } from '@trackdesk/ui';
import { supabase } from '@/lib/supabase';

function AcceptInvite() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get('token');
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  if (!token)
    return <ErrorState title="Invalid link" description="This invitation link is incomplete." />;

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setError(undefined);
    try {
      const sb = supabase();
      const email = String(form.get('email'));
      const password = String(form.get('password'));
      const signIn = await sb.auth.signInWithPassword({ email, password });
      if (signIn.error) {
        const signUp = await sb.auth.signUp({ email, password });
        if (signUp.error) throw signUp.error;
      }
      await acceptInvitation({ token: token!, fullName: String(form.get('fullName')) });
      await sb.auth.refreshSession();
      router.replace('/');
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 410
          ? 'This invitation has expired or was already used. Ask for a new one.'
          : err instanceof Error
            ? err.message
            : 'Could not accept the invitation',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <h1 className="mb-4 text-xl font-semibold">Join your company</h1>
      <p className="mb-4 text-sm text-fg-muted">
        Use the email address the invitation was sent to. Field workers then sign in on the mobile
        app.
      </p>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Input name="fullName" label="Your name" required />
        <Input name="email" type="email" label="Email" required />
        <Input name="password" type="password" label="Password" required minLength={12} />
        {error ? (
          <p role="alert" className="text-sm text-danger-fg">
            {error}
          </p>
        ) : null}
        <Button type="submit" loading={busy}>
          Accept invitation
        </Button>
      </form>
    </Card>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <AcceptInvite />
    </Suspense>
  );
}
