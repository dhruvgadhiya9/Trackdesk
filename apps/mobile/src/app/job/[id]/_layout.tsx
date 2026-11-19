import { Stack } from "expo-router/stack";
import { colors } from "@/theme";

export default function JobLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.canvas } }} />;
}
