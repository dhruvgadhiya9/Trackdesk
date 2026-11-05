import { useCallback, useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { ApiError, listMyJobs, unwrap, type Job } from '@trackdesk/contracts';
import {
  Button,
  EmptyState,
  ErrorState,
  JobListItem,
  LoadingState,
  Screen,
  Text,
  TrackingIndicator,
} from '@trackdesk/ui-native';
import { supabase } from '../lib/supabase';

type State =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; jobs: Job[] };

const time = (iso?: string) =>
  iso ? new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '';

/** Today's jobs (Sprint 4 completes execution, offline cache and tracking). */
export function TodayScreen() {
  const [state, setState] = useState<State>({ kind: 'loading' });

  const load = useCallback(async () => {
    setState({ kind: 'loading' });
    try {
      const jobs = unwrap(await listMyJobs());
      setState({ kind: 'ready', jobs });
    } catch (e) {
      const message =
        e instanceof ApiError && e.status === 501
          ? 'Job list arrives in Sprint 4.'
          : e instanceof Error
            ? e.message
            : 'Unknown error';
      setState({ kind: 'error', message });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <Screen>
      <Text variant="title">Today</Text>
      <TrackingIndicator active={false} />
      {state.kind === 'loading' ? <LoadingState /> : null}
      {state.kind === 'error' ? <ErrorState message={state.message} onRetry={load} /> : null}
      {state.kind === 'ready' && state.jobs.length === 0 ? (
        <EmptyState title="No jobs today" description="New assignments appear here." />
      ) : null}
      {state.kind === 'ready' && state.jobs.length > 0 ? (
        <FlatList
          data={state.jobs}
          keyExtractor={(j) => j.id}
          renderItem={({ item }) => (
            <JobListItem
              reference={item.reference}
              title={item.title}
              siteName={item.siteName}
              status={item.status}
              timeRange={`${time(item.scheduledStart)}–${time(item.scheduledEnd)}`}
            />
          )}
        />
      ) : null}
      <Button title="Sign out" variant="secondary" onPress={() => supabase.auth.signOut()} />
    </Screen>
  );
}
