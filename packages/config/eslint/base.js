import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import { designTokenRules } from './design-tokens.js';

export const ignores = {
  ignores: [
    '**/node_modules/**',
    '**/dist/**',
    '**/.next/**',
    '**/coverage/**',
    '**/generated/**',
    '**/storybook-static/**',
    '**/.expo/**',
    '**/*.config.{js,cjs,mjs,ts}',
  ],
};

/** Base flat config for every TS package. */
export default tseslint.config(
  ignores,
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  designTokenRules,
  { files: ['**/scripts/**', '**/e2e/**'], rules: { 'no-console': 'off' } },
);
