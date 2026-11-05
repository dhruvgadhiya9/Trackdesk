import { defineConfig } from 'vitest/config';

// Unit/component tests only; Playwright specs live in e2e/ and run via `pnpm e2e`.
export default defineConfig({
  test: { include: ['**/*.test.{ts,tsx}'], exclude: ['e2e/**', 'node_modules/**', '.next/**'] },
});
