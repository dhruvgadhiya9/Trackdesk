import { Briefcase, Clock, LayoutGrid, MessageSquare, UserRound, type LucideIcon } from "lucide-react-native";
import { Tabs } from "expo-router/js-tabs";
import type { ColorValue } from "react-native";
import { colors, fontFamily } from "@/theme";

const icon =
  (Icon: LucideIcon) =>
  ({ color }: { color: ColorValue }) => <Icon size={22} color={typeof color === "string" ? color : colors.muted} />;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary700,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.lineSoft, minHeight: 64 },
        tabBarLabelStyle: { fontFamily: fontFamily.semibold, fontSize: 11 },
        sceneStyle: { backgroundColor: colors.canvas },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: icon(LayoutGrid) }} />
      <Tabs.Screen name="jobs" options={{ title: "Jobs", tabBarIcon: icon(Briefcase) }} />
      <Tabs.Screen name="attendance" options={{ title: "Attendance", tabBarIcon: icon(Clock) }} />
      <Tabs.Screen name="chat" options={{ title: "Chat", tabBarIcon: icon(MessageSquare) }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: icon(UserRound) }} />
    </Tabs>
  );
}
