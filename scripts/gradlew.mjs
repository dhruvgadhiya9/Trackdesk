#!/usr/bin/env node
// Cross-platform shim so package.json scripts can call the Gradle wrapper in apps/api on
// Windows (gradlew.bat) and Unix (./gradlew) alike. Usage: node scripts/gradlew.mjs <tasks...>
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const apiDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'apps', 'api');
const isWin = process.platform === 'win32';
const cmd = isWin ? 'gradlew.bat' : './gradlew';
const result = spawnSync(cmd, process.argv.slice(2), {
  cwd: apiDir,
  stdio: 'inherit',
  shell: isWin,
});
process.exit(result.status ?? 1);
