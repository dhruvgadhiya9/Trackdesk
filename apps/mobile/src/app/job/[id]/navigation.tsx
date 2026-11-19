import { useState } from "react";
import { ExternalLink, MapPin, Navigation, Flag } from "lucide-react-native";
import { Linking, Platform, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Button, Card, InfoGrid, Notice, Row, Screen, Text } from "@/components/ui";
import { WithJob } from "@/components/JobGuard";
import { colors, radius } from "@/theme";

function openMaps(address: string) {
  const q = encodeURIComponent(address);
  const url = Platform.OS === "ios" ? `maps://?daddr=${q}` : `https://www.google.com/maps/dir/?api=1&destination=${q}`;
  Linking.openURL(url).catch(() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${q}`));
}

export default function NavigationScreen() {
  const [arrived, setArrived] = useState(false);
  return (
    <WithJob>
      {(job) => (
        <Screen
          title="Navigation"
          back
          footer={
            <>
              <Button title="Start Navigation" icon={Navigation} variant="secondary" block onPress={() => openMaps(job.address)} />
              <Button title="Arrived on Site" icon={Flag} block onPress={() => { setArrived(true); router.back(); }} disabled={arrived} />
            </>
          }
        >
          <View style={styles.map} accessible accessibilityLabel={`Route preview to ${job.address}`}>
            <MapPin size={36} color={colors.primary600} />
          </View>
          <Card>
            <InfoGrid items={[["Estimated Distance", job.distance ?? "—"], ["Estimated Travel Time", job.travelTime ?? "—"]]} />
            <Row style={{ alignItems: "flex-start", gap: 8 }}>
              <MapPin size={16} color={colors.muted} />
              <Text size="md" color={colors.ink2} style={{ flex: 1 }}>{job.address}</Text>
            </Row>
            <Button title="Open in Google Maps" icon={ExternalLink} variant="ghost" small onPress={() => openMaps(job.address)} />
          </Card>
          <Notice tone="info">Turn-by-turn directions open in your maps app. TrackDesk does not track your route.</Notice>
        </Screen>
      )}
    </WithJob>
  );
}

const styles = StyleSheet.create({
  map: { height: 220, borderRadius: radius.xl, backgroundColor: colors.surface3, alignItems: "center", justifyContent: "center" },
});
