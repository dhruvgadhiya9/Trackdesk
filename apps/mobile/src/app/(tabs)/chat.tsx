import { useState } from "react";
import { MapPin, Paperclip, Send } from "lucide-react-native";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from "react-native";
import { Avatar, Screen, Segmented, Text } from "@/components/ui";
import { chats as seed, type ChatMessage } from "@/lib/mock";
import { colors, font, fontFamily, radius, space } from "@/theme";

const tabs = ["Customer", "Manager"] as const;

export default function ChatScreen() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Customer");
  const [threads, setThreads] = useState(seed);
  const [draft, setDraft] = useState("");
  const thread = threads[tab];

  const send = () => {
    if (!draft.trim()) return;
    const time = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    const msg: ChatMessage = { id: thread.messages.length + 1, from: "me", text: draft.trim(), time };
    setThreads((s) => ({ ...s, [tab]: { ...s[tab], messages: [...s[tab].messages, msg] } }));
    setDraft("");
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
      <Screen
        title="Chat"
        footer={
          <View style={styles.composer}>
            <Pressable accessibilityRole="button" accessibilityLabel="Attach file" hitSlop={8} style={styles.iconBtn}>
              <Paperclip size={18} color={colors.muted} />
            </Pressable>
            <TextInput
              accessibilityLabel="Message"
              placeholder={`Message ${thread.name.split(" ")[0]}…`}
              placeholderTextColor={colors.subtle}
              value={draft}
              onChangeText={setDraft}
              onSubmitEditing={send}
              returnKeyType="send"
              style={styles.input}
            />
            <Pressable accessibilityRole="button" accessibilityLabel="Send message" onPress={send} style={styles.send}>
              <Send size={17} color={colors.white} />
            </Pressable>
          </View>
        }
      >
        <Segmented label="Conversation" options={tabs} value={tab} onChange={setTab} />
        {thread.messages.map((m) => (
          <View key={m.id} style={[styles.msgRow, m.from === "me" && { justifyContent: "flex-end" }]}>
            {m.from === "them" && <Avatar name={thread.name} size={30} />}
            <View style={[styles.bubble, m.from === "me" ? styles.mine : styles.theirs]}>
              <Text color={m.from === "me" ? colors.white : colors.ink}>{m.text}</Text>
              {m.attachment && (
                <View style={[styles.attachment, m.from === "me" && { backgroundColor: colors.primary700 }]}>
                  <MapPin size={14} color={m.from === "me" ? colors.white : colors.ink} />
                  <Text size="sm" weight="semibold" color={m.from === "me" ? colors.white : colors.ink}>{m.attachment}</Text>
                </View>
              )}
              <Text size="xs" weight="medium" color={m.from === "me" ? colors.primary200 : colors.muted}>{m.time}</Text>
            </View>
          </View>
        ))}
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  msgRow: { flexDirection: "row", gap: 10, alignItems: "flex-end" },
  bubble: { maxWidth: "78%", paddingHorizontal: 14, paddingVertical: 10, gap: 6 },
  theirs: { backgroundColor: colors.surface3, borderRadius: 14, borderTopLeftRadius: 4 },
  mine: { backgroundColor: colors.primary600, borderRadius: 14, borderBottomRightRadius: 4 },
  attachment: { flexDirection: "row", gap: 8, alignItems: "center", padding: 8, borderRadius: radius.md, backgroundColor: colors.surface },
  composer: { flex: 1, flexDirection: "row", alignItems: "center", gap: space.sm, borderWidth: 1, borderColor: colors.line, borderRadius: 14, paddingLeft: space.sm, paddingRight: space.sm, minHeight: 52 },
  iconBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  input: { flex: 1, fontFamily: fontFamily.regular, fontSize: font.size.base, color: colors.ink, minHeight: 44 },
  send: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.primary600, alignItems: "center", justifyContent: "center" },
});
