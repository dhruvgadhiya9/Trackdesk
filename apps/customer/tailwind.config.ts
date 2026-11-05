import type { Config } from 'tailwindcss';
import { trackdeskPreset } from '@trackdesk/ui/tailwind-preset';

export default {
  presets: [trackdeskPreset],
  content: ['./app/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
} satisfies Config;
