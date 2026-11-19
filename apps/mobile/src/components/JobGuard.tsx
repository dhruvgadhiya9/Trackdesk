import type { ReactNode } from "react";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { Screen, Text } from "@/components/ui";
import type { Job } from "@/lib/mock";
import { useStore, type JobProgress } from "@/lib/store";
import { colors, space } from "@/theme";

/** Resolves the job from the `[id]` route param and renders a not-found state if it does not exist. */
export function WithJob({ children }: { children: (job: Job, progress: JobProgress) => ReactNode }) {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { job, progress } = useStore();
  const j = id ? job(id) : undefined;
  const p = j ? progress[j.id] : undefined;
  if (!j || !p) {
    return (
      <Screen title="Job" back>
        <View style={{ alignItems: "center", paddingVertical: space.xxl * 2 }}>
          <Text weight="semibold" color={colors.muted}>This job could not be found.</Text>
        </View>
      </Screen>
    );
  }
  return <>{children(j, p)}</>;
}
