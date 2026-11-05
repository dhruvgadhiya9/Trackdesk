import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { buildCustomerPage, buildDispatchBoard, buildJob } from '@trackdesk/contracts/mocks';
import type { Customer } from '@trackdesk/contracts';
import { Button } from '../components/Button';
import { Card, CardHeader, JobCard } from '../components/Card';
import { AppShell, PageHeader, Sidebar, Tabs } from '../components/Layout';
import { Modal, Toast, ToastProvider, useToast } from '../components/Overlay';
import { Calendar, MapPanel, TimelineRow, TimelineSlot } from '../components/Scheduling';
import { EmptyState, ErrorState, LoadingState } from '../components/States';
import { Table } from '../components/Table';
import { JOB_STATUSES } from '../components/Badge';

const meta: Meta = { title: 'Composites', parameters: { layout: 'padded' } };
export default meta;
type Story = StoryObj;

export const Cards: Story = {
  render: () => (
    <div className="grid max-w-3xl grid-cols-2 gap-4">
      <Card>
        <CardHeader
          title="Site details"
          actions={
            <Button size="sm" variant="secondary">
              Edit
            </Button>
          }
        />
        <p className="text-sm text-fg-muted">Main Building, LS1 4AP</p>
      </Card>
      {JOB_STATUSES.map((status) => (
        <JobCard
          key={status}
          reference="JOB-000123"
          title="6-monthly fire alarm service"
          siteName="Northside Academy - Main Building"
          status={status}
          timeRange="09:00-11:00"
          technicianName="Sam Patel"
        />
      ))}
      <JobCard reference="JOB-000124" status="scheduled" title="Compact" compact />
    </div>
  ),
};

export const DataTable: Story = {
  render: () => {
    const page = buildCustomerPage(6);
    return (
      <Table<Customer>
        caption="Customers"
        rows={page.items}
        rowKey={(c) => c.id}
        columns={[
          { key: 'name', header: 'Name', render: (c) => c.name },
          { key: 'email', header: 'Email', render: (c) => c.email ?? '-' },
          { key: 'city', header: 'City', render: (c) => c.billingAddress?.city ?? '-' },
        ]}
      />
    );
  },
};

export const States: Story = {
  render: () => (
    <div className="flex max-w-2xl flex-col gap-6">
      <LoadingState />
      <EmptyState
        title="No customers yet"
        description="Add your first customer to start creating sites and jobs."
        action={<Button>Add customer</Button>}
      />
      <ErrorState description="We could not load customers." onRetry={() => {}} />
    </div>
  ),
};

function ModalDemo() {
  const [open, setOpen] = useState(true);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal
        open={open}
        title="Add customer"
        onClose={() => setOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button>Save</Button>
          </>
        }
      >
        <p className="text-sm text-fg-muted">Modal body</p>
      </Modal>
    </>
  );
}
export const ModalDialog: Story = { render: () => <ModalDemo /> };

function ToastDemo() {
  const toast = useToast();
  return (
    <div className="flex gap-2">
      <Button onClick={() => toast('Saved', 'success')}>Success toast</Button>
      <Button variant="secondary" onClick={() => toast('Heads up', 'info')}>
        Info toast
      </Button>
      <Button variant="danger" onClick={() => toast('Failed to save', 'danger')}>
        Danger toast
      </Button>
    </div>
  );
}
export const Toasts: Story = {
  render: () => (
    <ToastProvider>
      <div className="flex flex-col gap-3">
        <Toast message="Static info" tone="info" />
        <Toast message="Static success" tone="success" />
        <Toast message="Static danger" tone="danger" />
        <ToastDemo />
      </div>
    </ToastProvider>
  ),
};

export const TabsStory: Story = {
  name: 'Tabs',
  render: () => (
    <Tabs
      tabs={[
        { id: 'sites', label: 'Sites', content: <p className="text-sm">Sites tab</p> },
        { id: 'jobs', label: 'Jobs', content: <p className="text-sm">Jobs tab</p> },
        {
          id: 'certs',
          label: 'Certificates',
          content: <p className="text-sm">Certificates tab</p>,
        },
      ]}
    />
  ),
};

export const Shell: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <AppShell
      sidebar={
        <Sidebar
          items={[
            { href: '#', label: 'Dashboard' },
            { href: '#', label: 'Customers', active: true },
            { href: '#', label: 'Dispatch' },
          ]}
        />
      }
    >
      <PageHeader
        title="Customers"
        description="Organisations you service"
        actions={<Button>Add customer</Button>}
      />
      <EmptyState title="No customers yet" />
    </AppShell>
  ),
};

export const DispatchPieces: Story = {
  render: () => {
    const board = buildDispatchBoard(3, 2);
    const hours = Array.from({ length: 10 }, (_, i) => i + 8);
    return (
      <div className="flex flex-col gap-6">
        <div className="rounded-lg border border-border bg-bg-surface">
          {board.technicians.map((t, i) => (
            <TimelineRow
              key={t.id}
              header={t.fullName}
              hours={hours}
              renderSlot={(h) => (
                <TimelineSlot label={`${t.fullName} ${h}:00`} available={h < 17}>
                  {h === 9 + i ? (
                    <JobCard compact reference={buildJob().reference} status="dispatched" />
                  ) : null}
                </TimelineSlot>
              )}
            />
          ))}
        </div>
        <MapPanel
          markers={[
            {
              id: '1',
              label: 'Sam (technician)',
              latitude: 53.8,
              longitude: -1.55,
              kind: 'technician',
            },
            { id: '2', label: 'Northside Academy', latitude: 53.82, longitude: -1.5, kind: 'site' },
            { id: '3', label: 'Oakwood Retail', latitude: 53.78, longitude: -1.6, kind: 'site' },
          ]}
        />
        <Calendar
          year={2026}
          month={10}
          renderDay={(d) =>
            d.getUTCDate() === 15 ? <p className="text-xs text-primary">BS 5839 service</p> : null
          }
        />
      </div>
    );
  },
};
