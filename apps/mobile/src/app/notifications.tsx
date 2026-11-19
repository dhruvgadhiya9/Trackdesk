import { useState } from "react";
import { Bell, Briefcase, MapPin, MessageSquare } from "lucide-react-native";
import { Pressable } from "react-native";
import { router } from "expo-router";
import { Badge, Card, ListRow, Notice, Screen, Text } from "@/components/ui";
import { LocationRequestPopup } from "@/components/LocationRequestPopup";
import { notifications as seed } from "@/lib/mock";
import { colors } from "@/theme";

const icons = { job: Briefcase, location: MapPin, chat: MessageSquare } as const;

export default function NotificationsScreen() {
  const [items, setItems] = useState(seed);
  const [locOpen, setLocOpen] = useState(false);
  const [locResult, setLocResult] = useState<string>();
  const markRead = (id: string) => setItems((s) => s.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  return (
    <Screen
      title="Notifications"
      back
      right={
        <Pressable accessibilityRole="button" accessibilityLabel="Mark all as read" onPress={() => setItems((s) => s.map((n) => ({ ...n, unread: false })))} hitSlop={8}>
          <Text size="sm" weight="bold" color={colors.primary700}>Read all</Text>
        </Pressable>
      }
    >
      {locResult && <Notice tone="success">{locResult}</Notice>}
      {items.length === 0 ? (
        <Notice tone="neutral" icon={Bell}>You&apos;re all caught up.</Notice>
      ) : (
        <Card>
          {items.map((n, i) => (
            <ListRow
              key={n.id}
              icon={icons[n.kind]}
              iconTone={n.kind === "location" ? "violet" : "primary"}
              title={n.title}
              sub={n.meta}
              last={i === items.length - 1}
              right={n.unread ? <Badge label="New" /> : undefined}
              onPress={() => {
                markRead(n.id);
                if (n.kind === "location") setLocOpen(true);
                else if (n.kind === "chat") router.push("/chat");
                else router.push({ pathname: "/job/[id]", params: { id: n.title.includes("1048") ? "JOB-1048" : "JOB-1050" } });
              }}
            />
          ))}
        </Card>
      )}
      <LocationRequestPopup visible={locOpen} onClose={() => setLocOpen(false)} onDone={(r) => { setLocResult(r); setLocOpen(false); }} />
    </Screen>
  );
}
