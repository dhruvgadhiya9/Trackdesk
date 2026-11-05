/**
 * Tailwind preset GENERATED FROM tokens.ts at import time. The theme REPLACES Tailwind's defaults
 * (not `extend`) so only token values exist: `bg-primary`, `text-fg-muted`, `p-4`, `rounded-md`…
 * Arbitrary values (`p-[13px]`) are banned by the design-token lint rule.
 */
import type { Config } from 'tailwindcss';
import { breakpoints, radius, semantic, shadow, spacing, typography } from './tokens';

type Nested = { [key: string]: string | Nested };

function flattenColors(group: Record<string, unknown>): Nested {
  const out: Nested = {};
  for (const [key, value] of Object.entries(group)) {
    if (value && typeof value === 'object' && '$value' in value) {
      out[key === 'default' ? 'DEFAULT' : kebab(key)] = String((value as { $value: string }).$value);
    } else if (value && typeof value === 'object') {
      out[kebab(key)] = flattenColors(value as Record<string, unknown>);
    }
  }
  return out;
}

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
const px = (n: number) => `${n}px`;
const mapDims = <T extends Record<string, { $value: number }>>(group: T) =>
  Object.fromEntries(Object.entries(group).map(([k, v]) => [k, px(v.$value)]));

export const trackdeskPreset = {
  content: [],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      ...flattenColors(semantic.color),
    },
    spacing: mapDims(spacing),
    borderRadius: { ...mapDims(radius), DEFAULT: px(radius.md.$value) },
    fontFamily: Object.fromEntries(
      Object.entries(typography.fontFamily).map(([k, v]) => [k, v.$value.split(', ')]),
    ),
    fontSize: Object.fromEntries(
      Object.entries(typography.fontSize).map(([k, v]) => [
        k,
        [px(v.$value[0]), { lineHeight: px(v.$value[1]) }],
      ]),
    ),
    fontWeight: Object.fromEntries(
      Object.entries(typography.fontWeight).map(([k, v]) => [k, String(v.$value)]),
    ),
    boxShadow: Object.fromEntries(Object.entries(shadow).map(([k, v]) => [k, v.$value])),
    screens: Object.fromEntries(Object.entries(breakpoints).map(([k, v]) => [k, px(v)])),
    extend: {
      maxWidth: { content: px(1440) },
      zIndex: { modal: '50', toast: '60' },
    },
  },
  plugins: [],
} satisfies Config;

export default trackdeskPreset;
