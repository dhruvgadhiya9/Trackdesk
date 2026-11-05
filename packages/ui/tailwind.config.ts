import type { Config } from 'tailwindcss';
import { trackdeskPreset } from './src/tailwind-preset';

export default {
  presets: [trackdeskPreset],
  content: ['./src/**/*.{ts,tsx}', './.storybook/**/*.{ts,tsx}'],
} satisfies Config;
