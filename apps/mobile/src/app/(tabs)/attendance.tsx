// SECURITY-REVIEW-REQUIRED: check-in/out captures GPS + time against a geo-fence (location data, consent required).
import { CalendarDays, LogIn, LogOut, MapPin } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { Button, Card, ListRow, Row, Screen, Text } from "@/components/ui";
import { attendanceHistory, technician } from "@/lib/mock";
import { useStore } from "@/lib/store";
import { colors, radius } from "@/theme";

export default function AttendanceScreen() {
  const { checkedInAt, checkedOutAt, checkIn, checkOut } = useStore();
  const inside = true; // mock geo-fence result
  return (
    <Screen title="Attendance">
      <Card title="Today">
        <View style={styles.map} accessible accessibilityLabel={`Map: you are inside the ${technician.branch} geo-fence`}>
          <View style={styles.pulse}><View style={styles.pin} /></View>
        </View>
        <Row style={{ gap: 8 }}>
          <MapPin size={16} color={inside ? colors.success500 : colors.danger500} />
          <Text size="md" weight="bold" color={inside ? colors.success700 : colors.danger700}>
            {inside ? `Inside geo-fence · ${technician.branch}` : "Outside geo-fence"}
          </Text>
        </Row>
        <Row>
          <Button title="Check-In" icon={LogIn} variant="success" block disabled={!!checkedInAt && !checkedOutAt} onPress={checkIn} />
          <Button title="Check-Out" icon={LogOut} variant="secondary" block disabled={!checkedInAt || !!checkedOutAt} onPress={checkOut} />
        </Row>
        <Text size="sm" weight="medium" color={colors.muted}>
          {checkedInAt
            ? `Checked in ${checkedInAt}${checkedOutAt ? ` · checked out ${checkedOutAt}` : ""}. GPS coordinates, date and time are captured on each action.`
            : "Check-in captures GPS coordinates, date and time."}
        </Text>
      </Card>
      <Card title="History">
        {attendanceHistory.map((h, i) => (
          <ListRow key={h.day} icon={CalendarDays} title={h.day} sub={h.inOut} last={i === attendanceHistory.length - 1} right={<Text size="sm" weight="medium" color={colors.muted}>{h.total}</Text>} />
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  map: { height: 170, borderRadius: radius.lg, backgroundColor: colors.surface3, alignItems: "center", justifyContent: "center" },
  pulse: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.success50, alignItems: "center", justifyContent: "center" },
  pin: { width: 16, height: 16, borderRadius: 8, backgroundColor: colors.success500, borderWidth: 3, borderColor: colors.white },
});
