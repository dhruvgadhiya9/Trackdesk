import { useState } from "react";
import { Minus, Plus, Send, Trash2 } from "lucide-react-native";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { router } from "expo-router";
import { Badge, Button, Card, Checkbox, Field, Notice, Row, Screen, Text } from "@/components/ui";
import { WithJob } from "@/components/JobGuard";
import { colors, font, fontFamily, radius, space } from "@/theme";

interface Material {
  id: number;
  name: string;
  qty: number;
}

export default function QuotationScreen() {
  const [needs, setNeeds] = useState({ parts: true, labour: true, additional: false });
  const [survey, setSurvey] = useState("Rooftop unit, 9 years old. Compressor seized.");
  const [problem, setProblem] = useState("Compressor failure, no cooling");
  const [materials, setMaterials] = useState<Material[]>([
    { id: 1, name: "AC Compressor 3-ton", qty: 1 },
    { id: 2, name: "Copper pipe 3/8″ (ft)", qty: 15 },
    { id: 3, name: "Run capacitor 45/5 µF", qty: 1 },
  ]);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string>();
  const update = (id: number, patch: Partial<Material>) => setMaterials((m) => m.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  return (
    <WithJob>
      {(job) => (
        <Screen
          title="Quotation Assessment"
          back
          footer={
            <Button
              title={sent ? "Sent to Manager" : "Submit For Quotation"}
              icon={Send}
              block
              disabled={sent}
              onPress={() => {
                if (!problem.trim()) return setError("Describe the problem.");
                if (materials.some((m) => !m.name.trim())) return setError("Name every material row or remove it.");
                setSent(true);
                setTimeout(() => router.back(), 600);
              }}
            />
          }
        >
          <Card title="Quotation Checklist">
            <Checkbox label="Parts Required" checked={needs.parts} onChange={(v) => setNeeds((n) => ({ ...n, parts: v }))} />
            <Checkbox label="Labour Required" checked={needs.labour} onChange={(v) => setNeeds((n) => ({ ...n, labour: v }))} />
            <Checkbox label="Additional Work Required" checked={needs.additional} onChange={(v) => setNeeds((n) => ({ ...n, additional: v }))} />
          </Card>
          <Card title="Site Survey">
            <Field label="Survey Notes" multiline value={survey} onChangeText={setSurvey} />
            <Field label="Problem Description" required value={problem} onChangeText={setProblem} />
          </Card>
          <Card title="Material Requirement" right={<Badge label="Optional" tone="neutral" />}>
            {materials.map((m) => (
              <View key={m.id} style={styles.matRow}>
                <TextInput accessibilityLabel="Material name" value={m.name} onChangeText={(t) => update(m.id, { name: t })} style={styles.matInput} placeholder="Material" placeholderTextColor={colors.subtle} />
                <Row style={{ gap: 6 }}>
                  <Pressable accessibilityRole="button" accessibilityLabel={`Decrease ${m.name}`} onPress={() => update(m.id, { qty: Math.max(1, m.qty - 1) })} style={styles.step} hitSlop={4}>
                    <Minus size={14} color={colors.ink2} />
                  </Pressable>
                  <Text weight="bold" style={{ minWidth: 26, textAlign: "center" }}>{String(m.qty)}</Text>
                  <Pressable accessibilityRole="button" accessibilityLabel={`Increase ${m.name}`} onPress={() => update(m.id, { qty: m.qty + 1 })} style={styles.step} hitSlop={4}>
                    <Plus size={14} color={colors.ink2} />
                  </Pressable>
                  <Pressable accessibilityRole="button" accessibilityLabel={`Remove ${m.name}`} onPress={() => setMaterials((s) => s.filter((x) => x.id !== m.id))} style={styles.step} hitSlop={4}>
                    <Trash2 size={14} color={colors.danger600} />
                  </Pressable>
                </Row>
              </View>
            ))}
            <Button title="Add Row" icon={Plus} variant="secondary" small onPress={() => setMaterials((s) => [...s, { id: Date.now(), name: "", qty: 1 }])} />
          </Card>
          {error && <Notice tone="danger">{error}</Notice>}
          {sent && <Notice tone="success">{`Assessment for ${job.id} sent. Your manager will prepare the quotation.`}</Notice>}
        </Screen>
      )}
    </WithJob>
  );
}

const styles = StyleSheet.create({
  matRow: { flexDirection: "row", alignItems: "center", gap: space.sm, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.lineSoft },
  matInput: { flex: 1, minHeight: 44, fontFamily: fontFamily.medium, fontSize: font.size.base, color: colors.ink },
  step: { width: 32, height: 32, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center" },
});
