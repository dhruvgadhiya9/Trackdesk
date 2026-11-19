// SECURITY-REVIEW-REQUIRED: Happy Code verification. The 6-digit code is validated server-side with attempt limits
// and expiry; this mock compares against a fixed demo code.
import { useState } from "react";
import { CheckCircle2, RefreshCw, ShieldCheck, XCircle } from "lucide-react-native";
import { StyleSheet, TextInput, View } from "react-native";
import { router } from "expo-router";
import { Badge, Button, Card, InfoGrid, Notice, Row, Screen, Text } from "@/components/ui";
import { WithJob } from "@/components/JobGuard";
import { completionGates, useStore } from "@/lib/store";
import { colors, fontFamily, radius, space } from "@/theme";

const LEN = 6;

export default function HappyCodeScreen() {
  const { verifyHappyCode } = useStore();
  const [code, setCode] = useState("");
  const [result, setResult] = useState<"ok" | "invalid" | "locked" | null>(null);
  const [resent, setResent] = useState(false);

  return (
    <WithJob>
      {(job, p) => {
        const verified = !!p.happyVerifiedAt;
        const gates = completionGates(p);
        if (verified || result === "ok") {
          return (
            <Screen title="Happy Code" back background={colors.surface} footer={<Button title="Back to Jobs" block onPress={() => router.replace("/jobs")} />}>
              <View style={styles.result}>
                <View style={[styles.resultIcon, { backgroundColor: colors.success50 }]}><CheckCircle2 size={48} color={colors.success500} /></View>
                <Text size="display" weight="extrabold" accessibilityRole="header">Service Verification Successful</Text>
                <Text color={colors.muted} style={{ textAlign: "center" }}>Job status updated to Completed. Great work!</Text>
              </View>
              <Card>
                <InfoGrid items={[["Job", job.id], ["Status", <Badge key="s" label="Completed" />], ["Verified at", p.happyVerifiedAt ?? "—"], ["Attempts left", "—"]]} />
              </Card>
            </Screen>
          );
        }
        if (result === "invalid" || result === "locked") {
          return (
            <Screen
              title="Happy Code"
              back
              background={colors.surface}
              footer={
                <>
                  <Button title="Request Resend" icon={RefreshCw} variant="secondary" block onPress={() => { setResent(true); setResult(null); setCode(""); }} />
                  <Button title="Try Again" block disabled={result === "locked"} onPress={() => { setResult(null); setCode(""); }} />
                </>
              }
            >
              <View style={styles.result}>
                <View style={[styles.resultIcon, { backgroundColor: colors.danger50 }]}><XCircle size={48} color={colors.danger500} /></View>
                <Text size="display" weight="extrabold" accessibilityRole="header">{result === "locked" ? "Too many attempts" : "Invalid Happy Code"}</Text>
                <Text color={colors.muted} style={{ textAlign: "center" }}>
                  {result === "locked" ? "Ask your manager to resend a new code or approve an override." : "The code does not match. Check with the customer or request a new code."}
                </Text>
              </View>
              <Card>
                <InfoGrid items={[["Job", job.id], ["Status", <Badge key="s" label={job.status} />], ["Verified at", "—"], ["Attempts left", String(p.happyAttemptsLeft)]]} />
              </Card>
            </Screen>
          );
        }
        return (
          <Screen
            title="Happy Code"
            back
            footer={
              <Button
                title="Verify Code"
                icon={ShieldCheck}
                block
                disabled={code.length !== LEN || !gates[0]!.done || !gates[1]!.done}
                onPress={() => setResult(verifyHappyCode(job.id, code))}
              />
            }
          >
            <Card>
              <InfoGrid items={[["Job Number", job.id], ["Customer", job.customer], ["Property", job.property], ["Service", job.service]]} />
              <Row style={{ justifyContent: "space-between" }}>
                <Badge label="Waiting for code" tone="warning" />
                <Text size="sm" color={colors.muted}>{resent ? "New code sent just now" : "Sent to customer"}</Text>
              </Row>
            </Card>
            <Card>
              <Text size="lg" weight="bold">Enter the 6-digit Happy Code</Text>
              <Text size="md" color={colors.muted}>Ask the customer for the code they received by SMS / email.</Text>
              <View>
                <TextInput
                  accessibilityLabel="Happy Code"
                  value={code}
                  onChangeText={(t) => setCode(t.replace(/\D/g, "").slice(0, LEN))}
                  keyboardType="number-pad"
                  textContentType="oneTimeCode"
                  autoComplete="one-time-code"
                  maxLength={LEN}
                  style={styles.hiddenInput}
                />
                <Row style={{ justifyContent: "space-between" }} >
                  {Array.from({ length: LEN }, (_, i) => (
                    <Text
                      key={i}
                      size="code"
                      weight="extrabold"
                      color={colors.ink}
                      style={[styles.digit, i === code.length && styles.digitActive]}
                    >
                      {code[i] ?? ""}
                    </Text>
                  ))}
                </Row>
              </View>
              <Button title="Request Resend" icon={RefreshCw} variant="ghost" small onPress={() => setResent(true)} />
              <Text size="sm" color={colors.muted}>{`Attempts left: ${p.happyAttemptsLeft}`}</Text>
            </Card>
            <Card title="Before you can complete">
              {gates.map((g) => (
                <Row key={g.label} style={{ gap: 8 }}>
                  <CheckCircle2 size={18} color={g.done ? colors.success500 : colors.lineStrong} />
                  <Text weight="semibold" color={g.done ? colors.ink : colors.muted}>{g.label}</Text>
                </Row>
              ))}
            </Card>
            {(!gates[0]!.done || !gates[1]!.done) && <Notice tone="warning">Submit the checklist and proof of work before verifying the code.</Notice>}
          </Screen>
        );
      }}
    </WithJob>
  );
}

const styles = StyleSheet.create({
  result: { alignItems: "center", gap: space.lg, paddingTop: space.xxl * 2, paddingBottom: space.xl },
  resultIcon: { width: 96, height: 96, borderRadius: 48, alignItems: "center", justifyContent: "center" },
  hiddenInput: { position: "absolute", width: "100%", height: "100%", opacity: 0.02, zIndex: 2, fontFamily: fontFamily.regular },
  digit: { width: 46, height: 58, lineHeight: 58, textAlign: "center", borderRadius: radius.lg, borderWidth: 1.5, borderColor: colors.line, backgroundColor: colors.surface2, overflow: "hidden" },
  digitActive: { borderColor: colors.primary600 },
});
