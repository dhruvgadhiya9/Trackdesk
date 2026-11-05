import { Button, EmptyState, Screen } from '@trackdesk/ui-native';
import { supabase } from '../lib/supabase';

/**
 * Signed in but not a member of a company yet: the invitee must open the invite link (web) which
 * calls POST /v1/invitations/accept; then refreshing the session picks up the new claims.
 */
export function NoCompanyScreen({ email }: { email: string }) {
  return (
    <Screen>
      <EmptyState
        title="Waiting for your invitation"
        description={`${email} is not part of a company yet. Open the invitation email from your employer, then tap Refresh.`}
      />
      <Button title="Refresh" onPress={() => supabase.auth.refreshSession()} />
      <Button title="Sign out" variant="secondary" onPress={() => supabase.auth.signOut()} />
    </Screen>
  );
}
