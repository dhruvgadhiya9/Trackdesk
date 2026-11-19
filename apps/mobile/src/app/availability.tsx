import { useState } from "react";
import { Check } from "lucide-react-native";
import { router } from "expo-router";
import { Button, Field, Notice, RadioCard, Screen, Text } from "@/components/ui";
import { useStore, type Availability } from "@/lib/store";

const options: { value: Availability; sub: string; tone: "success" | "warning" | "danger" }[] = [
  { value: "Available", sub: "Can receive jobs", tone: "success" },
  { value: "Busy", sub: "Already occupied", tone: "warning" },
  { value: "On Leave", sub: "Unavailable", tone: "danger" },
];

export default function AvailabilityScreen() {
  const { availability, setAvailability } = useStore();
  const [choice, setChoice] = useState<Availability>(availability);
  const [remarks, setRemarks] = useState("");
  const [saved, setSaved] = useState(false);
  return (
    <Screen
      title="Availability"
      back
      footer={
        <Button
          title="Update Status"
          icon={Check}
          block
          onPress={() => {
            setAvailability(choice);
            setSaved(true);
            setTimeout(() => router.back(), 500);
          }}
        />
      }
    >
      <Text size="title" weight="extrabold" accessibilityRole="header">Set your status</Text>
      {options.map((o) => (
        <RadioCard key={o.value} label={o.value} sub={o.sub} tone={o.tone} selected={choice === o.value} onPress={() => { setChoice(o.value); setSaved(false); }} />
      ))}
      <Field label="Remarks (optional)" multiline placeholder="e.g. Back after lunch" value={remarks} onChangeText={setRemarks} />
      {saved && <Notice tone="success">{`Status updated to ${choice}.`}</Notice>}
    </Screen>
  );
}
