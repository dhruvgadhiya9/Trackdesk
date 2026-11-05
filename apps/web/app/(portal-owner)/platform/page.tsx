import { EmptyState, PageHeader } from '@trackdesk/ui';

export default function PlatformHome() {
  return (
    <>
      <PageHeader title="Tenants" description="Platform administration" />
      <EmptyState
        title="Platform admin is not in v1 scope yet"
        description="Tenant list and per-tenant feature flags need a PRD (portal_owner provisioning is a human process)."
      />
    </>
  );
}
