import { Card, CardHeader, PageHeader } from '@trackdesk/ui';

export default function OwnerHome() {
  return (
    <>
      <PageHeader title="Overview" description="Company owner dashboard" />
      <div className="grid grid-cols-3 gap-4">
        {['Jobs today', 'Overdue maintenance', 'SLA compliance'].map((t) => (
          <Card key={t}>
            <CardHeader title={t} />
            <p className="text-sm text-fg-muted">Reporting arrives in Sprint 6.</p>
          </Card>
        ))}
      </div>
    </>
  );
}
