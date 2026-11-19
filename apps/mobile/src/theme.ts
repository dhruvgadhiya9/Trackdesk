import { colors, font, radius, space } from "@trackdesk/tokens";

export { colors, font, radius, space };

/** Plus Jakarta Sans family name per weight (loaded in app/_layout.tsx). */
export const fontFamily = {
  regular: "PlusJakartaSans_400Regular",
  medium: "PlusJakartaSans_500Medium",
  semibold: "PlusJakartaSans_600SemiBold",
  bold: "PlusJakartaSans_700Bold",
  extrabold: "PlusJakartaSans_800ExtraBold",
} as const;

export type Weight = keyof typeof fontFamily;

export const shadow = {
  card: { shadowColor: colors.ink, shadowOpacity: 0.05, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  primary: { shadowColor: colors.primary600, shadowOpacity: 0.28, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
} as const;
