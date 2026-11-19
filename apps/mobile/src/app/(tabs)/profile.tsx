import { useState } from "react";
import { CalendarDays, Car, KeyRound, LifeBuoy, LogOut, Mail, Phone } from "lucide-react-native";
import { View } from "react-native";
import { router } from "expo-router";
import { Avatar, Button, Card, Field, ListRow, Popup, Screen, Text } from "@/components/ui";
import { technician } from "@/lib/mock";
import { useStore } from "@/lib/store";
import { colors, space } from "@/theme";

export default function ProfileScreen() {
  const { signOut, checkedInAt, checkedOutAt } = useStore();
  const [logout, setLogout] = useState(false);
  const [pw, setPw] = useState(false);
  const [pwDone, setPwDone] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [pwError, setPwError] = useState<string>();
  const stillCheckedIn = !!checkedInAt && !checkedOutAt;

  return (
    <Screen title="Profile">
      <View style={{ alignItems: "center", gap: space.sm, paddingVertical: space.md }}>
        <Avatar name={technician.name} size={72} />
        <Text size="title" weight="extrabold">{technician.name}</Text>
        <Text size="md" color={colors.muted}>{`${technician.title} · ${technician.employeeId}`}</Text>
      </View>
      <Card>
        <ListRow icon={Phone} title="Mobile Number" sub={technician.mobile} />
        <ListRow icon={Mail} title="Email" sub={technician.email} last />
      </Card>
      <Card>
        <ListRow icon={CalendarDays} title="Attendance History" onPress={() => router.push("/attendance")} />
        <ListRow icon={Car} title="My Vehicle" onPress={() => router.push("/vehicle")} />
        <ListRow icon={KeyRound} title="Change Password" onPress={() => { setPwDone(false); setPw(true); }} />
        <ListRow icon={LifeBuoy} title="Help & Support" onPress={() => router.push("/chat")} />
        <ListRow icon={LogOut} iconTone="danger" title="Logout" onPress={() => setLogout(true)} last />
      </Card>

      <Popup
        visible={logout}
        onClose={() => setLogout(false)}
        icon={LogOut}
        tone="danger"
        title="Log out?"
        message={stillCheckedIn ? "You are still checked in. Remember to check out first." : "Are you sure you want to log out?"}
        actions={
          <>
            <Button title="Cancel" variant="secondary" block onPress={() => setLogout(false)} />
            <Button title="Logout" variant="danger" block onPress={() => { setLogout(false); signOut(); }} />
          </>
        }
      />
      <Popup
        visible={pw}
        onClose={() => setPw(false)}
        icon={KeyRound}
        title="Change password"
        actions={
          pwDone ? (
            <Button title="Done" block onPress={() => setPw(false)} />
          ) : (
            <>
              <Button title="Cancel" variant="secondary" block onPress={() => setPw(false)} />
              <Button
                title="Update"
                block
                onPress={() => {
                  if (!current || next.length < 8) return setPwError("Enter your current password and a new one of at least 8 characters.");
                  setPwError(undefined);
                  setPwDone(true);
                }}
              />
            </>
          )
        }
      >
        {pwDone ? (
          <Text color={colors.ink2}>Your password was changed.</Text>
        ) : (
          <View style={{ gap: space.md }}>
            <Field label="Current Password" secureTextEntry autoComplete="current-password" value={current} onChangeText={setCurrent} />
            <Field label="New Password" secureTextEntry autoComplete="new-password" value={next} onChangeText={setNext} error={pwError} hint="At least 8 characters." />
          </View>
        )}
      </Popup>
    </Screen>
  );
}
