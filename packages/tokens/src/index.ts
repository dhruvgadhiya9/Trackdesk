/**
 * TrackDesk design tokens as plain values for React Native (apps/mobile).
 * MUST stay in sync with packages/ui/src/styles.css (the web @theme). Raw colour values are allowed only
 * in this file and styles.css.
 */
export const colors = {
  primary50: "#EEF0FE",
  primary200: "#C7D2FE",
  primary300: "#A5B4FC",
  primary600: "#4F46E5",
  primary700: "#4338CA",
  primary800: "#3730A3",
  ink: "#0F172A",
  ink2: "#334155",
  ink3: "#475569",
  muted: "#5B6B82",
  muted2: "#6B7A90",
  subtle: "#94A3B8",
  canvas: "#F5F7FB",
  surface: "#FFFFFF",
  surface2: "#F8FAFC",
  surface3: "#F1F5F9",
  line: "#E3E7F0",
  lineSoft: "#EEF1F6",
  lineStrong: "#CBD3E1",
  nav: "#0B1437",
  success500: "#10B981",
  success600: "#059669",
  success50: "#E3F6EE",
  success700: "#047857",
  danger500: "#EF4444",
  danger600: "#DC2626",
  danger50: "#FDECEC",
  danger700: "#B91C1C",
  warning500: "#F59E0B",
  warning50: "#FEF3DC",
  warning700: "#B45309",
  info500: "#0EA5E9",
  info50: "#E3F3FC",
  violet600: "#7C3AED",
  violet50: "#F3EDFE",
  white: "#FFFFFF",
  overlay: "rgba(11,20,55,0.55)",
} as const;

export const radius = { sm: 8, md: 10, lg: 12, xl: 16, pill: 999 } as const;
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 } as const;
export const font = {
  size: { xs: 11, sm: 12, md: 13, base: 14, lg: 15, xl: 17, title: 20, display: 22, code: 28 },
  weight: { regular: "400", medium: "500", semibold: "600", bold: "700", extrabold: "800" },
} as const;

export type ColorToken = keyof typeof colors;
