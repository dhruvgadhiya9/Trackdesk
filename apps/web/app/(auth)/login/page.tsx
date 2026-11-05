'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Button, Card, Input } from '@trackdesk/ui';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    const { error: err } = await supabase().auth.signInWithPassword({
      email: String(form.get('email')),
      password: String(form.get('password')),
    });
    setBusy(false);
    if (err) setError(err.message);
    else router.replace('/');
  }

  return (
    <Card>
      <h1 className="mb-4 text-xl font-semibold">Sign in</h1>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Input name="email" type="email" label="Email" autoComplete="email" required />
        <Input
          name="password"
          type="password"
          label="Password"
          autoComplete="current-password"
          required
          error={error}
        />
        <Button type="submit" loading={busy}>
          Sign in
        </Button>
      </form>
      <p className="mt-4 text-sm text-fg-muted">
        New contractor?{' '}
        <Link className="text-fg-link" href="/signup">
          Create your company
        </Link>
      </p>
    </Card>
  );
}
