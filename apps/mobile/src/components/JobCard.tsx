import { Clock } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Badge, Text } from "@/components/ui";
import type { Job } from "@/lib/mock";
import { colors, radius, shadow, space } from "@/theme";

export function JobCard({ job }: { job: Job }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${job.id}, ${job.service}, ${job.priority}, ${job.status}, ${job.customer} at ${job.property}, ${job.window}`}
      onPress={() => router.push({ pathname: "/job/[id]", params: { id: job.id } })}
      style={({ pressed }) => [styles.card, job.priority === "Emergency" && styles.emergency, pressed && { opacity: 0.85 }]}
    >
      <View style={styles.row}>
        <Text size="md" weight="bold" color={colors.primary700}>{job.id}</Text>
        <View style={styles.badges}>
          <Badge label={job.priority} />
          <Badge label={job.status} />
        </View>
      </View>
      <Text size="lg" weight="bold">{job.service}</Text>
      <Text size="md" color={colors.muted}>{`${job.customer} · ${job.property}`}</Text>
      <View style={[styles.row, { justifyContent: "flex-start", gap: 6 }]}>
        <Clock size={14} color={colors.muted} />
        <Text size="md" weight="semibold" color={colors.ink2}>{job.window}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.line, padding: space.lg, gap: 6, ...shadow.card },
  emergency: { borderLeftWidth: 4, borderLeftColor: colors.danger500 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: space.sm },
  badges: { flexDirection: "row", gap: 6 },
});
