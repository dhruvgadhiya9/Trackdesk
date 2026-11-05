import { EmptyState, PageHeader } from '@trackdesk/ui';

/** Sprint 3: build from Figma "Ops / Dispatch Board" using docs/09-figma-to-code.md. */
export default function DispatchPage() {
  return (
    <>
      <PageHeader title="Dispatch board" />
      <EmptyState
        title="Dispatch board arrives in Sprint 3"
        description="Timeline per technician, unassigned queue and live map."
      />
    </>
  );
}
