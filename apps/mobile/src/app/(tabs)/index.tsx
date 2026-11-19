import { useState } from "react";
import { AlertTriangle, Bell, Briefcase, CalendarClock, LogIn, MapPin, ToggleRight } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Avatar, Badge, Card, IconButton, Notice, Row, Screen, Text } from "@/components/ui";
import { JobCard } from "@/components/JobCard";
import { LocationRequestPopup } from "@/components/LocationRequestPopup";
import { notifications, technician } from "@/lib/mock";
import { useStore } from "@/lib/store";
import { colors, radius, space } from "@/theme";

function Stat({ value, label, color = colors.white }: { value: number; label: string; color?: string }) {
  return (
    <View style={{ flex: 1, gap: 2 }}>
      <Text size="title" weight="extrabold" color={color}>{String(value)}</Text>
      <Text size="sm" weight="medium" color={colors.primary200}>{label}</Text>
    </View>
  );
}

export default function Dashboard() {
  const { jobs, checkedInAt, checkedOutAt, availability, checkIn } = useStore();
  const [locOpen, setLocOpen] = useState(false);
  const [locResult, setLocResult] = useState<string>();
  const today = jobs.filter((j) => j.day === "Today");
  const completed = jobs.filter((j) => j.status === "Completed").length;
  const emergency = jobs.find((j) => j.priority === "Emergency" && j.status !== "Completed");
  const pendingLocation = !locResult && notifications.some((n) => n.kind === "location" && n.unread);

  const actions = [
    { label: checkedInAt && !checkedOutAt ? "Checked In" : "Check-In", icon: LogIn, onPress: () => (checkedInAt && !checkedOutAt ? router.push("/attendance") : checkIn()) },
    { label: "My Jobs", icon: Briefcase, onPress: () => router.push("/jobs") },
    { label: "Availability", icon: ToggleRight, onPress: () => router.push("/availability") },
    { label: "Alerts", icon: Bell, onPress: () => router.push("/notifications") },
  ];

  return (
    <Screen>
      <Row style={{ justifyContent: "space-between" }}>
        <Row>
          <Avatar name={technician.name} size={44} />
          <View>
            <Text size="md" color={colors.muted}>Good morning,</Text>
            <Text size="xl" weight="extrabold">{technician.name}</Text>
          </View>
        </Row>
        <IconButton icon={Bell} label="Notifications" badge={notifications.some((n) => n.unread)} onPress={() => router.push("/notifications")} />
      </Row>

      <View style={styles.hero}>
        <Row style={{ justifyContent: "space-between" }}>
          <View style={{ gap: 2, flex: 1 }}>
            <Text size="lg" weight="bold" color={colors.white}>
              {checkedInAt && !checkedOutAt ? `Checked in at ${checkedInAt}` : "Not checked in"}
            </Text>
            <Text size="sm" color={colors.primary200}>{`${technician.branch} geo-fence · ${availability}`}</Text>
          </View>
          <Badge label={availability} />
        </Row>
        <Row style={{ marginTop: space.lg }}>
          <Stat value={today.length} label="Assigned" />
          <Stat value={completed} label="Completed" />
          <Stat value={today.filter((j) => j.status !== "Completed").length} label="Remaining" />
        </Row>
      </View>

      {pendingLocation && (
        <Pressable accessibilityRole="button" onPress={() => setLocOpen(true)}>
          <Notice tone="primary" icon={MapPin}>Marcus Reed requested your location — tap to share or reject.</Notice>
        </Pressable>
      )}
      {locResult && <Notice tone="success">{locResult}</Notice>}

      <Row>
        <Card style={{ flex: 1 }}>
          <CalendarClock size={20} color={colors.primary600} />
          <Text weight="bold">Upcoming Jobs</Text>
          <Text size="sm" color={colors.muted}>{`${jobs.filter((j) => j.day === "Upcoming").length + today.length - 1} scheduled · Next 11:30 AM`}</Text>
        </Card>
        <Card style={{ flex: 1 }}>
          <AlertTriangle size={20} color={colors.danger500} />
          <Text weight="bold">Emergency Jobs</Text>
          <Text size="sm" color={colors.muted}>{emergency ? `1 active · ${emergency.id}` : "None active"}</Text>
        </Card>
      </Row>

      <View style={styles.actions}>
        {actions.map((a) => (
          <Pressable key={a.label} accessibilityRole="button" onPress={a.onPress} style={styles.action}>
            <View style={styles.actionIcon}><a.icon size={20} color={colors.primary600} /></View>
            <Text size="sm" weight="semibold" style={{ textAlign: "center" }}>{a.label}</Text>
          </Pressable>
        ))}
      </View>

      <Row style={{ justifyContent: "space-between" }}>
        <Text size="lg" weight="bold" accessibilityRole="header">Today&apos;s Schedule</Text>
        <Pressable accessibilityRole="link" onPress={() => router.push("/jobs")} hitSlop={8}>
          <Text size="md" weight="bold" color={colors.primary700}>See all</Text>
        </Pressable>
      </Row>
      {today.filter((j) => j.status !== "Completed" && j.status !== "In Progress").map((j) => <JobCard key={j.id} job={j} />)}

      <LocationRequestPopup visible={locOpen} onClose={() => setLocOpen(false)} onDone={(r) => { setLocResult(r); setLocOpen(false); }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.nav, borderRadius: radius.xl, padding: space.xl },
  actions: { flexDirection: "row", gap: space.sm + 2 },
  action: { flex: 1, alignItems: "center", gap: 6, paddingVertical: space.md, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, minHeight: 76 },
  actionIcon: { width: 40, height: 40, borderRadius: radius.lg, backgroundColor: colors.primary50, alignItems: "center", justifyContent: "center" },
});
