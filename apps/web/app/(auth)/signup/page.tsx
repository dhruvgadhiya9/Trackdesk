'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { createTenant } from '@trackdesk/contracts';
import { Button, Card, Input } from '@trackdesk/ui';
import { supabase } from '@/lib/supabase';

/**
 * Sign up → create company (PRD 00). Step 1 creates the Supabase Auth user; step 2 calls
 * POST /v1/tenants, then refreshes the session so the JWT carries tenant_id/role.
 */
export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setError(undefined);
    try {
      const sb = supabase();
      const existing = (await sb.auth.getSession()).data.session;
      if (!existing) {
        const { error: err } = await sb.auth.signUp({
          email: String(form.get('email')),
          password: String(form.get('password')),
        });
        if (err) throw err;
      }
      await createTenant({
        name: String(form.get('company')),
        fullName: String(form.get('fullName')),
      });
      await sb.auth.refreshSession();
      router.replace('/owner');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-up failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <h1 className="mb-4 text-xl font-semibold">Create your company</h1>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Input name="fullName" label="Your name" required />
        <Input name="company" label="Company name" required minLength={2} />
        <Input name="email" type="email" label="Work email" required />
        <Input
          name="password"
          type="password"
          label="Password"
          required
          minLength={12}
          hint="At least 12 characters"
        />
        {error ? (
          <p role="alert" className="text-sm text-danger-fg">
            {error}
          </p>
        ) : null}
        <Button type="submit" loading={busy}>
          Create company
        </Button>
      </form>
    </Card>
  );
}
