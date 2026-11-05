import { EmptyState, PageHeader } from '@trackdesk/ui';

export default function OpsHome() {
  return (
    <>
      <PageHeader title="Today" description="Operations overview" />
      <EmptyState title="Jobs arrive in Sprint 2" description="Customers are available now." />
    </>
  );
}
