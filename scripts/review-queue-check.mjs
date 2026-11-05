#!/usr/bin/env node
// Fails if any file containing a SECURITY-REVIEW-REQUIRED marker is not covered by an entry in
// docs/REVIEW-QUEUE.md (an entry covers a file when its path, or a parent directory, is listed).
// Run: pnpm review-queue:check (also in CI).
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const MARKER = 'SECURITY-REVIEW-REQUIRED';
const SKIP = new Set(['node_modules', '.git', '.next', 'build', 'dist', '.turbo', '.gradle', 'generated', 'docs', '.expo', 'test-results', 'playwright-report']);
const EXT = /\.(java|sql|ts|tsx|mjs|js|yaml|yml|kts|tf)$/;

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (EXT.test(name)) yield p;
  }
}

const queue = readFileSync(join(root, 'docs', 'REVIEW-QUEUE.md'), 'utf8');
const listed = [...queue.matchAll(/`([^`]+)`/g)].map((m) => m[1].replace(/\/$/, ''));
const self = relative(root, fileURLToPath(import.meta.url)).split(sep).join('/');

const missing = [];
for (const file of walk(root)) {
  const rel = relative(root, file).split(sep).join('/');
  if (rel === self) continue;
  if (!readFileSync(file, 'utf8').includes(MARKER)) continue;
  const covered = listed.some((entry) => rel === entry || rel.startsWith(`${entry}/`) || entry.split(/[ ,+]+/).some((e) => e && rel.endsWith(e)));
  if (!covered) missing.push(rel);
}

if (missing.length) {
  console.error(`Files marked ${MARKER} but not listed in docs/REVIEW-QUEUE.md:\n  ${missing.join('\n  ')}`);
  process.exit(1);
}
console.log(`review-queue: all ${MARKER} files are listed.`);
