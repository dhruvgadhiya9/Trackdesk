#!/usr/bin/env node
// Claude Code PostToolUse hook: after an edit, lint/typecheck the touched TS package, or run
// `./gradlew spotlessApply compileJava` for Java. Exit code 2 feeds the errors back to Claude.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';

const input = JSON.parse(readFileSync(0, 'utf8') || '{}');
const file = input.tool_input?.file_path;
if (!file) process.exit(0);
const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const rel = relative(root, resolve(file)).split(sep).join('/');
const isWin = process.platform === 'win32';

function run(cmd, args, cwd) {
  const r = spawnSync(cmd, args, { cwd, encoding: 'utf8', shell: isWin });
  return { ok: r.status === 0, out: `${r.stdout ?? ''}${r.stderr ?? ''}`.slice(-4000) };
}

let result = { ok: true, out: '' };
if (rel.startsWith('apps/api/') && rel.endsWith('.java')) {
  result = run(isWin ? 'gradlew.bat' : './gradlew', ['-q', 'spotlessApply', 'compileJava'], join(root, 'apps/api'));
} else if (/\.(ts|tsx)$/.test(rel) && !rel.includes('/generated/')) {
  // Find the nearest package.json
  let dir = dirname(resolve(file));
  while (dir.startsWith(root) && !existsSync(join(dir, 'package.json'))) dir = dirname(dir);
  if (dir !== root) {
    const lint = run('pnpm', ['exec', 'eslint', '--max-warnings=0', resolve(file)], dir);
    const tsc = run('pnpm', ['exec', 'tsc', '--noEmit', '-p', '.'], dir);
    result = { ok: lint.ok && tsc.ok, out: `${lint.out}\n${tsc.out}` };
  }
} else if (rel.startsWith('packages/contracts/openapi/') || rel === 'packages/contracts/permissions.yaml') {
  console.error('Contract changed: run `pnpm contracts:generate` and commit the generated files.');
}

if (!result.ok) {
  console.error(`Post-edit checks failed for ${rel}:\n${result.out}`);
  process.exit(2);
}
