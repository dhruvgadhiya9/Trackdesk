// SECURITY-REVIEW-REQUIRED: one-off location share requested by a manager. Never continuous; rejection needs a reason.
// Production: expo-location getCurrentPositionAsync only after explicit "Share Location" + OS permission.
import { useState } from "react";
import { MapPin } from "lucide-react-native";
import { View } from "react-native";
import { Button, Popup, RadioCard, Text } from "@/components/ui";
import { locationRejectReasons } from "@/lib/mock";
import { colors, space } from "@/theme";

export function LocationRequestPopup({ visible, onClose, onDone }: { visible: boolean; onClose: () => void; onDone: (result: string) => void }) {
  const [reason, setReason] = useState<string>();
  const [error, setError] = useState<string>();
  return (
    <Popup
      visible={visible}
      onClose={onClose}
      icon={MapPin}
      title="Marcus Reed requested your location"
      message="Share once, or reject with a reason. TrackDesk never tracks you continuously."
      actions={
        <>
          <Button
            title="Reject"
            variant="secondary"
            block
            onPress={() => {
              if (!reason) return setError("Choose a reason to reject.");
              onDone(`Rejected: ${reason}`);
            }}
          />
          <Button title="Share Location" icon={MapPin} block onPress={() => onDone("Location shared once")} />
        </>
      }
    >
      <View style={{ gap: space.sm }}>
        <Text size="md" weight="semibold" color={colors.ink2}>Reject reason (required if rejecting)</Text>
        {locationRejectReasons.map((r) => (
          <RadioCard key={r} label={r} selected={reason === r} onPress={() => { setReason(r); setError(undefined); }} />
        ))}
        {error && <Text size="sm" weight="medium" color={colors.danger700} accessibilityRole="alert">{error}</Text>}
      </View>
    </Popup>
  );
}
