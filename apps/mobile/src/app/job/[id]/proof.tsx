import { useState } from "react";
import { Camera, FileText, Image as ImageIcon, Save, Send, X } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Badge, Button, Card, ListRow, Notice, Row, Screen, Text } from "@/components/ui";
import { WithJob } from "@/components/JobGuard";
import { useStore } from "@/lib/store";
import { colors, radius, space } from "@/theme";

type Section = "before" | "after";

/** Mock picker. Production: expo-image-picker (camera/gallery) + upload to tenant-scoped storage. */
function Thumbs({ items, onRemove, locked }: { items: string[]; onRemove: (i: number) => void; locked: boolean }) {
  return (
    <View style={styles.thumbs}>
      {items.map((name, i) => (
        <View key={`${name}-${i}`} style={styles.thumb}>
          <ImageIcon size={22} color={colors.muted} />
          <Text size="xs" weight="semibold" color={colors.ink3} numberOfLines={1}>{name}</Text>
          {!locked && (
            <Pressable accessibilityRole="button" accessibilityLabel={`Remove ${name}`} onPress={() => onRemove(i)} style={styles.remove} hitSlop={6}>
              <X size={12} color={colors.white} />
            </Pressable>
          )}
        </View>
      ))}
    </View>
  );
}

export default function ProofScreen() {
  const { updateProgress } = useStore();
  const [media, setMedia] = useState<Record<Section, string[]>>({ before: ["Unit.jpg", "Capacitor.jpg"], after: [] });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string>();
  const add = (s: Section, source: "camera" | "gallery") => {
    setSaved(false);
    setError(undefined);
    setMedia((m) => ({ ...m, [s]: [...m[s], `${s === "before" ? "Before" : "After"}-${m[s].length + 1}.${source === "camera" ? "jpg" : "png"}`] }));
  };
  const remove = (s: Section, i: number) => setMedia((m) => ({ ...m, [s]: m[s].filter((_, k) => k !== i) }));

  return (
    <WithJob>
      {(job, p) => (
        <Screen
          title="Proof of Work"
          back
          footer={
            <>
              <Button title={saved ? "Saved" : "Save Proof"} icon={Save} variant="secondary" block onPress={() => setSaved(true)} disabled={p.proofSubmitted} />
              <Button
                title={p.proofSubmitted ? "Submitted" : "Submit For Verification"}
                icon={Send}
                block
                disabled={p.proofSubmitted}
                onPress={() => {
                  if (media.before.length === 0 || media.after.length === 0) return setError("Add at least one before and one after photo.");
                  updateProgress(job.id, { proofSubmitted: true });
                  router.back();
                }}
              />
            </>
          }
        >
          {(["before", "after"] as const).map((s) => (
            <Card key={s} title={s === "before" ? "Before Work Photos" : "After Work Photos / Video"} right={<Badge label={String(media[s].length)} tone="primary" />}>
              {media[s].length === 0 ? <Text size="md" color={colors.muted}>No photos yet.</Text> : <Thumbs items={media[s]} onRemove={(i) => remove(s, i)} locked={p.proofSubmitted} />}
              {!p.proofSubmitted && (
                <Row>
                  <Button title="Camera" icon={Camera} variant="secondary" small block onPress={() => add(s, "camera")} />
                  <Button title="Gallery" icon={ImageIcon} variant="secondary" small block onPress={() => add(s, "gallery")} />
                </Row>
              )}
            </Card>
          ))}
          <Card title="Documents">
            <ListRow icon={FileText} title={`Service-report-${job.id}.pdf`} sub="412 KB" />
            <ListRow icon={FileText} title="Signed-materials-list.pdf" sub="96 KB" last />
          </Card>
          {error && <Notice tone="danger">{error}</Notice>}
          <Notice tone="neutral">Demo: Camera and Gallery add placeholder files. The real app uses the device camera and uploads securely.</Notice>
          <View style={{ height: space.sm }} />
        </Screen>
      )}
    </WithJob>
  );
}

const styles = StyleSheet.create({
  thumbs: { flexDirection: "row", flexWrap: "wrap", gap: space.sm + 2 },
  thumb: { width: 96, height: 84, borderRadius: radius.lg, backgroundColor: colors.surface3, alignItems: "center", justifyContent: "center", gap: 4, padding: 6 },
  remove: { position: "absolute", top: 4, right: 4, width: 20, height: 20, borderRadius: 10, backgroundColor: colors.ink3, alignItems: "center", justifyContent: "center" },
});
