import { useState } from "react";
import { Eye, EyeOff, LogIn, Share2 } from "lucide-react-native";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Field, Text } from "@/components/ui";
import { useStore } from "@/lib/store";
import { colors, radius, shadow, space } from "@/theme";

export default function LoginScreen() {
  const { signIn } = useStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  const submit = () => {
    if (!username.trim() || !password) {
      setError("Enter your username and password.");
      return;
    }
    setError(undefined);
    setBusy(true);
    // TODO(auth): real technician sign-in. Mock only — any credentials work.
    setTimeout(signIn, 400);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.brand}>
            <View style={styles.logo}>
              <Share2 size={26} color={colors.white} />
            </View>
            <Text size="title" weight="extrabold">TrackDesk</Text>
            <Text size="md" weight="bold" color={colors.primary700}>Technician App</Text>
          </View>
          <Text size="display" weight="extrabold" accessibilityRole="header">Sign in to start your day</Text>
          <Field label="Username / Mobile Number" required autoCapitalize="none" autoComplete="username" textContentType="username" value={username} onChangeText={setUsername} />
          <View>
            <Field
              label="Password"
              required
              secureTextEntry={!show}
              autoComplete="current-password"
              textContentType="password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              onSubmitEditing={submit}
              error={error}
            />
            <Pressable accessibilityRole="button" accessibilityLabel={show ? "Hide password" : "Show password"} onPress={() => setShow((s) => !s)} style={styles.eye} hitSlop={8}>
              {show ? <EyeOff size={18} color={colors.muted} /> : <Eye size={18} color={colors.muted} />}
            </Pressable>
          </View>
          <Text size="md" weight="bold" color={colors.primary700} style={{ alignSelf: "flex-end" }}>Forgot password?</Text>
          <Button title={busy ? "Signing in…" : "Login"} icon={LogIn} onPress={submit} loading={busy} />
          <Text size="sm" color={colors.muted} style={{ textAlign: "center", marginTop: space.xl }}>App version 2.4.0 · Privacy Policy</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: space.xxl, paddingTop: space.xxl * 2, gap: space.lg + 2 },
  brand: { alignItems: "center", gap: space.xs, marginBottom: space.lg },
  logo: { width: 60, height: 60, borderRadius: radius.xl, backgroundColor: colors.primary600, alignItems: "center", justifyContent: "center", marginBottom: space.sm, ...shadow.primary },
  eye: { position: "absolute", right: 14, top: 41 },
});
