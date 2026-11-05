import { defineConfig } from 'orval';

// TS side of the OpenAPI-first contract. Input is the bundled spec produced by
// scripts/bundle-openapi.mjs. Outputs are committed and drift-checked in CI.
export default defineConfig({
  client: {
    input: { target: './generated/openapi.bundled.yaml' },
    output: {
      target: './src/generated/client.ts',
      schemas: './src/generated/model',
      client: 'fetch',
      mode: 'single',
      clean: true,
      prettier: false,
      override: {
        mutator: { path: './src/http/fetcher.ts', name: 'customFetch' },
      },
    },
  },
  zod: {
    input: { target: './generated/openapi.bundled.yaml' },
    output: {
      target: './src/generated/zod.ts',
      client: 'zod',
      mode: 'single',
      prettier: false,
    },
  },
});
