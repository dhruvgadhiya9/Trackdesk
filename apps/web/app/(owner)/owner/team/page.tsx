import { PageHeader } from '@trackdesk/ui';
import { InviteForm } from '@/features/team/InviteForm';

export default function OwnerTeamPage() {
  return (
    <>
      <PageHeader title="Team" description="Invite field workers and operations managers." />
      <InviteForm />
    </>
  );
}
