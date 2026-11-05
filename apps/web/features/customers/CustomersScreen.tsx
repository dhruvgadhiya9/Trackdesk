'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import {
  ApiError,
  createCustomer,
  listCustomers,
  unwrap,
  type Customer,
  type CustomerPage,
} from '@trackdesk/contracts';
import {
  Button,
  EmptyState,
  ErrorState,
  Input,
  LoadingState,
  Modal,
  PageHeader,
  Table,
  useToast,
} from '@trackdesk/ui';

type State =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; page: CustomerPage };

/**
 * Customers list + create (reference screen). Only @trackdesk/ui components and tokens; data via
 * the generated OpenAPI client. Loading, empty and error states per docs/prd/01-customers.md.
 */
export function CustomersScreen() {
  const [state, setState] = useState<State>({ kind: 'loading' });
  const [search, setSearch] = useState('');
  const [creating, setCreating] = useState(false);
  const toast = useToast();

  const load = useCallback(async (q: string) => {
    setState({ kind: 'loading' });
    try {
      setState({ kind: 'ready', page: unwrap(await listCustomers({ search: q || undefined })) });
    } catch (e) {
      setState({
        kind: 'error',
        message: e instanceof Error ? e.message : 'Failed to load customers',
      });
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => void load(search), 250);
    return () => clearTimeout(t);
  }, [search, load]);

  return (
    <>
      <PageHeader
        title="Customers"
        description="Organisations you service. Archived customers are hidden."
        actions={<Button onClick={() => setCreating(true)}>Add customer</Button>}
      />
      <div className="mb-4 max-w-sm">
        <Input
          label="Search customers"
          placeholder="Name contains…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {state.kind === 'loading' ? <LoadingState label="Loading customers" rows={5} /> : null}
      {state.kind === 'error' ? (
        <ErrorState description={state.message} onRetry={() => void load(search)} />
      ) : null}
      {state.kind === 'ready' && state.page.items.length === 0 ? (
        <EmptyState
          title={search ? 'No matching customers' : 'No customers yet'}
          description={
            search
              ? 'Try a different search.'
              : 'Add your first customer to start creating sites and jobs.'
          }
          action={
            search ? undefined : <Button onClick={() => setCreating(true)}>Add customer</Button>
          }
        />
      ) : null}
      {state.kind === 'ready' && state.page.items.length > 0 ? (
        <Table<Customer>
          caption="Customers"
          rows={state.page.items}
          rowKey={(c) => c.id}
          columns={[
            {
              key: 'name',
              header: 'Name',
              render: (c) => <span className="font-medium">{c.name}</span>,
            },
            { key: 'account', header: 'Account', render: (c) => c.accountNumber ?? '–' },
            { key: 'email', header: 'Email', render: (c) => c.email ?? '–' },
            { key: 'phone', header: 'Phone', render: (c) => c.phone ?? '–' },
            { key: 'city', header: 'City', render: (c) => c.billingAddress?.city ?? '–' },
          ]}
        />
      ) : null}

      <CreateCustomerModal
        open={creating}
        onClose={() => setCreating(false)}
        onCreated={(c) => {
          setCreating(false);
          toast(`Customer "${c.name}" created`, 'success');
          void load(search);
        }}
      />
    </>
  );
}

function CreateCustomerModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (c: Customer) => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get('name') ?? '');
    if (!name.trim()) {
      setErrors({ name: 'Name is required' });
      return;
    }
    setSubmitting(true);
    setErrors({});
    try {
      const created = unwrap(
        await createCustomer({
          name,
          email: String(form.get('email') ?? '') || undefined,
          phone: String(form.get('phone') ?? '') || undefined,
          billingAddress: {
            line1: String(form.get('line1') ?? '') || undefined,
            city: String(form.get('city') ?? '') || undefined,
            postcode: String(form.get('postcode') ?? '') || undefined,
          },
        }),
      );
      onCreated(created);
    } catch (err) {
      if (err instanceof ApiError && err.problem?.errors) {
        setErrors(Object.fromEntries(err.problem.errors.map((fe) => [fe.field, fe.message])));
      } else {
        setErrors({ form: err instanceof Error ? err.message : 'Could not create customer' });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} title="Add customer" onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <Input name="name" label="Name" required error={errors.name} autoFocus />
        <Input name="email" label="Email" type="email" error={errors.email} />
        <Input name="phone" label="Phone" error={errors.phone} />
        <Input name="line1" label="Address line 1" />
        <div className="grid grid-cols-2 gap-4">
          <Input name="city" label="City" />
          <Input name="postcode" label="Postcode" />
        </div>
        {errors.form ? (
          <p role="alert" className="text-sm text-danger-fg">
            {errors.form}
          </p>
        ) : null}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            Save customer
          </Button>
        </div>
      </form>
    </Modal>
  );
}
