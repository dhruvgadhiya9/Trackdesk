import { Car, FileText } from "lucide-react-native";
import { View } from "react-native";
import { Button, Card, InfoGrid, Notice, Row, Screen, Text } from "@/components/ui";
import { vehicle } from "@/lib/mock";
import { colors, radius } from "@/theme";
import { useState } from "react";

export default function VehicleScreen() {
  const [docs, setDocs] = useState(false);
  return (
    <Screen title="My Vehicle" back>
      <Card>
        <Row>
          <View style={{ width: 52, height: 52, borderRadius: radius.lg, backgroundColor: colors.primary50, alignItems: "center", justifyContent: "center" }}>
            <Car size={26} color={colors.primary600} />
          </View>
          <View style={{ flex: 1 }}>
            <Text size="title" weight="extrabold">{vehicle.number}</Text>
            <Text size="md" color={colors.muted}>{`${vehicle.type} · ${vehicle.branch}`}</Text>
          </View>
        </Row>
      </Card>
      <Card title="Vehicle Details">
        <InfoGrid
          items={[
            ["Registration Number", vehicle.number],
            ["Insurance Expiry", vehicle.insurance],
            ["Last Service Date", vehicle.lastService],
            ["Fuel Type", vehicle.fuel],
          ]}
        />
        <Button title="View Documents" icon={FileText} variant="secondary" small onPress={() => setDocs(true)} />
      </Card>
      {docs && <Notice tone="neutral">Vehicle documents (registration, insurance) will be available once the backend is connected.</Notice>}
    </Screen>
  );
}
