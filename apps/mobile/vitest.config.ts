import { defineConfig } from 'vitest/config';

// Pure-TS logic only (sync queue, tracking policy). UI flows are covered by Maestro.
export default defineConfig({ test: { include: ['test/**/*.test.ts'] } });
