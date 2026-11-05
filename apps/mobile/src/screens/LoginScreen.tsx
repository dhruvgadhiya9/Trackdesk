import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { Button, Card, Screen, Text, theme } from '@trackdesk/ui-native';
import { supabase } from '../lib/supabase';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function signIn() {
    setBusy(true);
    setError(null);
    const { error: e } = await supabase.auth.signInWithPassword({ email, password });
    if (e) setError(e.message);
    setBusy(false);
  }

  return (
    <Screen style={styles.screen}>
      <Text variant="title">TrackDesk</Text>
      <Text muted>Sign in with the account your company invited.</Text>
      <Card style={styles.card}>
        <TextInput
          testID="email"
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor={theme.color.fg.subtle}
        />
        <TextInput
          testID="password"
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor={theme.color.fg.subtle}
        />
        {error ? (
          <Text
            variant="caption"
            style={{ color: theme.color.danger.fg }}
            accessibilityRole="alert"
          >
            {error}
          </Text>
        ) : null}
        <Button testID="sign-in" title="Sign in" onPress={signIn} loading={busy} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { justifyContent: 'center' },
  card: { gap: theme.space(3) },
  input: {
    borderWidth: 1,
    borderColor: theme.color.border.default,
    borderRadius: theme.radius('md'),
    paddingHorizontal: theme.space(3),
    minHeight: theme.space(12),
    color: theme.color.fg.default,
    backgroundColor: theme.color.bg.surface,
  },
});
