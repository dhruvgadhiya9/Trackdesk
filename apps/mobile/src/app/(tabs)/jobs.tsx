import { useState } from "react";
import { Inbox } from "lucide-react-native";
import { View } from "react-native";
import { Screen, Segmented, Text } from "@/components/ui";
import { JobCard } from "@/components/JobCard";
import { useStore } from "@/lib/store";
import { colors, space } from "@/theme";

const filters = ["Today", "Upcoming", "Completed", "Emergency"] as const;

export default function JobsScreen() {
  const { jobs } = useStore();
  const [filter, setFilter] = useState<(typeof filters)[number]>("Today");
  const visible = jobs.filter((j) =>
    filter === "Emergency" ? j.priority === "Emergency" && j.status !== "Completed" : filter === "Completed" ? j.status === "Completed" : j.day === filter && j.status !== "Completed",
  );
  return (
    <Screen title="My Jobs">
      <Segmented label="Job filter" options={filters} value={filter} onChange={setFilter} />
      {visible.length === 0 ? (
        <View style={{ alignItems: "center", gap: space.sm, paddingVertical: space.xxl * 2 }}>
          <Inbox size={32} color={colors.subtle} />
          <Text weight="semibold" color={colors.muted}>{`No ${filter.toLowerCase()} jobs`}</Text>
        </View>
      ) : (
        visible.map((j) => <JobCard key={j.id} job={j} />)
      )}
    </Screen>
  );
}
