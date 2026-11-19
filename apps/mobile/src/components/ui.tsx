import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react-native";
import { Check, ChevronLeft, X } from "lucide-react-native";
import {
  ActivityIndicator,
  Modal as RNModal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text as RNText,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { colors, font, fontFamily, radius, shadow, space, type Weight } from "@/theme";

/* ------------------------------------------------------------------ Text */

export function Text({
  children,
  size = "base",
  weight = "regular",
  color = colors.ink,
  style,
  numberOfLines,
  accessibilityRole,
}: {
  children: ReactNode;
  size?: keyof typeof font.size;
  weight?: Weight;
  color?: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  accessibilityRole?: "header" | "text" | "alert";
}) {
  return (
    <RNText
      numberOfLines={numberOfLines}
      accessibilityRole={accessibilityRole}
      style={[{ fontFamily: fontFamily[weight], fontSize: font.size[size], color, lineHeight: font.size[size] * 1.45 }, style]}
    >
      {children}
    </RNText>
  );
}

/* ------------------------------------------------------------------ Layout */

export function Screen({
  title,
  back,
  children,
  footer,
  scroll = true,
  right,
  background = colors.canvas,
}: {
  title?: string;
  back?: boolean;
  children: ReactNode;
  footer?: ReactNode;
  scroll?: boolean;
  right?: ReactNode;
  background?: string;
}) {
  const body = <View style={styles.body}>{children}</View>;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }} edges={title ? ["top"] : ["top"]}>
      {title && (
        <View style={styles.header}>
          {back ? (
            <IconButton icon={ChevronLeft} label="Back" onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))} />
          ) : (
            <View style={styles.headerSpacer} />
          )}
          <Text size="xl" weight="bold" accessibilityRole="header">
            {title}
          </Text>
          <View style={styles.headerSpacer}>{right}</View>
        </View>
      )}
      {scroll ? (
        <ScrollView contentContainerStyle={{ paddingBottom: space.xxl }} keyboardShouldPersistTaps="handled">
          {body}
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>{body}</View>
      )}
      {footer && <View style={styles.footer}>{footer}</View>}
    </SafeAreaView>
  );
}

export function Card({ children, style, title, right }: { children: ReactNode; style?: StyleProp<ViewStyle>; title?: string; right?: ReactNode }) {
  return (
    <View style={[styles.card, style]}>
      {(title || right) && (
        <View style={styles.cardHeader}>
          {title ? (
            <Text size="lg" weight="bold" accessibilityRole="header">
              {title}
            </Text>
          ) : (
            <View />
          )}
          {right}
        </View>
      )}
      {children}
    </View>
  );
}

export function Row({ children, style, gap = space.md }: { children: ReactNode; style?: StyleProp<ViewStyle>; gap?: number }) {
  return <View style={[{ flexDirection: "row", alignItems: "center", gap }, style]}>{children}</View>;
}

/* ------------------------------------------------------------------ Buttons */

type Variant = "primary" | "secondary" | "danger" | "success" | "ghost" | "soft";

const variantStyles: Record<Variant, { bg: string; fg: string; border: string }> = {
  primary: { bg: colors.primary600, fg: colors.white, border: colors.primary600 },
  secondary: { bg: colors.surface, fg: colors.ink2, border: colors.line },
  danger: { bg: colors.danger600, fg: colors.white, border: colors.danger600 },
  success: { bg: colors.success600, fg: colors.white, border: colors.success600 },
  ghost: { bg: "transparent", fg: colors.primary700, border: "transparent" },
  soft: { bg: colors.primary50, fg: colors.primary700, border: colors.primary50 },
};

export function Button({
  title,
  onPress,
  variant = "primary",
  icon: Icon,
  disabled,
  loading,
  block,
  small,
  accessibilityHint,
}: {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: LucideIcon;
  disabled?: boolean;
  loading?: boolean;
  block?: boolean;
  small?: boolean;
  accessibilityHint?: string;
}) {
  const v = variantStyles[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled || !!loading, busy: !!loading }}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        small && styles.buttonSmall,
        { backgroundColor: v.bg, borderColor: v.border, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
        variant === "primary" && shadow.primary,
        block && { flex: 1 },
      ]}
    >
      {loading ? <ActivityIndicator color={v.fg} /> : Icon && <Icon size={17} color={v.fg} />}
      <Text size={small ? "md" : "lg"} weight="semibold" color={v.fg}>
        {title}
      </Text>
    </Pressable>
  );
}

export function IconButton({ icon: Icon, label, onPress, badge }: { icon: LucideIcon; label: string; onPress?: () => void; badge?: boolean }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} hitSlop={4} style={styles.iconButton}>
      <Icon size={20} color={colors.ink2} />
      {badge && <View style={styles.dot} />}
    </Pressable>
  );
}

/* ------------------------------------------------------------------ Badge / Avatar */

export type Tone = "success" | "danger" | "warning" | "info" | "primary" | "violet" | "neutral";
const tones: Record<Tone, { bg: string; fg: string; dot: string }> = {
  success: { bg: colors.success50, fg: colors.success700, dot: colors.success500 },
  danger: { bg: colors.danger50, fg: colors.danger700, dot: colors.danger500 },
  warning: { bg: colors.warning50, fg: colors.warning700, dot: colors.warning500 },
  info: { bg: colors.info50, fg: colors.primary800, dot: colors.info500 },
  primary: { bg: colors.primary50, fg: colors.primary700, dot: colors.primary600 },
  violet: { bg: colors.violet50, fg: colors.violet600, dot: colors.violet600 },
  neutral: { bg: colors.surface3, fg: colors.ink3, dot: colors.subtle },
};
const statusTone: Record<string, Tone> = {
  Emergency: "danger", Regular: "info", Assigned: "primary", Accepted: "primary", Scheduled: "neutral",
  "In Progress": "violet", Paused: "warning", "Pending Verification": "warning", Completed: "success",
  Available: "success", Busy: "warning", "On Leave": "danger", Active: "success", New: "primary", Pending: "warning",
};

export function Badge({ label, tone }: { label: string; tone?: Tone }) {
  const t = tones[tone ?? statusTone[label] ?? "neutral"];
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }]}>
      <View style={[styles.badgeDot, { backgroundColor: t.dot }]} />
      <Text size="sm" weight="semibold" color={t.fg}>
        {label}
      </Text>
    </View>
  );
}

const avatarColors = [colors.violet600, colors.primary600, colors.success600, colors.info500, colors.warning500];
export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const idx = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % avatarColors.length;
  const initials = name.split(/\s+/).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: avatarColors[idx], alignItems: "center", justifyContent: "center" }}
    >
      <Text size={size > 36 ? "base" : "xs"} weight="bold" color={colors.white}>
        {initials}
      </Text>
    </View>
  );
}

/* ------------------------------------------------------------------ Inputs */

export function Field({
  label,
  required,
  error,
  hint,
  multiline,
  style,
  ...rest
}: TextInputProps & { label: string; required?: boolean; error?: string; hint?: string }) {
  return (
    <View style={{ gap: space.sm }}>
      <Text size="md" weight="semibold" color={colors.ink2}>
        {label}
        {required && <Text color={colors.danger600}> *</Text>}
      </Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.subtle}
        multiline={multiline}
        style={[styles.input, multiline && styles.textarea, error ? { borderColor: colors.danger500 } : null, style]}
        {...rest}
      />
      {error ? (
        <Text size="sm" weight="medium" color={colors.danger700} accessibilityRole="alert">
          {error}
        </Text>
      ) : hint ? (
        <Text size="sm" color={colors.muted}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

export function Checkbox({ label, checked, onChange, disabled }: { label: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      onPress={() => onChange(!checked)}
      disabled={disabled}
      style={styles.checkRow}
    >
      <View style={[styles.checkbox, checked && styles.checkboxOn]}>{checked && <Check size={13} color={colors.white} strokeWidth={3} />}</View>
      <Text weight="semibold" color={colors.ink2} style={{ flex: 1 }}>
        {label}
      </Text>
    </Pressable>
  );
}

export function Segmented<T extends string>({ options, value, onChange, label }: { options: readonly T[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <View accessibilityRole="tablist" accessibilityLabel={label} style={styles.segmented}>
      {options.map((o) => (
        <Pressable
          key={o}
          accessibilityRole="tab"
          accessibilityState={{ selected: o === value }}
          onPress={() => onChange(o)}
          style={[styles.segment, o === value && styles.segmentOn]}
        >
          <Text size="md" weight="bold" color={o === value ? colors.primary700 : colors.muted}>
            {o}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

export function RadioCard({ label, sub, selected, onPress, tone }: { label: string; sub?: string; selected: boolean; onPress: () => void; tone?: Tone }) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[styles.radioCard, selected && { borderColor: colors.primary600, borderWidth: 2, backgroundColor: colors.primary50 }]}
    >
      <View style={[styles.radio, selected && styles.radioOn]} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text size="lg" weight="extrabold">
          {label}
        </Text>
        {sub && (
          <Text size="sm" weight="medium" color={colors.muted}>
            {sub}
          </Text>
        )}
      </View>
      {tone && <Badge label={label} tone={tone} />}
    </Pressable>
  );
}

/* ------------------------------------------------------------------ Data display */

export function InfoGrid({ items }: { items: [string, ReactNode][] }) {
  return (
    <View style={styles.infoGrid}>
      {items.map(([k, v]) => (
        <View key={k} style={styles.infoItem}>
          <Text size="sm" weight="medium" color={colors.muted}>
            {k}
          </Text>
          {typeof v === "string" ? <Text weight="semibold">{v}</Text> : v}
        </View>
      ))}
    </View>
  );
}

export function ListRow({
  icon: Icon,
  title,
  sub,
  right,
  onPress,
  last,
  iconTone = "primary",
}: {
  icon?: LucideIcon;
  title: string;
  sub?: string;
  right?: ReactNode;
  onPress?: () => void;
  last?: boolean;
  iconTone?: Tone;
}) {
  const content = (
    <View style={[styles.listRow, !last && styles.listRowBorder]}>
      {Icon && (
        <View style={[styles.listIcon, { backgroundColor: tones[iconTone].bg }]}>
          <Icon size={18} color={tones[iconTone].dot} />
        </View>
      )}
      <View style={{ flex: 1, gap: 2 }}>
        <Text weight="semibold">{title}</Text>
        {sub && (
          <Text size="sm" color={colors.muted}>
            {sub}
          </Text>
        )}
      </View>
      {right}
    </View>
  );
  return onPress ? (
    <Pressable accessibilityRole="button" onPress={onPress}>
      {content}
    </Pressable>
  ) : (
    content
  );
}

export function Notice({ tone = "info", children, icon: Icon }: { tone?: Tone; children: ReactNode; icon?: LucideIcon }) {
  const t = tones[tone];
  return (
    <View style={[styles.notice, { backgroundColor: t.bg }]}>
      {Icon && <Icon size={18} color={t.fg} />}
      <Text size="md" weight="medium" color={t.fg} style={{ flex: 1 }}>
        {children}
      </Text>
    </View>
  );
}

/* ------------------------------------------------------------------ Modal (popups) */

export function Popup({
  visible,
  onClose,
  icon: Icon,
  tone = "primary",
  title,
  message,
  children,
  actions,
}: {
  visible: boolean;
  onClose: () => void;
  icon?: LucideIcon;
  tone?: Tone;
  title: string;
  message?: string;
  children?: ReactNode;
  actions: ReactNode;
}) {
  const t = tones[tone];
  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.popup} accessibilityViewIsModal>
          <View style={{ flexDirection: "row", gap: space.md, alignItems: "flex-start" }}>
            {Icon && (
              <View style={[styles.popupIcon, { backgroundColor: t.bg }]}>
                <Icon size={24} color={t.dot} />
              </View>
            )}
            <View style={{ flex: 1, gap: space.xs }}>
              <Text size="title" weight="extrabold" accessibilityRole="header">
                {title}
              </Text>
              {message && <Text color={colors.muted}>{message}</Text>}
            </View>
            <IconButton icon={X} label="Close" onPress={onClose} />
          </View>
          {children}
          <View style={{ flexDirection: "row", gap: space.md }}>{actions}</View>
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: space.xl, paddingTop: space.lg + 2, gap: space.lg },
  header: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.lineSoft,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerSpacer: { width: 44, alignItems: "flex-end" },
  footer: { padding: space.xl, paddingTop: space.md + 2, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.lineSoft, flexDirection: "row", gap: space.md - 2 },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.xl, padding: space.lg + 2, gap: space.md, ...shadow.card },
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: space.md },
  button: {
    minHeight: 48,
    paddingHorizontal: space.xxl,
    paddingVertical: space.md + 2,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.sm,
  },
  buttonSmall: { minHeight: 44, paddingHorizontal: space.lg, paddingVertical: space.sm + 2 },
  iconButton: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center", backgroundColor: colors.surface },
  dot: { position: "absolute", top: 9, right: 9, width: 9, height: 9, borderRadius: 5, backgroundColor: colors.danger500, borderWidth: 2, borderColor: colors.white },
  badge: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill, alignSelf: "flex-start" },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    fontFamily: fontFamily.medium,
    fontSize: font.size.base,
    color: colors.ink,
  },
  textarea: { minHeight: 104, paddingTop: space.md, textAlignVertical: "top" },
  checkRow: { flexDirection: "row", alignItems: "center", gap: space.md, minHeight: 48, paddingVertical: space.sm },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: colors.lineStrong, alignItems: "center", justifyContent: "center", backgroundColor: colors.surface },
  checkboxOn: { backgroundColor: colors.primary600, borderColor: colors.primary600 },
  segmented: { flexDirection: "row", gap: 6, padding: 4, borderRadius: radius.lg, backgroundColor: colors.surface3 },
  segment: { flex: 1, minHeight: 40, alignItems: "center", justifyContent: "center", borderRadius: 9 },
  segmentOn: { backgroundColor: colors.surface, ...shadow.card },
  radioCard: { flexDirection: "row", alignItems: "center", gap: 14, padding: space.lg, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: colors.lineStrong, backgroundColor: colors.surface },
  radioOn: { borderWidth: 6, borderColor: colors.primary600 },
  infoGrid: { flexDirection: "row", flexWrap: "wrap", rowGap: space.lg, columnGap: space.xxl },
  infoItem: { width: "44%", gap: 6 },
  listRow: { flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: space.md, minHeight: 56 },
  listRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.lineSoft },
  listIcon: { width: 40, height: 40, borderRadius: radius.lg, alignItems: "center", justifyContent: "center" },
  notice: { flexDirection: "row", gap: space.md, alignItems: "flex-start", padding: 14, borderRadius: radius.lg },
  overlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: "center", padding: space.xxl },
  popup: { backgroundColor: colors.surface, borderRadius: 20, padding: space.xxl + 4, gap: space.xl },
  popupIcon: { width: 52, height: 52, borderRadius: radius.xl, alignItems: "center", justifyContent: "center" },
});
