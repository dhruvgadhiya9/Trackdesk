/* eslint-disable design-tokens/no-raw-design-values -- the ONLY place raw design values may live. */
/**
 * TrackDesk design tokens — structured like Figma variables (collection → group → token, each with
 * a `$value` and `$type`). PLACEHOLDER VALUES until the designer publishes the Figma library;
 * regenerate with `pnpm tokens:sync` (scripts/figma-tokens-sync.ts). Do not hand-edit after sync.
 *
 * Consumers never import raw values directly in app code: web uses the Tailwind preset
 * (`@trackdesk/ui/tailwind-preset`), mobile uses `@trackdesk/ui-native` which reads these tokens.
 */

type Token<T, K extends string> = { $value: T; $type: K };
type Color = Token<string, 'color'>;
type Dimension = Token<number, 'dimension'>;

const c = (v: string): Color => ({ $value: v, $type: 'color' });
const d = (v: number): Dimension => ({ $value: v, $type: 'dimension' });

/** Collection "primitives" — raw palette. Not used directly by components. */
export const primitives = {
  color: {
    blue: { 50: c('#EEF4FF'), 100: c('#DCE8FF'), 500: c('#2F6FED'), 600: c('#1F5AD6'), 700: c('#1A48A8') },
    slate: {
      0: c('#FFFFFF'),
      50: c('#F7F8FA'),
      100: c('#EEF0F4'),
      200: c('#DDE1E8'),
      400: c('#9AA3B2'),
      500: c('#5F6878'), // AA: >= 4.5:1 on canvas, surface and subtle (axe)
      700: c('#363D4A'),
      900: c('#121722'),
    },
    green: { 50: c('#ECFDF3'), 600: c('#16A34A'), 700: c('#15803D') },
    amber: { 50: c('#FFFAEB'), 500: c('#F59E0B'), 700: c('#B45309') },
    red: { 50: c('#FEF2F2'), 600: c('#DC2626'), 700: c('#B91C1C') },
    violet: { 50: c('#F5F3FF'), 600: c('#7C3AED') },
    teal: { 50: c('#F0FDFA'), 600: c('#0D9488') },
  },
} as const;

const p = primitives.color;

/** Collection "semantic" — what components use. */
export const semantic = {
  color: {
    bg: { canvas: p.slate[50], surface: p.slate[0], subtle: p.slate[100], inverse: p.slate[900] },
    fg: { default: p.slate[900], muted: p.slate[500], subtle: p.slate[400], inverse: p.slate[0], link: p.blue[600] },
    border: { default: p.slate[200], strong: p.slate[400], focus: p.blue[500] },
    primary: { default: p.blue[600], hover: p.blue[700], subtle: p.blue[50], fg: p.slate[0] },
    success: { default: p.green[600], subtle: p.green[50], fg: p.green[700] },
    warning: { default: p.amber[500], subtle: p.amber[50], fg: p.amber[700] },
    danger: { default: p.red[600], subtle: p.red[50], fg: p.red[700] },
    info: { default: p.blue[500], subtle: p.blue[100], fg: p.blue[700] },
    /** Job status colours (Badge, JobCard, dispatch board). */
    status: {
      draft: p.slate[400],
      scheduled: p.blue[500],
      dispatched: p.violet[600],
      enRoute: p.teal[600],
      onSite: p.amber[500],
      completed: p.green[600],
      verified: p.green[700],
      invoiced: p.slate[700],
      cancelled: p.slate[500],
      overdue: p.red[600],
    },
  },
} as const;

/** Collection "spacing" — 4px grid (numbers in px; RN uses numbers, Tailwind gets px strings). */
export const spacing = {
  0: d(0),
  0.5: d(2),
  1: d(4),
  1.5: d(6),
  2: d(8),
  3: d(12),
  4: d(16),
  5: d(20),
  6: d(24),
  8: d(32),
  10: d(40),
  12: d(48),
  16: d(64),
  20: d(80),
  24: d(96),
  64: d(256),
  80: d(320),
  96: d(384),
} as const;

export const radius = {
  none: d(0),
  sm: d(4),
  md: d(8),
  lg: d(12),
  xl: d(16),
  full: d(9999),
} as const;

export const typography = {
  fontFamily: {
    sans: { $value: 'Inter, ui-sans-serif, system-ui, sans-serif', $type: 'fontFamily' },
    mono: { $value: 'ui-monospace, SFMono-Regular, Menlo, monospace', $type: 'fontFamily' },
  },
  /** [fontSize, lineHeight] in px */
  fontSize: {
    xs: { $value: [12, 16], $type: 'typography' },
    sm: { $value: [14, 20], $type: 'typography' },
    md: { $value: [16, 24], $type: 'typography' },
    lg: { $value: [18, 28], $type: 'typography' },
    xl: { $value: [20, 28], $type: 'typography' },
    '2xl': { $value: [24, 32], $type: 'typography' },
    '3xl': { $value: [30, 36], $type: 'typography' },
  },
  fontWeight: {
    regular: { $value: 400, $type: 'fontWeight' },
    medium: { $value: 500, $type: 'fontWeight' },
    semibold: { $value: 600, $type: 'fontWeight' },
    bold: { $value: 700, $type: 'fontWeight' },
  },
} as const;

export const shadow = {
  none: { $value: 'none', $type: 'shadow' },
  sm: { $value: '0 1px 2px 0 rgba(18, 23, 34, 0.06)', $type: 'shadow' },
  md: { $value: '0 4px 12px -2px rgba(18, 23, 34, 0.10)', $type: 'shadow' },
  lg: { $value: '0 12px 32px -8px rgba(18, 23, 34, 0.18)', $type: 'shadow' },
} as const;

/** Breakpoints the playbook tests against (1280 / 1440) plus mobile. */
export const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1440 } as const;

export const tokens = { primitives, semantic, spacing, radius, typography, shadow, breakpoints } as const;
export type Tokens = typeof tokens;

/** Job statuses as used by the API contract (snake_case) mapped to status colour keys. */
export const JOB_STATUS_TOKEN = {
  draft: 'draft',
  scheduled: 'scheduled',
  dispatched: 'dispatched',
  en_route: 'enRoute',
  on_site: 'onSite',
  completed: 'completed',
  verified: 'verified',
  invoiced: 'invoiced',
  cancelled: 'cancelled',
  overdue: 'overdue',
} as const;
export type JobStatusKey = keyof typeof JOB_STATUS_TOKEN;
