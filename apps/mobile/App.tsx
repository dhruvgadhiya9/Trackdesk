import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { LoadingState } from '@trackdesk/ui-native';
import { supabase } from './src/lib/supabase';
import { configureApi } from './src/lib/api';
import { LoginScreen } from './src/screens/LoginScreen';
import { NoCompanyScreen } from './src/screens/NoCompanyScreen';
import { TodayScreen } from './src/screens/TodayScreen';

configureApi();

/** Minimal navigation: auth state decides the screen (expo-router can replace this later). */
export default function App() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  const tenantId = session?.user.app_metadata?.tenant_id as string | undefined;

  return (
    <>
      <StatusBar style="dark" />
      {session === undefined ? (
        <LoadingState />
      ) : session === null ? (
        <LoginScreen />
      ) : !tenantId ? (
        <NoCompanyScreen email={session.user.email ?? ''} />
      ) : (
        <TodayScreen />
      )}
    </>
  );
}
