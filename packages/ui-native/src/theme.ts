/**
 * React Native view of the shared design tokens (same source as the web Tailwind preset).
 * Components read ONLY from `theme` — never raw colours or numbers.
 */
import { radius, semantic, spacing, typography } from '@trackdesk/ui/tokens';

type Leaf = { $value: string };
type Group = { [k: string]: Leaf | Group };

function unwrap<T extends Group>(group: T): { [K in keyof T]: T[K] extends Leaf ? string : never } {
  return Object.fromEntries(Object.entries(group).map(([k, v]) => [k, (v as Leaf).$value])) as {
    [K in keyof T]: T[K] extends Leaf ? string : never;
  };
}

export const theme = {
  color: {
    bg: unwrap(semantic.color.bg),
    fg: unwrap(semantic.color.fg),
    border: unwrap(semantic.color.border),
    primary: unwrap(semantic.color.primary),
    success: unwrap(semantic.color.success),
    warning: unwrap(semantic.color.warning),
    danger: unwrap(semantic.color.danger),
    info: unwrap(semantic.color.info),
    status: unwrap(semantic.color.status),
  },
  space: (key: keyof typeof spacing) => spacing[key].$value,
  radius: (key: keyof typeof radius) => radius[key].$value,
  font: (key: keyof typeof typography.fontSize) => ({
    fontSize: typography.fontSize[key].$value[0],
    lineHeight: typography.fontSize[key].$value[1],
  }),
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  } as const,
} as const;

export type Theme = typeof theme;
