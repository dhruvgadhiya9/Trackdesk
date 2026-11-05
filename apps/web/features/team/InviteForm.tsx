'use client';

import { useState, type FormEvent } from 'react';
import { ApiError, createInvitation, type CreateInvitationRequestRole } from '@trackdesk/contracts';
import { Button, Card, CardHeader, Input, Select, useToast } from '@trackdesk/ui';

/** Invite a worker or manager (POST /v1/invitations). The token is emailed, never shown. */
export function InviteForm() {
  const toast = useToast();
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    setBusy(true);
    setError(undefined);
    try {
      await createInvitation({
        email: String(form.get('email')),
        role: String(form.get('role')) as CreateInvitationRequestRole,
      });
      toast('Invitation sent', 'success');
      formEl.reset();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not send invitation');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="max-w-lg">
      <CardHeader title="Invite a team member" />
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Input name="email" type="email" label="Email" required error={error} />
        <Select
          name="role"
          label="Role"
          defaultValue="field_worker"
          options={[
            { value: 'field_worker', label: 'Field worker' },
            { value: 'ops_manager', label: 'Operations manager' },
            { value: 'company_owner', label: 'Company owner' },
          ]}
        />
        <Button type="submit" loading={busy}>
          Send invitation
        </Button>
      </form>
    </Card>
  );
}
